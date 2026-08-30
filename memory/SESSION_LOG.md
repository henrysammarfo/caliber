# CALIBER ? SESSION LOG

## 2026-08-29 ? Discovery + live fact-check (no production code ship this turn)

### Inputs read (word-for-word / full pass)

- `scoutbot/docs/CALIBER_BIBLE.md`
- `scoutbot/docs/memory/research-raw/hackathons/telegraph/LOCKED.md`
- `scoutbot/docs/memory/research-raw/hackathons/telegraph/DEEP_PASS.md`
- `scoutbot/docs/memory/research-raw/hackathons/RECHECK_VERDICT.md` (Telegraph sections)
- `scoutbot/docs/WIN_DOCTRINE.md`
- `scoutbot/docs/memory/HACKATHON_IDEATION.md`
- `scoutbot/docs/memory/SESSION_STATE.md` (portfolio context)
- Caliber repo README + marketing/dashboard routes (`src/routes/*`)
- Live: portal HTML, GitBook `llms.txt`, YAML Standard, x402, Miner Registry, integrate console
- Live dumps: Tavily + TinyFish under `memory/research-raw/*-2026-08-29*`

### Tools

- Tavily Search (portal + Brier scoring) ? dumps saved
- TinyFish Search / Fetch / Agent automation ? **X-API-Key** required; `api.tinyfish.ai` DNS fail
- WebFetch portal + GitBook (browser MCP unavailable this session)
- Shell research via subagent (local sandbox broken for parent shell)

### Findings (high signal)

1. **Deadline drift:** Bible/LOCKED/roadmap UI say **12:00 UTC**; live raw HTML says **23:59 UTC**. Prefer HTML. TinyFish Fetch markdown can hallucinate 12:00 ? trust raw HTML / Agent.
2. **Dual submit allowed:** portal ?miner ? or both.?
3. **YAML contract is strict:** `version: "1"`, `kind`, `id`, `slug`, `base_url`, `auth`, `endpoints`, canonical `signal_mapping.type` + `supported_intents`. Site sample YAML is **invalid** vs schema.
4. **UI vs truth gap:** dashboard/miner pages claim labeled set size, agreement scores, registry done ? **cosplay**. Vertical still open in Bible ?3.
5. **Homepage clone traps:** BitMind = media_authenticity; Zeus = weather ? docs examples. Bible forbids deepfake cosplay without unique labels.
6. **x402:** floor via on-chain `min_price_usdc` (min $0.01); YAML field informational; Base Sepolia + Polygon + Solana Devnet in docs.
7. **Diamond:** Base Sepolia `0x122396E8602BEed349434AA6E83123E7dD97F5A0` (GitBook ? re-verify before any tx).
8. **Keys pasted in chat** ? treat as compromised; rotate Tavily + TinyFish; never commit.

### Deliverables this turn

- `memory/CURRENT_STATE.md`
- `memory/SESSION_LOG.md` (this file)
- `memory/FACT_CHECK.md`
- `memory/VERTICAL_CANDIDATES.md`
- `memory/WIN_RECOMMENDATIONS.md`
- `.cursor/rules/caliber-telegraph.mdc`
- `.cursor/rules/caliber-honesty-security.mdc`
- `.cursor/skills/caliber-build/SKILL.md`

### Not done this turn (blocked on vertical decision + build phase)

- Real miner API, YAML, registry tx, x402 receipt, WASM grader, strip fake metrics, smoke/stress tests, compile gate
- Bible file in scoutbot not rewritten (recommend Henry sync 23:59 + schema notes)

### Next chat start

1. Read `CURRENT_STATE.md` + `FACT_CHECK.md`
2. Henry locks vertical from `VERTICAL_CANDIDATES.md`
3. Enter BUILDING phase: schema-valid YAML ? API ? registry ? x402 ? WASM ? demo artifacts

## 2026-08-29 ? Text authenticity dataset + WASM research
- Tavily + TinyFish dumps ? `memory/research-raw/vertical/text-authenticity/` (SUMMARY-2026-08-29.md).
- H1 holdout recommendation: **RAID** (MIT); secondary Ghostbuster essays (CC-BY-3.0); HC3 SA-4.0 weaker for commercial.
- YAML: `text_authenticity` / `ai_text_detection` confirmed.
- Official WASM grader ABI still **missing** from GitBook; community `telegraph-wasm-check` documents `rank_answer` surface (PARTIAL).
- Keys pasted in chat ? rotate Tavily/TinyFish.

