/**
 * Track 3 smoke — paid dispatcher queries for 5 intents.
 * Reads PRIVATE_KEY from repo-root .env. Never prints the key.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { x402Client, wrapFetchWithPayment } from "@x402/fetch";
import { ExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const DISPATCHER = "http://13.237.89.59:7044/miner-dispatcher";

const ROUTES = [
  {
    intent: "AI_TEXT_DETECTION",
    url: `${DISPATCHER}/v1/20260830/detect`,
    method: "POST",
    body: { text: "The committee will convene at noon to review the quarterly report." },
  },
  {
    intent: "WEATHER_FORECAST",
    url: `${DISPATCHER}/v1/82920263/weather-forecast?query=${encodeURIComponent("New York 3 day forecast")}`,
    method: "GET",
  },
  {
    intent: "CRYPTO_PRICE",
    url: `${DISPATCHER}/v1/7311/price?query=BTC`,
    method: "GET",
  },
  {
    intent: "FRAUD_DETECTION",
    url: `${DISPATCHER}/v1/91001/fraud`,
    method: "POST",
    body: { query: "Is this Ethereum transfer pattern high risk?" },
  },
  {
    intent: "NEWS_SEARCH",
    url: `${DISPATCHER}/v1/9004/news?query=${encodeURIComponent("AI regulation")}`,
    method: "GET",
  },
];

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

async function main() {
  const env = loadEnv();
  const pk = env.PRIVATE_KEY || env.EVM_PRIVATE_KEY;
  if (!pk) throw new Error("PRIVATE_KEY missing");
  const account = privateKeyToAccount(pk.startsWith("0x") ? pk : `0x${pk}`);
  const rpcUrl = env.EVM_RPC_URL || env.BASE_SEPOLIA_RPC || "https://sepolia.base.org";
  const client = new x402Client();
  client.register("eip155:*", new ExactEvmScheme(account, { rpcUrl }));
  const paid = wrapFetchWithPayment(fetch, client);

  console.log("payerAddress", account.address);
  const results = [];
  for (const r of ROUTES) {
    const started = Date.now();
    console.log("TRY", r.intent, r.method, r.url);
    try {
      const res = await paid(r.url, {
        method: r.method,
        headers: { accept: "application/json", ...(r.body ? { "content-type": "application/json" } : {}) },
        ...(r.body ? { body: JSON.stringify(r.body) } : {}),
      });
      const text = await res.text();
      const snippet = text.slice(0, 240).replace(/\s+/g, " ");
      const row = { intent: r.intent, status: res.status, ms: Date.now() - started, snippet };
      results.push(row);
      console.log("OK?", res.status, `${row.ms}ms`, snippet);
    } catch (e) {
      const row = { intent: r.intent, status: 0, ms: Date.now() - started, snippet: String(e).slice(0, 240) };
      results.push(row);
      console.log("ERR", r.intent, row.snippet);
    }
  }
  const outPath = path.join(repoRoot, "memory/artifacts/track3-intel-smoke.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify({ at: new Date().toISOString(), results }, null, 2));
  console.log("wrote", outPath);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
