import fs from "node:fs";
const p = "memory/research-raw/x402/_reregister-miner.mjs";
let s = fs.readFileSync(p, "utf8");
s = s.replace(/const OLD_REG_ID = \d+n;/, "const OLD_REG_ID = 48n;");
s = s.replace(
  /const INTENTS = \[[\s\S]*?\];/,
  `const INTENTS = [
  "AI_TEXT_DETECTION",
  "CONTENT_VERIFICATION",
];`,
);
fs.writeFileSync(p, s);
console.log("OLD_REG_ID", s.match(/OLD_REG_ID = (\d+)n/)[1]);
console.log("INTENTS ok", s.includes("TEXT_AUTHENTICITY_CHECK") ? "STILL HAS BAD INTENT" : "clean");
