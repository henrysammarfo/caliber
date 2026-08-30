import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const outDir = path.dirname(fileURLToPath(import.meta.url));
const BASE = "http://13.237.89.59:7044/miner-dispatcher";
const ctrl = AbortSignal.timeout(60000);
try {
  const res = await fetch(`${BASE}/integrations`, { signal: ctrl, headers: { accept: "application/json" } });
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch { body = text.slice(0, 5000); }
  fs.writeFileSync(path.join(outDir, "integrations.json"), JSON.stringify({ status: res.status, body }, null, 2));
  const list = Array.isArray(body) ? body : body?.integrations || body?.data || [];
  if (Array.isArray(list)) {
    console.log("count", list.length);
    for (const m of list.slice(0, 50)) {
      console.log(JSON.stringify({ id: m.id ?? m.subnet_id, slug: m.slug, name: m.name, base_url: m.base_url }));
    }
  } else {
    console.log("status", res.status, "keys", body && typeof body === "object" ? Object.keys(body) : typeof body);
  }
} catch (e) {
  console.log("error", String(e.message || e));
}
