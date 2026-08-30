const fs = require("fs");
let cs = fs.readFileSync("memory/CURRENT_STATE.md", "utf8");
const onchain =
  "| On-chain register | **Console reg 387** (docs Diamond still has reg 55) — console Diamond `0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8`; fee `0x9ADd0ac311e9E528800afc3F4A04e9cDe52C9cE0`; minPrice 10000; intents `AI_TEXT_DETECTION` |";
cs = cs.replace(/\| On-chain register \|[^\n]*/, onchain);
const blocker =
  "## Blocker\n\nOff-chain activation unblocked via console Diamond registerMiner (387). Still unscored on AI_TEXT — wait for Stage scoring / Discord if stuck.\n";
cs = cs.replace(/## Blocker[\s\S]*$/, blocker);
fs.writeFileSync("memory/CURRENT_STATE.md", cs);
console.log("done");
console.log(cs.split("\n").slice(28, 45).join("\n"));
