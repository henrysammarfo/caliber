import fs from "node:fs";
import path from "node:path";

const needles = [
  "caliber",
  "truthport",
  "20260830",
  "QmVTkd",
  "QmWVPg",
  "GRADELOCK",
  "gradelock",
  "teamtitan",
  "9ADd0ac",
  "caliber-truthport",
];

const candidates = [
  "http://13.237.89.59:7044/miner-dispatcher/integrations",
  "http://13.237.89.59:7044/integrations",
  "http://13.237.89.59:7044/miner-dispatcher/healthz",
  "https://integrate.telegraphprotocol.com/api/integrations",
];

async function tryFetch(url, ms = 25000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const r = await fetch(url, { signal: ctrl.signal });
    const text = await r.text();
    return { url, status: r.status, len: text.length, text };
  } catch (e) {
    return { url, error: String(e?.message || e) };
  } finally {
    clearTimeout(t);
  }
}

function findMatches(text) {
  let j;
  try {
    j = JSON.parse(text);
  } catch {
    return { parseErr: "not json", stringHits: Object.fromEntries(needles.map((n) => [n, text.includes(n)])) };
  }
  const arr = Array.isArray(j)
    ? j
    : j.integrations || j.data || j.items || j.miners || [];
  const matched = Array.isArray(arr)
    ? arr.filter((x) => {
        const s = JSON.stringify(x);
        return needles.some((n) => s.includes(n));
      })
    : [];
  return {
    topKeys: j && !Array.isArray(j) ? Object.keys(j).slice(0, 20) : null,
    arrLen: Array.isArray(arr) ? arr.length : null,
    matchedCount: matched.length,
    matched: matched.slice(0, 8),
    stringHits: Object.fromEntries(needles.map((n) => [n, text.includes(n)])),
  };
}

const results = [];
for (const u of candidates) {
  console.log("GET", u);
  const r = await tryFetch(u, 28000);
  const row = { url: r.url, status: r.status, error: r.error, len: r.len };
  if (r.text) Object.assign(row, findMatches(r.text));
  results.push(row);
  console.log(JSON.stringify({ url: row.url, status: row.status, error: row.error, len: row.len, matchedCount: row.matchedCount, stringHits: row.stringHits, topKeys: row.topKeys, arrLen: row.arrLen }));
}

const out = {
  asOf: new Date().toISOString(),
  listed: results.some((r) => (r.matchedCount || 0) > 0),
  results: results.map(({ text, ...rest }) => rest),
};
const outPath = path.join("memory/research-raw/x402/integrations-poll-wasm-reg.json");
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log("listed", out.listed);
console.log("wrote", outPath);