## 2026-08-29 ? `protocol/` TRUTHPORT + GRADELOCK packages

### Built
- `protocol/` monorepo slice: shared Brier/calibration, TRUTHPORT detector+`node:http` miner, GRADELOCK score/adversarial, AssemblyScript WASM (community ABI PARTIAL), YAML v1 draft, 80-row synthetic CI holdout, vitest + smoke.

### Verified locally
- `npm test` ? 6/6 pass
- `npm run smoke` ? honest mean Brier ~0.055 on holdout; confidence_inflation worse; exit 0
- `npm run build:wasm` ? `gradelock/build/gradelock.wasm` (~4.4 KB)
- YAML SHA-256: `a615f058662114b8951ffdb8008707fdf39f8ddd4a4ac99ccc58fb2b01a3e730`

### Honesty
- Holdout is `synthetic-ci` only; RAID not imported.
- Subnet id `91001` + `base_url` placeholders; not registered on-chain.
- No API keys required for this slice.

### Next
- Host YAML + miner HTTPS; wallet for registerMiner/x402; import RAID sample with provenance; honest UI strip.


## 2026-08-29 ? BUILDING (protocol green + honesty)

### Done
- **Vertical lock:** AI text authenticity (`text_authenticity` + canonical intents); RAID primary holdout (not fully imported yet).
- **Protocol green:** `cd protocol && npm test` (6/6) and `npm run smoke` exit 0; honest mean Brier **0.05493** on synthetic-ci holdout (n=64); adversarial attacks pass.
- **YAML field fix:** `on_chain.fields` uses **integers/bools** (not strings-only); SHA-256 now `3bee59037c3c9ff2f7018036a112e7872afc47b1192b8a80cfa8e0c3ab30f629`.
- **UI honesty:** status surface + marketing no longer claim fake **4128** rows / **0.912** grader agreement; numbers from smoke only.
- Root scripts: `protocol:test`, `protocol:smoke`, `protocol:miner`, `protocol:hash-yaml`.
- Brief `memory/THREAT_MODEL.md` (assets / threats / residual ? no unhackable claim).

### Next key gates
1. Public HTTPS `base_url` + host YAML
2. Wallet: `registerMiner` on Base (re-verify Diamond) + x402 receipt path
3. Import RAID holdout sample with provenance
4. Confirm official WASM Script Author ABI (still PARTIAL)
5. X build posts

## 2026-08-29 ? payments/registry/docs/settings honesty + KEYS_NEEDED

- Dashboard payments, registry, docs, and settings surfaces scrubbed of fake telemetry; honesty copy only.
- Added `KEYS_NEEDED.md` for remaining env/wallet/API keys to go live (registerMiner / x402 / hosted miner).
- Verified: `protocol:test` + `protocol:smoke` exit 0; frontend `npm run build` exit 0; no leftover fake metrics (4128 / 0.912 / vertical.verify / caliber-gold / 18,402) under `src/`.

## 2026-08-30 ? Gate A public HTTPS DONE

### Deploy
- Primary: https://caliber-teamtitanlink.vercel.app
- Alias: https://caliber-smoky.vercel.app
- YAML: https://caliber-teamtitanlink.vercel.app/protocol/caliber-truthport.yaml
- Detect: https://caliber-teamtitanlink.vercel.app/detect
- Vercel projectId `prj_PmiIcdoclM1fipuWCNjWIIjaYzT5` ? deployment `dpl_2wjBjsULCYaJndJEozzVSZUX5BYL`

### Bookkeeping
- Synced `public/protocol/caliber-truthport.yaml` ? `protocol/yaml/caliber-truthport.yaml` (`base_url` live; `auth.type: none`)
- `npm run hash-yaml` ? sha256 `44117168d49965769e3064919f8d816f2c40d0e965450ad596e4f9fa85756212`
- `src/lib/protocol-status.ts`: `yaml.baseUrlLive=true`, checklist host done, `productionUrls` added; registry still `registered:false`

### Verified
- GET YAML ? HTTP 200; `base_url` + `auth.type: none` match
- POST `/detect` ? `confidence` ~0.397, `isAI` false (sample text)

### Next
- Gate B: Base Sepolia wallet for `registerMiner` + x402

## 2026-08-30 ? Gate B registerMiner DONE (Base Sepolia)

