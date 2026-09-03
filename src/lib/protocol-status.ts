/**
 * Honest build status for marketing + console.
 * Numbers come from `protocol` smoke (synthetic-ci holdout) â€” not live mainnet.
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
    note: "CI fixture only. RAID (MIT) is the primary real holdout â€” not claimed as imported yet.",
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
    vercelDeploymentId: "dpl_4wsUAy6bW5YSFgzfGcyLZHzeNBaM",
    gradelockWasm: "https://caliber-teamtitanlink.vercel.app/gradelock.wasm",
  },
  registry: {
    registered: true,
    listed: true,
    network: "Base Sepolia",
    chainId: 84532,
    diamond: "0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8",
    diamondNote: "Console integrate Diamond a0 — registerMiner that dispatcher indexes. Docs miner Diamond 0x122396 still has reg 55 (same YAML) but did not activate listing.",
    diamondDocs: "0x122396E8602BEed349434AA6E83123E7dD97F5A0",
    txHash: "0x93b2bb04abc052f2e1d2f3f9ed2042dc52484792099dd4c1a926206b34d88b63",
    registrationId: 387,
    docsRegistrationId: 55,
    docsTxHash: "0xda07a1289a54d075e4051686aa2180d6530b4b2c1ad56547bc7667ee7d07af29",
    feeAddress: "0x9ADd0ac311e9E528800afc3F4A04e9cDe52C9cE0",
    explorerUrl: "https://sepolia.basescan.org/tx/0x93b2bb04abc052f2e1d2f3f9ed2042dc52484792099dd4c1a926206b34d88b63",
    minPriceUsdc: 10000,
    yamlUrl: "https://gateway.pinata.cloud/ipfs/QmVTkdLFe6sxJpXqBkPeHzBGwy392q9ezDRP7WgEobxYS6",
    yamlIpfs: "ipfs://QmVTkdLFe6sxJpXqBkPeHzBGwy392q9ezDRP7WgEobxYS6",
    pinataCid: "QmVTkdLFe6sxJpXqBkPeHzBGwy392q9ezDRP7WgEobxYS6",
    yamlHash: "0x5d9c3d2d95589a699b84a50f3e46ed42facb3c479f159bd2c8cbb1eeca03fe3c",
    yamlSubnetId: 20260830,
    yamlKind: "miner",
    slug: "caliber-truthport-text-auth",
    activationStatus: "active",
    scored: true,
    integrationsCountAsOf: 126,
    listedAsOf: "2026-08-30T21:56:22Z",
    deregisterTxHash: "0xf561ebff84883e827f8b7c79bd4abd44c48a77ca7d388c91fd8e82d6263bf165",
    priorRegistrationIds: [44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 55],
    priorTxHashes: [
      "0xb45f13bf81e4b779fc8667389283768faade0bbd46601fd2197b769e24351f2b",
      "0xa3870195ef1d5578e40f204ad8ab74b82e73c033474617e1cd89e81463f60a5d",
      "0x5f332267ccecf9f3476d77779c305dcd6b415c30b89feb3d11e41035b9019e08",
      "0xda07a1289a54d075e4051686aa2180d6530b4b2c1ad56547bc7667ee7d07af29",
    ],
    note: "LISTED+SCORED: console Diamond registerMiner 387; slug caliber-truthport-text-auth id 20260830. AI_TEXT rank #1 as of 2026-09-03 catalog poll (epoch 305). Rank moves.",
  },
  x402: {
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
  wasm: {
    built: true,
    path: "protocol/gradelock/build/gradelock.wasm",
    hostedUrl: "https://caliber-teamtitanlink.vercel.app/gradelock.wasm",
    sha256: "1038058b1689645b2e605ffa22c53b81f5c7b8970d40178c98a78ab05601da2c",
    keccak256: "0x3a03494271e366684382ecdea0b037c1f02eb7463ffa639e368565a2fbb1dfdb",
    hashRemote: "0x3a03494271e366684382ecdea0b037c1f02eb7463ffa639e368565a2fbb1dfdb",
    pinataCid: "QmWxjGDseqgfmMwCX1x6REANA6f1vvFpo6uJe6vsQsBDff",
    pinataUrl: "ipfs://QmWxjGDseqgfmMwCX1x6REANA6f1vvFpo6uJe6vsQsBDff",
    pinataGateway: "https://gateway.pinata.cloud/ipfs/QmWxjGDseqgfmMwCX1x6REANA6f1vvFpo6uJe6vsQsBDff",
    abi: "partial-community" as const,
    abiNote: "Import-free AS module (custom abort; zero env imports). Console ABI registerWasm(bytes32,string,string). Keccak256 of wasm bytes. Reg 2126 rejected structurally (env.abort); replaced by 2256.",
    registered: true,
    network: "Base Sepolia",
    chainId: 84532,
    diamond: "0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8",
    diamondNote: "integrate console a0; NOT docs miner Diamond 0x122396 (Function does not exist for registerWasm)",
    registrationId: 2256,
    intent: "AI_TEXT_DETECTION",
    intentId: "0xaeee3c31e4d6c6dad8f7c261f862f42117f17633f8984fbad74a7bc7b833abf8",
    txHash: "0xc33226e6243daa5aa6aa38141765796320fa4f4196383c1a29dac2a89accc44d",
    explorerUrl: "https://sepolia.basescan.org/tx/0xc33226e6243daa5aa6aa38141765796320fa4f4196383c1a29dac2a89accc44d",
    blockNumber: 46183998,
    wasmUrl: "https://gateway.pinata.cloud/ipfs/QmWxjGDseqgfmMwCX1x6REANA6f1vvFpo6uJe6vsQsBDff",
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
    { id: "wasmReg", label: "registerWasm on Base Sepolia", done: true },
    { id: "x", label: "Public build posts on X", done: true },
    { id: "track3", label: "Track 3 demand app consuming real miners", done: true },
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