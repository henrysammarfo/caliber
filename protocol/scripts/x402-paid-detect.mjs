/**
 * Gate C — exercise Telegraph x402 paid path against miner-dispatcher.
 *
 * Reads PRIVATE_KEY from repo-root .env only. Never prints the key.
 *
 * Usage (from protocol/):
 *   node scripts/x402-paid-detect.mjs
 *   node scripts/x402-paid-detect.mjs --url http://13.237.89.59:7044/miner-dispatcher/v1/x402-test
 *   node scripts/x402-paid-detect.mjs --url .../v1/92001/detect --out memory/artifacts/x402-receipt-truthport.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { x402Client, wrapFetchWithPayment, x402HTTPClient } from "@x402/fetch";
import { ExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const protocolRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(protocolRoot, "..");

const DISPATCHER = "http://13.237.89.59:7044/miner-dispatcher";
const DEFAULT_URLS = [
  `${DISPATCHER}/v1/caliber-truthport-text-auth/detect`,
  `${DISPATCHER}/v1/92001/detect`,
  `${DISPATCHER}/v1/x402-test`,
];

function loadEnv() {
  const envPath = path.join(repoRoot, ".env");
  if (!fs.existsSync(envPath)) {
    throw new Error(".env not found at repo root");
  }
  const text = fs.readFileSync(envPath, "utf8");
  const out = {};
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m) continue;
    out[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

function parseArgs(argv) {
  const urls = [];
  let outRel = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--url" && argv[i + 1]) {
      urls.push(argv[++i]);
    } else if (argv[i] === "--out" && argv[i + 1]) {
      outRel = argv[++i];
    } else if (argv[i] === "--path" && argv[i + 1]) {
      const p = argv[++i].replace(/^\//, "");
      urls.push(`${DISPATCHER}/${p}`);
    }
  }
  return {
    urls: urls.length ? urls : DEFAULT_URLS,
    outRel: outRel || "memory/artifacts/x402-receipt.json",
  };
}

function decodeHeader(value) {
  if (!value) return null;
  try {
    return JSON.parse(Buffer.from(value, "base64").toString("utf8"));
  } catch {
    return value;
  }
}

async function main() {
  const env = loadEnv();
  const pk = env.PRIVATE_KEY;
  if (!pk) throw new Error("PRIVATE_KEY missing in .env");

  const { urls, outRel } = parseArgs(process.argv.slice(2));
  const account = privateKeyToAccount(pk.startsWith("0x") ? pk : `0x${pk}`);
  const rpcUrl = env.EVM_RPC_URL || env.BASE_SEPOLIA_RPC || "https://sepolia.base.org";

  console.log("payerAddress", account.address);
  console.log("rpc", rpcUrl);
  console.log("candidateUrls", urls.length);
  console.log("outRel", outRel);

  const client = new x402Client();
  client.register("eip155:*", new ExactEvmScheme(account, { rpcUrl }));
  const fetchWithPayment = wrapFetchWithPayment(fetch, client);
  const httpClient = new x402HTTPClient(client);

  const body = {
    text: "CALIBER Gate C x402 paid detect probe — short synthetic sample.",
  };

  const startedAt = new Date().toISOString();
  let success = null;
  const attempts = [];

  for (const url of urls) {
    const attempt = { url, startedAt: new Date().toISOString() };
    console.log("TRY", url);
    try {
      const isTest = url.includes("x402-test");
      const res = await fetchWithPayment(url, {
        method: isTest ? "GET" : "POST",
        headers: isTest
          ? { accept: "application/json" }
          : { accept: "application/json", "content-type": "application/json" },
        ...(isTest ? {} : { body: JSON.stringify(body) }),
      });

      const paymentResponseHdr = res.headers.get("PAYMENT-RESPONSE") || res.headers.get("payment-response");
      const text = await res.text();
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = text.slice(0, 4000);
      }

      attempt.status = res.status;
      attempt.paymentResponse = decodeHeader(paymentResponseHdr);
      attempt.body = parsed;

      // Prefer processResponse when available
      try {
        const processed = await httpClient.processResponse(
          new Response(text, {
            status: res.status,
            headers: res.headers,
          }),
        );
        attempt.processed = {
          status: processed?.status,
          paymentResponse: processed?.paymentResponse ?? undefined,
          // avoid dumping huge objects; keep keys only if unknown
          keys: processed && typeof processed === "object" ? Object.keys(processed) : undefined,
        };
      } catch (e) {
        attempt.processError = String(e.message || e);
      }

      console.log("STATUS", res.status);
      if (res.status >= 200 && res.status < 300) {
        success = attempt;
        attempts.push(attempt);
        break;
      }
      attempts.push(attempt);
    } catch (e) {
      attempt.error = String(e.message || e);
      console.log("ERROR", attempt.error);
      attempts.push(attempt);
    }
  }

  const receipt = {
    gate: "C",
    protocol: "x402",
    network: "eip155:84532",
    payerAddress: account.address,
    feeAddressDocs: "0x9ADd0ac311e9E528800afc3F4A04e9cDe52C9cE0",
    dispatcherBase: DISPATCHER,
    startedAt,
    finishedAt: new Date().toISOString(),
    success: Boolean(success),
    pathUsed: success?.url ?? null,
    httpStatus: success?.status ?? null,
    paymentResponse: success?.paymentResponse ?? null,
    responseBody: success?.body ?? null,
    attempts: attempts.map((a) => ({
      url: a.url,
      status: a.status ?? null,
      error: a.error ?? null,
      paymentResponse: a.paymentResponse ?? null,
    })),
  };

  const receiptPath = path.isAbsolute(outRel) ? outRel : path.join(repoRoot, outRel);
  fs.mkdirSync(path.dirname(receiptPath), { recursive: true });
  if (success) {
    fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2));
    console.log("RECEIPT", receiptPath);
    console.log("PATH_USED", success.url);
  } else {
    const failPath = path.join(repoRoot, "memory", "research-raw", "x402", "paid-attempt-fail.json");
    fs.writeFileSync(failPath, JSON.stringify(receipt, null, 2));
    console.log("FAILED — wrote", failPath);
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error("FATAL", String(e.message || e));
  process.exit(1);
});
