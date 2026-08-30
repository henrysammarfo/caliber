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
    sha256: "982dffe99f1cc53817bb5e646ac30ee6e919dee8f405f0535ec0efa63490bfac",
    baseUrl: "https://caliber-teamtitanlink.vercel.app",
    baseUrlLive: true,
    shaNote: "sha256 of LF miner.yaml + protocol/caliber-truthport.yaml (byte-identical). Hosted at /miner.yaml and /protocol/caliber-truthport.yaml. Template-aligned to veritarach AI_TEXT_DETECTION peer (minimal + docs).",
    schemaValidDraft: true,
  },
  productionUrls: {
    primary: "https://caliber-teamtitanlink.vercel.app",
    alias: "https://caliber-smoky.vercel.app",
    yaml: "https://caliber-teamtitanlink.vercel.app/protocol/caliber-truthport.yaml",
    yamlMiner: "https://caliber-teamtitanlink.vercel.app/miner.yaml",
    detect: "https://caliber-teamtitanlink.vercel.app/detect",
    vercelProjectId: "prj_PmiIcdoclM1fipuWCNjWIIjaYzT5",
    vercelDeploymentId: "dpl_2TcqFrr4dYoqZwZ7EMErg6qrwJGY",
  },
  registry: {
    registered: true,
    network: "Base Sepolia",
    chainId: 84532,
    diamondDocs: "0x122396E8602BEed349434AA6E83123E7dD97F5A0",
    txHash: "0xd28d7a8d24d43d1b5815f53a7be4b2eb3e2f0982c3f760ad78cea24f8b330efa",
    registrationId: 51,
    feeAddress: "0x9ADd0ac311e9E528800afc3F4A04e9cDe52C9cE0",
    explorerUrl: "https://sepolia.basescan.org/tx/0xd28d7a8d24d43d1b5815f53a7be4b2eb3e2f0982c3f760ad78cea24f8b330efa",
    minPriceUsdc: 10000,
    yamlUrl: "https://raw.githubusercontent.com/henrysammarfo/caliber/25f16bbb8d710d6309b33ae6dbfcc3807735ee6f/public/protocol/caliber-truthport.yaml",
    yamlHash: "0xc9f96c3b395ac0637229a557d52d3ea929f3381ba311ba43bc4b3559680bd2a7",
    yamlSubnetId: 20260830,
    yamlKind: "miner",
    deregisterTxHash: "0x19f9c361cf9b2eda29bec0973d749c867f20472d9ba9fee41115b0af0891cbf8",
    priorRegistrationIds: [44, 45, 46, 47, 48, 49, 50],
    priorTxHashes: [
      "0xb45f13bf81e4b779fc8667389283768faade0bbd46601fd2197b769e24351f2b",
      "0xa3870195ef1d5578e40f204ad8ab74b82e73c033474617e1cd89e81463f60a5d",
    ],
    note: "YAML rewritten 2026-08-30 to veritarach-style (id 20260830, AI_TEXT_DETECTION only). Awaiting deregister 51 + re-register with new hash. Do not claim activated until /integrations lists caliber-truthport-text-auth.",
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
    abi: "partial-community" as const,
    abiNote: "Targets telegraph-wasm-check community ABI; official GitBook ABI UNVERIFIED.",
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