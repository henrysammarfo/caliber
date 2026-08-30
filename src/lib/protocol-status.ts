/**
 * Honest build status for marketing + console.
 * Numbers come from `protocol` smoke (synthetic-ci holdout) — not live mainnet.
 * Update when `cd protocol && npm run smoke` changes materially.
 */
export const PROTOCOL_STATUS = {
  vertical: {
    locked: true,
    signalType: "text_authenticity",
    intents: ["ai_text_detection", "text_authenticity_check", "content_verification"] as const,
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
    id: 92001,
    slug: "caliber-truthport-text-auth",
    sha256: "c9f96c3b395ac0637229a557d52d3ea929f3381ba311ba43bc4b3559680bd2a7",
    baseUrl: "https://caliber-teamtitanlink.vercel.app",
    baseUrlLive: true,
    shaNote: "sha256 of LF miner.yaml + protocol/caliber-truthport.yaml (byte-identical). Hosted at /miner.yaml and /protocol/caliber-truthport.yaml",
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
    txHash: "0x8f6fa5b6a00efffe9af3b9adad7340f218ab03fd688a3fbd33d481ce4f09e22c",
    registrationId: 50,
    feeAddress: "0x9ADd0ac311e9E528800afc3F4A04e9cDe52C9cE0",
    explorerUrl: "https://sepolia.basescan.org/tx/0x8f6fa5b6a00efffe9af3b9adad7340f218ab03fd688a3fbd33d481ce4f09e22c",
    minPriceUsdc: 10000,
    yamlUrl: "https://caliber-teamtitanlink.vercel.app/miner.yaml",
    yamlHash: "0xc9f96c3b395ac0637229a557d52d3ea929f3381ba311ba43bc4b3559680bd2a7",
    yamlSubnetId: 92001,
    yamlKind: "miner",
    deregisterTxHash: "0xfc2411a7a3b9d8eff316c7d3ab5a0cb63fda23d2393cdb6614ca62bb7584d8af",
    priorRegistrationIds: [44, 45, 46, 47, 48, 49],
    priorTxHashes: [
      "0xb45f13bf81e4b779fc8667389283768faade0bbd46601fd2197b769e24351f2b",
      "0xa3870195ef1d5578e40f204ad8ab74b82e73c033474617e1cd89e81463f60a5d",
    ],
    note: "Re-registered 2026-08-30: yamlUrl=/miner.yaml. registrationId 50. Still NOT in dispatcher /integrations after 8m poll (125). Do not claim activated.",
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
    note: "Rail verified on /v1/x402-test. Miner-specific /v1/92001/detect NOT run as paid receipt this turn — CALIBER still absent from /integrations after reg 50 + 8m poll.",
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
id: 92001
slug: caliber-truthport-text-auth
protocol: generic
name: CALIBER TRUTHPORT Text Authenticity
base_url: https://caliber-teamtitanlink.vercel.app
auth:
  type: none
endpoints:
  - path: /detect
    external_path: /detect
    method: POST
semantics:
  signal_mapping:
    type: text_authenticity
    confidence_field: confidence
    label_field: isAI
  supported_intents:
    - ai_text_detection
    - text_authenticity_check
    - content_verification
on_chain:
  transform: direct
  min_price_usdc: 0.01
# sha256 (live bytes id 92001 kind miner): ${PROTOCOL_STATUS.yaml.sha256}
`;