import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const outDir = path.dirname(fileURLToPath(import.meta.url));
const BASE = "http://13.237.89.59:7044/miner-dispatcher";
const candidates = [
  `${BASE}/healthz`,
  `${BASE}/integrations`,
  `${BASE}/openapi.json`,
  `${BASE}/v1/x402-test`,
  `${BASE}/v1/91001/detect`,
  `${BASE}/v1/caliber-truthport-text-auth/detect`,
  `${BASE}/v1/44/detect`,
  "https://integrate.telegraphprotocol.com/miner-dispatcher/healthz",
  "https://integrate.telegraphprotocol.com/api/miner-dispatcher/healthz",
  "https://api.telegraphprotocol.com/miner-dispatcher/healthz",
  "https://node.telegraphprotocol.com/miner-dispatcher/healthz",
];

const results = [];

async function probe(url, method = "GET", body = null) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 12000);
  try {
    const opts = {
      method,
      signal: ctrl.signal,
      headers: { accept: "application/json", "content-type": "application/json" },
    };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(url, opts);
    const text = await res.text();
    const headers = {};
    for (const [k, v] of res.headers.entries()) {
      if (/payment|www-authenticate|x402|content-type/i.test(k)) headers[k] = v;
    }
    const entry = {
      url,
      method,
      status: res.status,
      headers,
      bodyPreview: text.slice(0, 2000),
    };
    results.push(entry);
    console.log(JSON.stringify({ url, method, status: res.status, hdrKeys: Object.keys(headers) }));
    if (res.status === 402) {
      fs.writeFileSync(
        path.join(outDir, "402-response.json"),
        JSON.stringify(
          {
            url,
            method,
            status: res.status,
            headers,
            body: (() => {
              try {
                return JSON.parse(text);
              } catch {
                return text;
              }
            })(),
            fetchedAt: new Date().toISOString(),
          },
          null,
          2,
        ),
      );
      console.log("SAVED 402 to 402-response.json");
    }
    return entry;
  } catch (e) {
    const entry = { url, method, error: String(e.message || e) };
    results.push(entry);
    console.log(JSON.stringify(entry));
    return entry;
  } finally {
    clearTimeout(t);
  }
}

for (const u of candidates) {
  await probe(u, "GET");
}

// paid-path candidates as POST detect
const postBody = { text: "Hello, this is a short sample for x402 probe." };
for (const u of [
  `${BASE}/v1/x402-test`,
  `${BASE}/v1/91001/detect`,
  `${BASE}/v1/caliber-truthport-text-auth/detect`,
  `${BASE}/v1/44/detect`,
]) {
  await probe(u, "POST", postBody);
}

fs.writeFileSync(path.join(outDir, "dispatcher-probe.json"), JSON.stringify(results, null, 2));
console.log("Wrote dispatcher-probe.json entries=", results.length);
