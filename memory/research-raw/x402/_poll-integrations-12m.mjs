import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DISPATCHER = "http://13.237.89.59:7044/miner-dispatcher";
const INTERVAL_MS = 60_000;
const ROUNDS = 12;

function hits(int) {
  return int.filter((e) => {
    const s = JSON.stringify(e).toLowerCase();
    return (
      s.includes("caliber") ||
      s.includes("truthport") ||
      s.includes("20260830") ||
      String(e.id) === "20260830" ||
      String(e.id) === "92001" ||
      String(e.id) === "92002" ||
      (e.slug && String(e.slug).includes("caliber-truthport"))
    );
  });
}

const polls = [];
let listed = false;
for (let i = 0; i < ROUNDS; i++) {
  const t0 = Date.now();
  try {
    const res = await fetch(DISPATCHER + "/integrations", {
      headers: { "User-Agent": "caliber-poll-12m-reg52" },
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
      has20260830: int.some((e) => String(e.id) === "20260830"),
      hasSlug: int.some((e) =>
        String(e.slug || "").includes("caliber-truthport"),
      ),
      sample: h.slice(0, 3).map((e) => ({
        id: e.id,
        slug: e.slug,
        activation_status: e.activation_status,
        yaml_url: e.yaml_url || e.yamlUrl,
      })),
      ms: Date.now() - t0,
    };
    polls.push(row);
    console.log(JSON.stringify(row));
    fs.writeFileSync(
      path.join(__dirname, "integrations-poll-reg52.json"),
      JSON.stringify(
        {
          polls,
          lastCount: int.length,
          listed: row.has20260830 || row.hasSlug || h.length > 0,
        },
        null,
        2,
      ),
    );
    if (row.has20260830 || row.hasSlug || h.length > 0) {
      listed = true;
      console.log("LISTED early exit");
      break;
    }
  } catch (e) {
    polls.push({
      round: i + 1,
      error: String(e.message || e),
      at: new Date().toISOString(),
    });
    console.log("ERR", e.message);
  }
  if (i < ROUNDS - 1 && !listed)
    await new Promise((r) => setTimeout(r, INTERVAL_MS));
}

const final = polls[polls.length - 1];
console.log(
  "DONE listed=",
  listed ||
    final?.has20260830 ||
    final?.hasSlug ||
    final?.caliberHits > 0,
  "count=",
  final?.count,
  "rounds=",
  polls.length,
);
