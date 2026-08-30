/**
 * Poll GET /integrations for CALIBER for ~2.5 minutes.
 */
import fs from "node:fs";
import path from "path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DISPATCHER = "http://13.237.89.59:7044/miner-dispatcher";
const INTERVAL_MS = 30_000;
const ROUNDS = 6; // ~3 min

function hits(int) {
  return int.filter((e) => {
    const s = JSON.stringify(e).toLowerCase();
    return (
      s.includes("caliber") ||
      s.includes("92001") ||
      s.includes("truthport") ||
      String(e.id) === "92001"
    );
  });
}

const polls = [];
for (let i = 0; i < ROUNDS; i++) {
  const t0 = Date.now();
  try {
    const res = await fetch(DISPATCHER + "/integrations", {
      headers: { "User-Agent": "caliber-poll" },
    });
    const text = await res.text();
    const int = JSON.parse(text);
    const h = hits(int);
    const row = {
      round: i + 1,
      at: new Date().toISOString(),
      status: res.status,
      count: int.length,
      caliberHits: h.length,
      has92001: int.some((e) => String(e.id) === "92001"),
      sample: h.slice(0, 2).map((e) => ({
        id: e.id,
        slug: e.slug,
        activation_status: e.activation_status,
      })),
      ms: Date.now() - t0,
    };
    polls.push(row);
    console.log(JSON.stringify(row));
    fs.writeFileSync(
      path.join(__dirname, "integrations-poll-caliber.json"),
      JSON.stringify({ polls, lastCount: int.length }, null, 2),
    );
  } catch (e) {
    polls.push({ round: i + 1, error: String(e.message || e) });
    console.log("ERR", e.message);
  }
  if (i < ROUNDS - 1) await new Promise((r) => setTimeout(r, INTERVAL_MS));
}

const final = polls[polls.length - 1];
console.log(
  "DONE listed=",
  final?.has92001 || final?.caliberHits > 0,
  "count=",
  final?.count,
);
