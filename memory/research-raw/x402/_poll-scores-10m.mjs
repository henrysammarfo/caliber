import fs from "node:fs";
import path from "node:path";

const SLUG = "caliber-truthport-text-auth";
const ID = "20260830";
const URL = "http://13.237.89.59:7044/miner-dispatcher/integrations";
const outDir = "C:/Users/jessi/Desktop/caliber/memory/research-raw/x402";
fs.mkdirSync(outDir, { recursive: true });
const polls = [];
const maxMs = 10 * 60 * 1000;
const interval = 2 * 60 * 1000;
const start = Date.now();

function findOurs(list) {
  return list.find((x) => x && (x.slug === SLUG || String(x.id) === ID)) || null;
}

async function once(i) {
  const at = new Date().toISOString();
  console.log("POLL", i, at);
  const res = await fetch(URL, { headers: { accept: "application/json" } });
  const data = await res.json();
  const arr = Array.isArray(data) ? data : data.integrations || data.items || data.data || [];
  const ours = findOurs(arr);
  const entry = {
    at,
    status: res.status,
    count: arr.length,
    ours: ours
      ? {
          id: ours.id,
          slug: ours.slug,
          activation_status: ours.activation_status,
          scored: ours.scored,
          scores: ours.scores ?? null,
          registered_at: ours.registered_at,
        }
      : null,
    scoredFlag: ours?.scored === true,
  };
  polls.push(entry);
  fs.writeFileSync(
    path.join(outDir, "integrations-poll-scored-" + String(i).padStart(2, "0") + ".json"),
    JSON.stringify(entry, null, 2),
  );
  console.log("count", arr.length, "scored", entry.scoredFlag, "scores", JSON.stringify(entry.ours?.scores ?? null));
  if (ours?.scored === true) {
    const scoredPath = "C:/Users/jessi/Desktop/caliber/memory/artifacts/integrations-caliber-scored.json";
    fs.mkdirSync(path.dirname(scoredPath), { recursive: true });
    fs.writeFileSync(scoredPath, JSON.stringify({ at, ours, polls }, null, 2));
    console.log("SCORED_TRUE", scoredPath);
    return true;
  }
  return false;
}

const i0 = await once(0);
if (!i0) {
  for (let i = 1; i <= 5; i++) {
    if (Date.now() - start >= maxMs) break;
    console.log("sleep 120s");
    await new Promise((r) => setTimeout(r, interval));
    if (await once(i)) break;
    if (Date.now() - start >= maxMs) break;
  }
}
const summary = {
  finishedAt: new Date().toISOString(),
  polls,
  scoredYet: polls.some((p) => p.scoredFlag),
};
fs.writeFileSync(path.join(outDir, "integrations-score-poll-summary.json"), JSON.stringify(summary, null, 2));
console.log("DONE scoredYet", summary.scoredYet, "polls", polls.length);
