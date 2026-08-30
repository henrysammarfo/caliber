const fs = require("fs");
const p = "C:/Users/jessi/Desktop/caliber/src/lib/protocol-status.ts";
let s = fs.readFileSync(p, "utf8");
const start = s.indexOf("  x402: {");
const wasm = s.indexOf("  wasm: {");
if (start < 0 || wasm < 0) throw new Error("markers missing " + start + " " + wasm);
const x402 = `  x402: {
    exercised: true,
    minerSpecific: true,
    floorUsdc: 0.01,
    pathUsed: "http://13.237.89.59:7044/miner-dispatcher/v1/20260830/detect",
    receiptPath: "memory/artifacts/x402-receipt.json",
    minerSpecificReceiptPath: "memory/artifacts/x402-receipt-truthport.json",
    txHash: "0x6d7db1bd06299567966c3f64b5a0a04e4e3f68c10aad3d30d34345004385f890",
    explorerUrl:
      "https://sepolia.basescan.org/tx/0x6d7db1bd06299567966c3f64b5a0a04e4e3f68c10aad3d30d34345004385f890",
    genericPathUsed: "http://13.237.89.59:7044/miner-dispatcher/v1/x402-test",
    genericTxHash: "0xde146c9da2983692932fd7f787035e1063f6b3506a7badb9313a8286190493cf",
    asOf: "2026-08-30T22:23:15Z",
    freePath: false,
    freePathNote: "Unauthenticated POST to predict/detect (id and slug) returns HTTP 402 Payment Required (amount 10000 micro-USDC).",
    note: "Miner-specific x402 paid /detect succeeded after listing. Response: confidence 0.37291, isAI false, label human_written, model caliber-truthport-v2.",
  },
`;
s = s.slice(0, start) + x402 + s.slice(wasm);
fs.writeFileSync(p, s);
console.log("fixed x402 block bytes", x402.length);
