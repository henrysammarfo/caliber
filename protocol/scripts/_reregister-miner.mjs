/**
 * Deregister registrationId 46 then registerMiner with live-aligned YAML.
 * PRIVATE_KEY from repo-root .env only. Never prints the key.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
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

const DIAMOND = "0x122396E8602BEed349434AA6E83123E7dD97F5A0";
const YAML_URL =
  process.env.YAML_URL ||
  "https://raw.githubusercontent.com/henrysammarfo/caliber/c10e58f49eb95b97580416bac767e4477ded78bb/public/protocol/caliber-truthport.yaml";
// Filled by caller / after hash-yaml — override via env YAML_HASH if set
const FEE = "0x9ADd0ac311e9E528800afc3F4A04e9cDe52C9cE0";
const MIN_PRICE = 10000n;
const INTENTS = ["AI_TEXT_DETECTION"];
const OLD_REG_ID = BigInt(process.env.OLD_REG_ID || "51");

const abi = parseAbi([
  "function deregisterMiner(uint256 registrationId)",
  "function registerMiner(string yamlUrl, bytes32 yamlHash, address feeAddress, uint256 minPriceUsdc, string[] intents) returns (uint256)",
  "event MinerRegistered(uint256 indexed registrationId, address indexed feeAddress, string yamlUrl, bytes32 yamlHash)",
  "event MinerDeregistered(uint256 indexed registrationId)",
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
  return `${a.slice(0, 6)}...${a.slice(-4)}`;
}

async function main() {
  const env = loadEnv();
  const pk = env.PRIVATE_KEY;
  if (!pk) throw new Error("PRIVATE_KEY missing");
  const account = privateKeyToAccount(pk.startsWith("0x") ? pk : `0x${pk}`);
  const rpc =
    env.EVM_RPC_URL || env.BASE_SEPOLIA_RPC || "https://sepolia.base.org";

  let yamlHash = env.YAML_HASH;
  if (!yamlHash) {
    const yamlPath = path.join(
      repoRoot,
      "protocol/yaml/caliber-truthport.yaml",
    );
    const { createHash } = await import("node:crypto");
    yamlHash =
      "0x" +
      createHash("sha256").update(fs.readFileSync(yamlPath)).digest("hex");
  }
  if (!yamlHash.startsWith("0x")) yamlHash = "0x" + yamlHash;

  console.log("wallet", maskAddr(account.address));
  console.log("rpc", rpc);
  console.log("diamond", DIAMOND);
  console.log("yamlHash", yamlHash);
  console.log("fee", FEE);
  console.log("intents", INTENTS.join(","));

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(rpc),
  });
  const walletClient = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(rpc),
  });

  const out = {
    asOf: new Date().toISOString(),
    wallet: account.address,
    diamond: DIAMOND,
    yamlUrl: YAML_URL,
    yamlHash,
    feeAddress: FEE,
    minPriceUsdc: Number(MIN_PRICE),
    intents: INTENTS,
    deregister: null,
    register: null,
  };

  console.log("deregisterMiner", Number(OLD_REG_ID));
  const deregHash = await walletClient.writeContract({
    address: DIAMOND,
    abi,
    functionName: "deregisterMiner",
    args: [OLD_REG_ID],
  });
  console.log("deregisterTx", deregHash);
  const deregReceipt = await publicClient.waitForTransactionReceipt({
    hash: deregHash,
  });
  console.log(
    "deregisterStatus",
    deregReceipt.status,
    "block",
    Number(deregReceipt.blockNumber),
  );
  out.deregister = {
    registrationId: Number(OLD_REG_ID),
    txHash: deregHash,
    status: deregReceipt.status,
    blockNumber: Number(deregReceipt.blockNumber),
  };

  console.log("registerMiner...");
  const regHash = await walletClient.writeContract({
    address: DIAMOND,
    abi,
    functionName: "registerMiner",
    args: [YAML_URL, yamlHash, FEE, MIN_PRICE, INTENTS],
  });
  console.log("registerTx", regHash);
  const regReceipt = await publicClient.waitForTransactionReceipt({
    hash: regHash,
  });
  console.log(
    "registerStatus",
    regReceipt.status,
    "block",
    Number(regReceipt.blockNumber),
  );

  let registrationId = null;
  for (const log of regReceipt.logs) {
    try {
      const decoded = decodeEventLog({
        abi,
        data: log.data,
        topics: log.topics,
      });
      if (decoded.eventName === "MinerRegistered") {
        registrationId = Number(decoded.args.registrationId);
        console.log("registrationId", registrationId);
      }
    } catch {
      // not our event
    }
  }

  if (registrationId == null) {
    for (const log of regReceipt.logs) {
      if (
        log.address.toLowerCase() === DIAMOND.toLowerCase() &&
        log.topics?.[1]
      ) {
        const maybe = Number(BigInt(log.topics[1]));
        if (maybe > 0 && maybe < 1_000_000) {
          registrationId = maybe;
          console.log("registrationId(from topic1 heuristic)", registrationId);
          break;
        }
      }
    }
  }

  out.register = {
    registrationId,
    txHash: regHash,
    status: regReceipt.status,
    blockNumber: Number(regReceipt.blockNumber),
    explorerUrl: `https://sepolia.basescan.org/tx/${regHash}`,
  };

  const outPath = path.join(__dirname, "reregister-result.json");
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log("wrote", outPath);
  if (regReceipt.status !== "success") process.exitCode = 1;
}

main().catch((e) => {
  console.error("FATAL", String(e.message || e));
  process.exit(1);
});

