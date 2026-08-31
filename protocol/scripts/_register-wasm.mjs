/**
 * registerWasm on Telegraph Diamond (Base Sepolia).
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
  keccak256,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");

const DIAMOND = process.env.WASM_DIAMOND || "0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8";
const MINER_DIAMOND_DOCS = "0x122396E8602BEed349434AA6E83123E7dD97F5A0"; // registerMiner; no registerWasm facet
const INTENT = "AI_TEXT_DETECTION";
const PRIOR_HASH =
  "0x3a03494271e366684382ecdea0b037c1f02eb7463ffa639e368565a2fbb1dfdb";
const PINATA_URL =
  "https://gateway.pinata.cloud/ipfs/QmWxjGDseqgfmMwCX1x6REANA6f1vvFpo6uJe6vsQsBDff";
const VERCEL_URL =
  "https://caliber-teamtitanlink.vercel.app/gradelock.wasm";

const abi = parseAbi([
  "function registerWasm(bytes32 wasmHash, string wasmUrl, string intent) returns (uint256)",
  "event WasmRegistered(uint256 indexed registrationId, address indexed author, bytes32 indexed intentId, string intent, bytes32 wasmHash, string wasmUrl)",
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

async function fetchBytes(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 45000);
  try {
    const r = await fetch(url, { signal: ctrl.signal });
    if (!r.ok) throw new Error(`fetch ${url} -> ${r.status}`);
    return new Uint8Array(await r.arrayBuffer());
  } finally {
    clearTimeout(t);
  }
}

async function main() {
  const env = loadEnv();
  const pk = env.PRIVATE_KEY;
  if (!pk) throw new Error("PRIVATE_KEY missing");
  const account = privateKeyToAccount(pk.startsWith("0x") ? pk : `0x${pk}`);
  const rpc =
    env.EVM_RPC_URL || env.BASE_SEPOLIA_RPC || "https://sepolia.base.org";

  const localPath = path.join(repoRoot, "public/gradelock.wasm");
  const localBytes = fs.readFileSync(localPath);
  const localHash = keccak256(localBytes);

  let pinataHash = null;
  let vercelHash = null;
  let pinataErr = null;
  let vercelErr = null;
  try {
    pinataHash = keccak256(await fetchBytes(PINATA_URL));
  } catch (e) {
    pinataErr = String(e?.message || e);
  }
  try {
    vercelHash = keccak256(await fetchBytes(VERCEL_URL));
  } catch (e) {
    vercelErr = String(e?.message || e);
  }

  // Prefer Pinata URL if hash matches prior/local; else vercel; else env override
  let wasmUrl = process.env.WASM_URL || "";
  let wasmHash = process.env.WASM_HASH || "";

  if (!wasmHash) {
    if (pinataHash && (pinataHash === PRIOR_HASH || pinataHash === localHash)) {
      wasmHash = pinataHash;
      if (!wasmUrl) wasmUrl = PINATA_URL;
    } else if (
      vercelHash &&
      (vercelHash === PRIOR_HASH || vercelHash === localHash)
    ) {
      wasmHash = vercelHash;
      if (!wasmUrl) wasmUrl = VERCEL_URL;
    } else if (localHash === PRIOR_HASH || !PRIOR_HASH) {
      wasmHash = localHash;
      if (!wasmUrl) wasmUrl = pinataHash ? PINATA_URL : VERCEL_URL;
    } else {
      // Prefer prior console hash + Pinata URL if bytes available
      wasmHash = PRIOR_HASH;
      if (!wasmUrl) wasmUrl = PINATA_URL;
    }
  }
  if (!wasmUrl) wasmUrl = PINATA_URL;
  if (!wasmHash.startsWith("0x")) wasmHash = "0x" + wasmHash;

  const out = {
    asOf: new Date().toISOString(),
    wallet: account.address,
    diamond: DIAMOND,
    intent: INTENT,
    wasmUrl,
    wasmHash,
    hashes: {
      prior: PRIOR_HASH,
      local: localHash,
      pinata: pinataHash,
      vercel: vercelHash,
      pinataErr,
      vercelErr,
    },
    register: null,
  };

  console.log("wallet", maskAddr(account.address));
  console.log("rpc", rpc);
  console.log("diamond", DIAMOND);
  console.log("localHash", localHash);
  console.log("pinataHash", pinataHash, pinataErr || "");
  console.log("vercelHash", vercelHash, vercelErr || "");
  console.log("priorHash", PRIOR_HASH);
  console.log("usingHash", wasmHash);
  console.log("usingUrl", wasmUrl);
  console.log("intent", INTENT);

  if (wasmHash !== localHash) {
    console.warn(
      "WARN: using hash differs from local public/gradelock.wasm keccak",
    );
  }
  if (pinataHash && wasmHash !== pinataHash) {
    console.warn("WARN: using hash differs from Pinata bytes keccak");
  }

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(rpc),
  });
  const walletClient = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(rpc),
  });

  // Simulate first for clear ABI errors
  try {
    await publicClient.simulateContract({
      address: DIAMOND,
      abi,
      functionName: "registerWasm",
      args: [wasmHash, wasmUrl, INTENT],
      account: account.address,
    });
    console.log("simulate: ok");
  } catch (e) {
    const msg = e?.shortMessage || e?.message || String(e);
    out.register = { error: msg, phase: "simulate" };
    const outPath = path.join(__dirname, "register-wasm-result.json");
    fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
    console.error("SIMULATE_FAIL", msg);
    process.exitCode = 1;
    return;
  }

  const txHash = await walletClient.writeContract({
    address: DIAMOND,
    abi,
    functionName: "registerWasm",
    args: [wasmHash, wasmUrl, INTENT],
  });
  console.log("tx", txHash);
  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
  console.log("status", receipt.status, "block", Number(receipt.blockNumber));

  let registrationId = null;
  let intentId = null;
  for (const log of receipt.logs) {
    try {
      const decoded = decodeEventLog({
        abi,
        data: log.data,
        topics: log.topics,
      });
      if (decoded.eventName === "WasmRegistered") {
        registrationId = decoded.args.registrationId.toString();
        intentId = decoded.args.intentId;
      }
    } catch {
      /* skip */
    }
  }

  out.register = {
    txHash,
    status: receipt.status,
    blockNumber: Number(receipt.blockNumber),
    registrationId,
    intentId,
  };
  console.log("registrationId", registrationId);
  console.log("intentId", intentId);

  const outPath = path.join(__dirname, "register-wasm-result.json");
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log("wrote", outPath);
}

main().catch((e) => {
  console.error("FATAL", e?.shortMessage || e?.message || e);
  process.exit(1);
});
