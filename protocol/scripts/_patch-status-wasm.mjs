import fs from "node:fs";

let p = fs.readFileSync("src/lib/protocol-status.ts", "utf8");

const wasmOld = /wasm: \{[\s\S]*?\n  \},/;
const wasmNew = `wasm: {
    built: true,
    path: "protocol/gradelock/build/gradelock.wasm",
    hostedUrl: "https://caliber-teamtitanlink.vercel.app/gradelock.wasm",
    sha256: "266be7d6c07641439b0c7610e44f495f11b841a22687cb45645317a256d4d4a3",
    keccak256: "0x8d295d467f4002271feb29bc089471453972419b0d02b15da3c3c737b36bb416",
    hashRemote: "0x8d295d467f4002271feb29bc089471453972419b0d02b15da3c3c737b36bb416",
    pinataCid: "QmWVPgXS5FNWUP48JBb2P6prGn8w4qe5zvF9GcNHiWBsWX",
    pinataUrl: "ipfs://QmWVPgXS5FNWUP48JBb2P6prGn8w4qe5zvF9GcNHiWBsWX",
    pinataGateway: "https://gateway.pinata.cloud/ipfs/QmWVPgXS5FNWUP48JBb2P6prGn8w4qe5zvF9GcNHiWBsWX",
    abi: "partial-community" as const,
    abiNote: "Console ABI registerWasm(bytes32 wasmHash, string wasmUrl, string intent). Keccak256 of wasm bytes (not SHA-256). Docs miner Diamond 0x122396 lacks facet; console Diamond 0x5a2324 accepts registerWasm.",
    registered: true,
    network: "Base Sepolia",
    chainId: 84532,
    diamond: "0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8",
    diamondNote: "integrate console a0; NOT docs miner Diamond 0x122396 (Function does not exist for registerWasm)",
    registrationId: 2126,
    intent: "AI_TEXT_DETECTION",
    intentId: "0xaeee3c31e4d6c6dad8f7c261f862f42117f17633f8984fbad74a7bc7b833abf8",
    txHash: "0x43d0c770beab5c453aaac2f86dc426d4d0f90f092ee3315f5778c8cd0bf6a572",
    explorerUrl: "https://sepolia.basescan.org/tx/0x43d0c770beab5c453aaac2f86dc426d4d0f90f092ee3315f5778c8cd0bf6a572",
    blockNumber: 46175866,
    wasmUrl: "https://gateway.pinata.cloud/ipfs/QmWVPgXS5FNWUP48JBb2P6prGn8w4qe5zvF9GcNHiWBsWX",
  },`;

if (!wasmOld.test(p)) throw new Error("wasm block not found");
p = p.replace(wasmOld, wasmNew);

p = p.replace(
  /note: "LOCK-IN: Truthport v2[\s\S]*?until poll confirms\.",/,
  'note: "LOCK-IN: Truthport v2 multi-endpoint YAML on Pinata (CID QmVTkd…). Reg 55 after dereg 53. Poll 2026-08-30T20:06Z: /integrations count 93 — CALIBER NOT listed (no 20260830/QmVTkd/caliber-truthport).",'
);

if (!p.includes('id: "wasmReg"')) {
  p = p.replace(
    '{ id: "x", label: "Public build posts on X", done: false },',
    '{ id: "wasmReg", label: "registerWasm on Base Sepolia", done: true },\n    { id: "x", label: "Public build posts on X", done: false },'
  );
}

fs.writeFileSync("src/lib/protocol-status.ts", p);
console.log("protocol-status ok");
