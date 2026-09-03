import fs from "node:fs";
const raw = fs.readFileSync("memory/research-raw/track3-integrations-2026-09-03.json", "utf8").replace(/^\uFEFF/, "");
const d = JSON.parse(raw);
const intents = ["AI_TEXT_DETECTION", "WEATHER_FORECAST", "CRYPTO_PRICE", "FRAUD_DETECTION", "NEWS_SEARCH"];
for (const intent of intents) {
  const miners = d.filter((m) => (m.supported_intents || []).includes(intent));
  console.log(`\n=== ${intent} (${miners.length})`);
  for (const m of miners.slice(0, 6)) {
    const eps = (m.endpoints || [])
      .filter((e) => (e.intents || []).includes(intent) || (e.description || "").includes(intent) || true)
      .slice(0, 3)
      .map((e) => `${e.method} ${e.path}`)
      .join(" | ");
    const rank = (m.scores || []).find((s) => s.intent_id === intent);
    console.log(
      `${m.id} ${m.slug} rank=${rank?.rank ?? "-"} score=${rank?.score ?? "-"} eps=${eps}`,
    );
  }
}
