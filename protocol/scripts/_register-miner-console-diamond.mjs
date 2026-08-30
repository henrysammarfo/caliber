import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import {
  createWalletClient,
  createPublicClient,
  http,
  decodeEventLog,
  parseAbi,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");

const CONSOLE_DIAMOND = "0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8";
const DOCS_DIAMOND = "0x122396E8602BEed349434AA6E83123E7dD97F5A0";
const DIAMOND = process.env.DIAMOND || CONSOLE_DIAMOND;
const YAML_URL =
  process.env.YAML_URL ||
  "https://gateway.pinata.cloud/ipfs/QmVTkdLFe6sxJpXqBkPeHzBGwy392q9ezDRP7WgEobxYS6";
const FEE = "0x9ADd0ac311e9E528800afc3F4A04e9cDe52C9cE0";
const MIN_PRICE = 10000n;
const INTENTS = ["AI_TEXT_DETECTION"];

const abi = parseAbi([
  "function registerMiner(string yamlUrl, bytes32 yamlHash, address feeAddress, uint256 minPriceUsdc, string[] intents) returns (uint256)",
  "event MinerRegistered(uint256 indexed registrationId, address indexed miner, string yamlUrl, bytes32 yamlHash, address feeAddress, uint256 minPriceUsdc, string[] supportedIntents)",
]);

function loadEnv() {
  const envPath = path.join(repoRoot, ".env");
  const text = fs.readFileSync(envPath, "utf8");
  const out = {};
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m) continue;
    out[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

function maskAddr(a) {
  return a.slice(0, 6) + "..." + a.slice(-4);
}

async function main() {
  const env = loadEnv();
  const pk = env.PRIVATE_KEY;
  if (!pk) throw new Error("PRIVATE_KEY missing");
  const account = privateKeyToAccount(pk.startsWith("0x") ? pk : "0x" + pk);
  const rpc = env.EVM_RPC_URL || env.BASE_SEPOLIA_RPC || "https://sepolia.base.org";

  const yamlPath = path.join(repoRoot, "protocol/yaml/caliber-truthport.yaml");
  let yamlHash =
    env.YAML_HASH ||
    "0x" + createHash("sha256").update(fs.readFileSync(yamlPath)).digest("hex");
  if (!yamlHash.startsWith("0x")) yamlHash = "0x" + yamlHash;

  console.log("wallet", maskAddr(account.address));
  console.log("rpc", rpc);
  console.log("diamond", DIAMOND);
  console.log("yamlUrl", YAML_URL);
  console.log("yamlHash", yamlHash);
  console.log("fee", FEE);
  console.log("minPrice", String(MIN_PRICE));
  console.log("intents", INTENTS.join(","));

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(rpc, { timeout: 60_000 }),
  });
  const walletClient = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(rpc, { timeout: 60_000 }),
  });

  const out = {
    asOf: new Date().toISOString(),
    wallet: account.address,
    diamond: DIAMOND,
    consoleDiamond: CONSOLE_DIAMOND,
    docsDiamond: DOCS_DIAMOND,
    yamlUrl: YAML_URL,
    yamlHash,
    feeAddress: FEE,
    minPriceUsdc: Number(MIN_PRICE),
    intents: INTENTS,
    simulate: null,
    register: null,
  };

  const sim = await publicClient.simulateContract({
    address: DIAMOND,
    abi,
    functionName: "registerMiner",
    args: [YAML_URL, yamlHash, FEE, MIN_PRICE, INTENTS],
    account: account.address,
  });
  out.simulate = { ok: true, result: String(sim.result) };
  console.log("simulate_ok", out.simulate.result);

  const txHash = await walletClient.writeContract({
    address: DIAMOND,
    abi,
    functionName: "registerMiner",
    args: [YAML_URL, yamlHash, FEE, MIN_PRICE, INTENTS],
  });
  console.log("registerTx", txHash);
  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
  let registrationId = null;
  for (const log of receipt.logs) {
    try {
      const decoded = decodeEventLog({ abi, data: log.data, topics: log.topics });
      if (decoded.eventName === "MinerRegistered") {
        registrationId = Number(decoded.args.registrationId);
      }
    } catch {}
  }
  out.register = {
    registrationId,
    txHash,
    status: receipt.status,
    blockNumber: Number(receipt.blockNumber),
    explorerUrl: "https://sepolia.basescan.org/tx/" + txHash,
  };
  console.log("registerStatus", receipt.status, "id", registrationId, "block", Number(receipt.blockNumber));

  const outPath = path.join(repoRoot, "memory/research-raw/x402/reregister-result-console-diamond.json");
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log("wrote", outPath);
}

main().catch((e) => {
  console.error("FATAL", (e.shortMessage || e.message || String(e)).slice(0, 500));
  process.exit(1);
});
