import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createPublicClient, http, parseAbi } from "viem";
import { baseSepolia } from "viem/chains";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");

function loadEnv() {
  const text = fs.readFileSync(path.join(repoRoot, ".env"), "utf8");
  const out = {};
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m) continue;
    out[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

function serialize(v) {
  if (typeof v === "bigint") return v.toString();
  if (Array.isArray(v)) return v.map(serialize);
  if (v && typeof v === "object") {
    const o = {};
    for (const [k, val] of Object.entries(v)) o[k] = serialize(val);
    return o;
  }
  return v;
}

const env = loadEnv();
const rpc = env.EVM_RPC_URL || env.BASE_SEPOLIA_RPC || "https://sepolia.base.org";
const DIAMOND = "0x122396E8602BEed349434AA6E83123E7dD97F5A0";
const REG = 46n;
const EXPECTED =
  "69f4d780f931eb5c07e7ebe6b3558f51b24d4da2a7fa944c0cf3c477de99095e";
const OUR_URL =
  "https://caliber-teamtitanlink.vercel.app/protocol/caliber-truthport.yaml";

const client = createPublicClient({
  chain: baseSepolia,
  transport: http(rpc),
});

const abi = parseAbi([
  "function getMiner(uint256 registrationId) view returns (string yamlUrl, bytes32 yamlHash, address feeAddress, uint256 minPriceUsdc, string[] intents, address registrant, bool active)",
  "function getRegistration(uint256 registrationId) view returns (string yamlUrl, bytes32 yamlHash, address feeAddress, uint256 minPriceUsdc, string[] intents, address registrant, bool active)",
  "function registrations(uint256 registrationId) view returns (string yamlUrl, bytes32 yamlHash, address feeAddress, uint256 minPriceUsdc, address registrant, bool active)",
  "function miners(uint256 registrationId) view returns (string yamlUrl, bytes32 yamlHash, address feeAddress, uint256 minPriceUsdc, address registrant, bool active)",
  "function getRegistrationCount() view returns (uint256)",
  "function registrationCount() view returns (uint256)",
]);

const attempts = [];
for (const fn of [
  "getMiner",
  "getRegistration",
  "registrations",
  "miners",
  "getRegistrationCount",
  "registrationCount",
]) {
  try {
    const result = await client.readContract({
      address: DIAMOND,
      abi,
      functionName: fn,
      args: fn.includes("Count") ? [] : [REG],
    });
    attempts.push({ fn, ok: true, result: serialize(result) });
    console.log("OK", fn, JSON.stringify(serialize(result)).slice(0, 400));
  } catch (e) {
    attempts.push({
      fn,
      ok: false,
      error: String(e.shortMessage || e.message).slice(0, 250),
    });
    console.log("FAIL", fn, String(e.shortMessage || e.message).slice(0, 180));
  }
}

const out = { asOf: new Date().toISOString(), rpcHost: new URL(rpc).host, attempts };
const ok = attempts.find(
  (a) => a.ok && !String(a.fn).includes("Count"),
);
if (ok) {
  const r = ok.result;
  const yamlUrl = Array.isArray(r) ? r[0] : r.yamlUrl;
  const yamlHash = String(Array.isArray(r) ? r[1] : r.yamlHash);
  const hashHex = yamlHash.replace(/^0x/, "").toLowerCase();
  out.parsed = {
    source: ok.fn,
    yamlUrl,
    yamlHash,
    hashMatchesExpected: hashHex === EXPECTED,
    urlMatches: yamlUrl === OUR_URL,
    feeAddress: Array.isArray(r) ? r[2] : r.feeAddress,
    minPriceUsdc: String(Array.isArray(r) ? r[3] : r.minPriceUsdc),
    intents: Array.isArray(r) ? r[4] : r.intents,
    registrant: Array.isArray(r) ? r[5] : r.registrant,
    active: Array.isArray(r) ? r[6] : r.active,
  };
}

fs.writeFileSync(
  path.join(__dirname, "_onchain-46.json"),
  JSON.stringify(out, null, 2),
);
console.log("wrote _onchain-46.json", out.parsed ? "parsed" : "no-parse");
