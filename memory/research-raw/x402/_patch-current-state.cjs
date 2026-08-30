const fs = require("fs");
const p = "C:/Users/jessi/Desktop/caliber/memory/CURRENT_STATE.md";
let s = fs.readFileSync(p, "utf8");
s = s.replace(
  /\| x402 rail \| .* \|/,
  "| x402 rail | **Miner-specific paid /detect verified** — receipt `memory/artifacts/x402-receipt-truthport.json`; tx 0x6d7db1bd…; free path none (402) |"
);
s = s.replace(
  /## Blocker\r?\n\r?\n.*/,
  "## Blocker\n\nListed + paid detect green. Still **scored:false** on AI_TEXT_DETECTION — wait for Stage scoring epochs / Discord if stuck after 10m poll.\n"
);
if (!s.includes("Still **scored:false**")) {
  // fallback append blocker note
  s = s.replace(/Still unscored on AI_TEXT[^\n]*/, "Still scored:false on AI_TEXT — Stage scoring pending after paid path proven.");
}
fs.writeFileSync(p, s);
console.log("CURRENT_STATE patched");
