const fs = require("fs");
const p = "C:/Users/jessi/Desktop/caliber/protocol/scripts/x402-paid-detect.mjs";
let s = fs.readFileSync(p, "utf8");
const re = /const DEFAULT_URLS = \[[\s\S]*?\];/;
const neu = `const DEFAULT_URLS = [
  \`\${DISPATCHER}/v1/20260830/detect\`,
  \`\${DISPATCHER}/v1/20260830/predict\`,
  \`\${DISPATCHER}/v1/caliber-truthport-text-auth/detect\`,
  \`\${DISPATCHER}/v1/caliber-truthport-text-auth/predict\`,
  \`\${DISPATCHER}/v1/x402-test\`,
];`;
if (!re.test(s)) throw new Error("no match");
s = s.replace(re, neu);
fs.writeFileSync(p, s);
console.log("defaults updated");
console.log(s.match(re)[0]);
