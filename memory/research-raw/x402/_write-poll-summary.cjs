const fs = require("fs");
const path = require("path");
const dir = "C:/Users/jessi/Desktop/caliber/memory/research-raw/x402";
const polls = [];
for (let i = 0; i <= 5; i++) {
  const f = path.join(dir, "integrations-poll-scored-" + String(i).padStart(2, "0") + ".json");
  if (fs.existsSync(f)) polls.push(JSON.parse(fs.readFileSync(f, "utf8")));
}
const summary = {
  finishedAt: new Date().toISOString(),
  source: "79044 _poll-scores-10m.mjs",
  polls,
  scoredYet: polls.some((p) => p.scoredFlag === true),
  note: "Polls 0-4: listed active scored:false scores:null. Poll 5: EHOSTUNREACH mid-request. No scores[] on AI_TEXT_DETECTION within ~10m window.",
};
fs.writeFileSync(path.join(dir, "integrations-score-poll-summary.json"), JSON.stringify(summary, null, 2));
console.log(JSON.stringify({ scoredYet: summary.scoredYet, pollCount: polls.length, last: polls[polls.length - 1] }, null, 2));