### Tx (VERIFIED)
- feeAddress: `0x9ADd0ac311e9E528800afc3F4A04e9cDe52C9cE0`
- registrationId: **44** (indexed topic1)
- txHash: `0xb45f13bf81e4b779fc8667389283768faade0bbd46601fd2197b769e24351f2b`
- Explorer: https://sepolia.basescan.org/tx/0xb45f13bf81e4b779fc8667389283768faade0bbd46601fd2197b769e24351f2b
- Diamond: `0x122396E8602BEed349434AA6E83123E7dD97F5A0`
- YAML URL + sha256 live match: `4b8499facd04a3cf061825e29885bc2903c6a0b71c61e91ce612e19ef55b1052`
- minPriceUsdc: 10000; intents: ai_text_detection, text_authenticity_check, content_verification
- Balance before ? 0.025 ETH; after ? 0.0249977 ETH (gas)

### Bookkeeping
- `src/lib/protocol-status.ts`: registry.registered=true + tx/id/feeAddress; checklist registry done
- PRIVATE_KEY only in local `.env` (gitignored `.env*`) ? **never** in memory/*.md
- WARN: key was chat-pasted ? rotate after hackathon

### Next
- x402 paid path + test USDC; portal confirm; rotate keys

## 2026-08-30 ? Gate C x402 paid path (dispatcher rail)

### USDC
- feeAddress / payer `0x9ADd0ac311e9E528800afc3F4A04e9cDe52C9cE0` balanceOf ? **20.000000 USDC** before; **19.990000** after (?0.01)

### Research
- GitBook x402 + OpenAPI `Telegraph-api-docs` servers: `http://13.237.89.59:7044/miner-dispatcher`
- Unauth probes ? HTTP **402** + `PAYMENT-REQUIRED` (saved `memory/research-raw/x402/402-response.json` + decoded)
- Candidate URLs: `/v1/x402-test`, `/v1/91001/detect`, `/v1/caliber-truthport-text-auth/detect`, `/v1/44/detect`
- Tavily + TinyFish dumps under `memory/research-raw/x402/`

### Paid success
- `protocol/scripts/x402-paid-detect.mjs` via `@x402/fetch` + `ExactEvmScheme`
- Path: `GET http://13.237.89.59:7044/miner-dispatcher/v1/x402-test` ? 200
- PAYMENT-RESPONSE tx: `0xde146c9da2983692932fd7f787035e1063f6b3506a7badb9313a8286190493cf`
- Receipt: `memory/artifacts/x402-receipt.json`
- `PROTOCOL_STATUS.x402.exercised=true`

### Miner proxy blockers (honest)
- CALIBER slug / registrationId 44 **not** in dispatcher `/integrations` (125 live)
- YAML `id: 91001` **collides** with `sarzops-transaction-risk` ? paid `/v1/91001/detect` ? 502
- slug / 44 ? 404 after gate

### Next
- Free subnet id + YAML reload on node; then miner-specific paid detect

## 2026-08-30 ? YAML id 92001 + re-register (dispatcher still pending)

### Collision fix
- `GET /integrations` ? 125 ids; **91001 taken** by `sarzops-transaction-risk`; free pick **92001**
- Dump: `memory/research-raw/x402/integrations-ids.json` (no secrets)

### YAML + deploy
- Both `protocol/yaml/` + `public/protocol/` ? `id: 92001`, LF-identical
- Live schema: all 125 integrations use `kind: miner` (GitBook still documents `subnet`) ? set `kind: miner`, simplified `input_schema` (required `[text]`)
- Live sha256 `69f4d780f931eb5c07e7ebe6b3558f51b24d4da2a7fa944c0cf3c477de99095e`
- Vercel prod `dpl_FxhUJDaYgX7kN3T6jtoxopPxNdkP` ? live YAML id+hash verified

### On-chain (viem; cast not installed)
- Deregister 44: `0xc8aa51821a1dd0c4a5355ebc57af674014013819a4779f897704721217e44c1b`
- Register ? id **45**: `0xa3870195ef1d5578e40f204ad8ab74b82e73c033474617e1cd89e81463f60a5d` (pre?kind fix)
- Deregister 45: `0x266fa19963f8fc11ec1da2a09c10204cffba55b4bb183ed69965e59acc80a22e`
- Register ? id **46**: `0xbed2fd2c72cce57838c654de729b8d1ae88bf8096bdc29ac60df460ae0ed6c20` (current)
- Artifact: `memory/research-raw/x402/reregister-result.json`

### Dispatcher / x402 miner path
- Polled integrations ~10+ min (multi epoch @ `EPOCH_BLOCK_INTERVAL=300`) ? **CALIBER not listed** (still 125)
- Paid `POST /v1/92001/detect` + slug ? **404** after x402; unauth ? 402 (middleware, including fake ids)
- Rail `/v1/x402-test` still the only paid 200 path
- Blocker: node activation / YAML validation rejection (not visible via public API) or sync lag beyond polled window

### Next
- Ask Telegraph node operators / console for reject reason; align YAML further to live active examples (sarzops); re-poll + miner-specific paid detect

## 2026-08-30 â€” Activation diagnosis (reg 48; still not listed)

### Probes
- `/integrations` 200 (125), `/healthz` 200, `/openapi.json` 200
- `/rejected` `/pending` `/miners` `/registry` (+ `/v1/*`) â†’ **404**
- Artifact: `memory/research-raw/x402/activation-diagnosis-2026-08-30.json`

### YAML vs working miners
- 125/125 `kind: miner`; **0/125** have `signal_mapping.type`; intents **UPPERCASE**
- Working refs: ITS-AI, Veritarach, sarzops, amanat, preflight (activated same day 12:20Z)
- Patched: omit type; intents `AI_TEXT_DETECTION` + `CONTENT_VERIFICATION`; drop unobserved `TEXT_AUTHENTICITY_CHECK`
- Live sha256 `666eaf831cd3546fce00bd27d39e1fe3ce76ca44590fb2749f577c5062b38749`
- POST `/detect` 200 (Gate A upstream healthy)

### On-chain
- Reg 46 event-decoded: URL+hash matched then-live `69f4d780â€¦`
- Dereg 46â†’47â†’48; current **48** tx `0x162d8c07fc4a3e93305d030b9f0e7a71bf2cee68459bce28167a39eeecb96a42`
- Hash on-chain matches live bytes

### Integrations status
- **Not activated** â€” still 125; no 92001 / caliber after ~11 min (reg47) and ~3 min (reg48)
- TinyFish integrate console: skipped (no `TINYFISH_API_KEY` in `.env`)
- Do **not** claim activation; Discord / integrate console next for reject reason

## 2026-08-30 15:09 - YAML mirror + reg 49 (still unlisted)

- Fetched integrations (125); working YAML samples: preflight + degenlens (omit `on_chain`).
- Live caliber YAML **PARSE_OK**; critical diff vs recent working: we had `on_chain.fields` (integers/bools, no `strings`); working recent generics omit `on_chain`.
- Rewrote YAML (omit `on_chain`), sha256 `c9f96c3b395ac0637229a557d52d3ea929f3381ba311ba43bc4b3559680bd2a7`; Vercel prod `dpl_8DkcAnsD9QwAd4SDv79YuhTFZdGp`.
- Deregistered 48; registered **49** tx `0xde5a8c5849fdbf7d4b0580b232778c31effcb3a51fd5e8a4c12f877470e65ab4`.
- After ~3 min poll: integrations still 125, **92001 not listed**.

## 2026-08-30 15:28 — miner.yaml path + reg 50 (still unlisted)

### Done
- Ensured `public/protocol/caliber-truthport.yaml` ≡ `protocol/yaml/caliber-truthport.yaml` LF; sha256 `c9f96c3b395ac0637229a557d52d3ea929f3381ba311ba43bc4b3559680bd2a7`
- Added `public/miner.yaml` (same bytes) + `vercel.json` Content-Type `application/yaml`
- Prod deploy `dpl_2TcqFrr4dYoqZwZ7EMErg6qrwJGY` — both YAML URLs 200 + PARSE_OK
- Deregistered **49**; registered **50** yamlUrl=`…/miner.yaml` tx `0x8f6fa5b6a00efffe9af3b9adad7340f218ab03fd688a3fbd33d481ce4f09e22c`
- Polled `/integrations` 8×60s → still 125, no 92001 / caliber-truthport
- Skipped paid `/v1/92001/detect` (would 404); no `x402-receipt-truthport.json`
- Updated `protocol-status`, `CURRENT_STATE`, `KEYS_NEEDED`

### Blocker for Henry
Push for raw.githubusercontent.com YAML **or** Discord ask why registrationId **50** / vercel miner.yaml rejected.
