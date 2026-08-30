import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const outDir = path.dirname(fileURLToPath(import.meta.url));
const BASE = "http://13.237.89.59:7044/miner-dispatcher";

async function probe(url, method = "GET", body = null, timeoutMs = 45000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
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
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text.slice(0, 4000);
    }
    const entry = {
      url,
      method,
      status: res.status,
      headers,
      body: parsed,
      fetchedAt: new Date().toISOString(),
    };
    console.log(JSON.stringify({ url, method, status: res.status, hdrKeys: Object.keys(headers), bodyLen: text.length }));
    if (res.status === 402) {
      fs.writeFileSync(path.join(outDir, "402-response.json"), JSON.stringify(entry, null, 2));
      console.log("SAVED 402");
    }
    return entry;
  } catch (e) {
    console.log(JSON.stringify({ url, method, error: String(e.message || e) }));
    return { url, method, error: String(e.message || e) };
  } finally {
    clearTimeout(t);
  }
}

const results = [];
results.push(await probe(`${BASE}/healthz`));
results.push(await probe(`${BASE}/v1/x402-test`, "GET"));
results.push(await probe(`${BASE}/v1/x402-test`, "POST", { ping: true }));
results.push(
  await probe(`${BASE}/v1/91001/detect`, "POST", {
    text: "Hello, this is a short sample for x402 probe.",
  }),
);
results.push(
  await probe(`${BASE}/v1/caliber-truthport-text-auth/detect`, "POST", {
    text: "Hello, this is a short sample for x402 probe.",
  }),
);
results.push(
  await probe(`${BASE}/v1/44/detect`, "POST", {
    text: "Hello, this is a short sample for x402 probe.",
  }),
);
results.push(await probe(`${BASE}/integrations`));

fs.writeFileSync(path.join(outDir, "dispatcher-probe-2.json"), JSON.stringify(results, null, 2));
console.log("done");
