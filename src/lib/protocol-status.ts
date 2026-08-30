/**
 * Honest build status for marketing + console.
 * Numbers come from `protocol` smoke (synthetic-ci holdout) — not live mainnet.
 * Update when `cd protocol && npm run smoke` changes materially.
 */
export const PROTOCOL_STATUS = {
  vertical: {
    locked: true,
    signalType: "text_authenticity",
    intents: ["AI_TEXT_DETECTION"] as const,
    name: "AI text authenticity",
  },
  holdout: {
    kind: "synthetic-ci" as const,
    rows: 80,
    holdoutPartitionRows: 64,
    raidPrimary: true,
    raidImported: false,
    note: "CI fixture only. RAID (MIT) is the primary real holdout — not claimed as imported yet.",
  },
  smoke: {
    asOf: "2026-08-29",
    honestMeanBrier: 0.05493,
    adversarial: [
      { name: "Confidence inflation", rankDrop: 3, passed: true },
      { name: "Hedge spam", rankDrop: 1, passed: true },
      { name: "Label echo", rankDrop: 4, passed: true },
      { name: "Volume flood", rankDrop: 2, passed: true },
    ] as const,
  },
  yaml: {
    path: "protocol/yaml/caliber-truthport.yaml",
    version: "1",
    id: 20260830,
    slug: "caliber-truthport-text-auth",
    sha256: "5d9c3d2d95589a699b84a50f3e46ed42facb3c479f159bd2c8cbb1eeca03fe3c",
    baseUrl: "https://caliber-teamtitanlink.vercel.app",
    baseUrlLive: true,
    shaNote: "sha256 of LF miner.yaml + protocol/yaml/caliber-truthport.yaml (byte-identical). Hosted at /miner.yaml and /protocol/caliber-truthport.yaml. Multi-endpoint v2 scoring contract (/predict,/detect,/ai-detect).",
    schemaValidDraft: true,
  },
  productionUrls: {
    primary: "https://caliber-teamtitanlink.vercel.app",
    alias: "https://caliber-smoky.vercel.app",
    yaml: "https://caliber-teamtitanlink.vercel.app/protocol/caliber-truthport.yaml",
    yamlMiner: "https://caliber-teamtitanlink.vercel.app/miner.yaml",
    detect: "https://caliber-teamtitanlink.vercel.app/detect",
    vercelProjectId: "prj_PmiIcdoclM1fipuWCNjWIIjaYzT5",
    vercelDeploymentId: "dpl_ETuGisRLzQXQbzTKrnY3Y7zxFisf",
    gradelockWasm: "https://caliber-teamtitanlink.vercel.app/gradelock.wasm",
  },
  registry: {
    registered: true,
    network: "Base Sepolia",
    chainId: 84532,
    diamondDocs: "0x122396E8602BEed349434AA6E83123E7dD97F5A0",
    txHash: "0xda07a1289a54d075e4051686aa2180d6530b4b2c1ad56547bc7667ee7d07af29",
    registrationId: 55,
    feeAddress: "0x9ADd0ac311e9E528800afc3F4A04e9cDe52C9cE0",
    explorerUrl: "https://sepolia.basescan.org/tx/0xda07a1289a54d075e4051686aa2180d6530b4b2c1ad56547bc7667ee7d07af29",
    minPriceUsdc: 10000,
    yamlUrl: "https://gateway.pinata.cloud/ipfs/QmVTkdLFe6sxJpXqBkPeHzBGwy392q9ezDRP7WgEobxYS6",
    yamlIpfs: "ipfs://QmVTkdLFe6sxJpXqBkPeHzBGwy392q9ezDRP7WgEobxYS6",
    pinataCid: "QmVTkdLFe6sxJpXqBkPeHzBGwy392q9ezDRP7WgEobxYS6",
    yamlHash: "0x5d9c3d2d95589a699b84a50f3e46ed42facb3c479f159bd2c8cbb1eeca03fe3c",
    yamlSubnetId: 20260830,
    yamlKind: "miner",
    deregisterTxHash: "0xf561ebff84883e827f8b7c79bd4abd44c48a77ca7d388c91fd8e82d6263bf165",
    priorRegistrationIds: [44, 45, 46, 47, 48, 49, 50, 51, 52, 53],
    priorTxHashes: [
      "0xb45f13bf81e4b779fc8667389283768faade0bbd46601fd2197b769e24351f2b",
      "0xa3870195ef1d5578e40f204ad8ab74b82e73c033474617e1cd89e81463f60a5d",
      "0x5f332267ccecf9f3476d77779c305dcd6b415c30b89feb3d11e41035b9019e08",
    ],
    note: "LOCK-IN: Truthport v2 multi-endpoint YAML on Pinata (CID QmVTkd…). Reg 55 after dereg 53. Still NOT claimed in /integrations until poll confirms.",
  },
  x402: {
    exercised: true,
    floorUsdc: 0.01,
    pathUsed: "http://13.237.89.59:7044/miner-dispatcher/v1/x402-test",
    receiptPath: "memory/artifacts/x402-receipt.json",
    minerSpecificReceiptPath: "memory/artifacts/x402-receipt-truthport.json",
    txHash: "0xde146c9da2983692932fd7f787035e1063f6b3506a7badb9313a8286190493cf",
    explorerUrl:
      "https://sepolia.basescan.org/tx/0xde146c9da2983692932fd7f787035e1063f6b3506a7badb9313a8286190493cf",
    asOf: "2026-08-30",
    note: "Rail verified on /v1/x402-test. Miner-specific paid /detect receipt blocked until CALIBER appears in /integrations (yaml id now 20260830).",
  },
  wasm: {
    built: true,
    path: "protocol/gradelock/build/gradelock.wasm",
    hostedUrl: "https://caliber-teamtitanlink.vercel.app/gradelock.wasm",
    sha256: "266be7d6c07641439b0c7610e44f495f11b841a22687cb45645317a256d4d4a3",
    hashRemote: "0x8d295d467f4002271feb29bc089471453972419b0d02b15da3c3c737b36bb416",
    pinataCid: "QmWVPgXS5FNWUP48JBb2P6prGn8w4qe5zvF9GcNHiWBsWX",
    pinataUrl: "ipfs://QmWVPgXS5FNWUP48JBb2P6prGn8w4qe5zvF9GcNHiWBsWX",
    pinataGateway: "https://gateway.pinata.cloud/ipfs/QmWVPgXS5FNWUP48JBb2P6prGn8w4qe5zvF9GcNHiWBsWX",
    abi: "partial-community" as const,
    abiNote: "Targets telegraph-wasm-check community ABI; official GitBook ABI UNVERIFIED. Uploaded via POST /api/upload-wasm FormData field=file. hash-remote differs from local sha256 (console hash algo). registerWasm still needs wallet console tx.",
  },
  checklist: [
    { id: "vertical", label: "Lock vertical + labeled eval path", done: true },
    { id: "yaml", label: "YAML Standard draft (v1 schema)", done: true },
    { id: "miner", label: "TRUTHPORT detector + local miner server", done: true },
    { id: "grader", label: "GRADELOCK Brier + adversarial + WASM build", done: true },
    { id: "registry", label: "MinerRegistry on Base", done: true },
    { id: "x402", label: "x402 payment path exercised", done: true },
    { id: "raid", label: "Import RAID holdout sample", done: false },
    { id: "host", label: "Public HTTPS base_url for YAML", done: true },
    { id: "x", label: "Public build posts on X", done: false },
  ] as const,
} as const;

export const YAML_PREVIEW = `version: "1"
kind: miner
id: 20260830
slug: caliber-truthport-text-auth
protocol: generic
name: CALIBER TRUTHPORT Text Authenticity
base_url: https://caliber-teamtitanlink.vercel.app
docs:
  repository: https://github.com/henrysammarfo/caliber
auth:
  type: none
endpoints:
  - path: /detect
    external_path: /detect
    method: POST
semantics:
  signal_mapping:
    confidence_field: confidence
    label_field: isAI
  supported_intents:
    - AI_TEXT_DETECTION
# sha256 (live bytes id 20260830 kind miner): ${PROTOCOL_STATUS.yaml.sha256}
`;