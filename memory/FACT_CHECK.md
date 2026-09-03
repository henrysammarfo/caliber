# CALIBER ? FACT CHECK

> Every claim tagged. Unverified stays unlabeled as fact. Dumps: `memory/research-raw/`.

## Method

| Tool | Role | Notes |
|---|---|---|
| Portal raw HTML | Deadline / prizes / tracks | Authoritative for submit close |
| TinyFish Fetch | Page extract | Can mis-render countdown ? **cross-check HTML** |
| TinyFish Agent | Automation confirm | Agreed 23:59 with HTML (2026-08-29) |
| Tavily Search | Indexed web + answer | Secondary; cite URLs |
| GitBook `.md` | YAML / x402 / registry | Authoritative for SDK |
| Scoutbot memory | Thesis history | May be stale vs live |

---

## Hackathon facts

| Claim | Status | Evidence |
|---|---|---|
| Season I portal exists | **VERIFIED** | https://hackathon.telegraphprotocol.com/ |
| Submissions close **Sep 7, 2026 ? 23:59 UTC** | **VERIFIED (2026-08-29)** | `portal-deadline-snippet.txt`, raw HTML |
| Submissions close 12:00 UTC | **STALE / FALSE vs live HTML** | Bible, LOCKED, DEEP_PASS, roadmap.tsx, older TinyFish dump |
| H1 = $5k ? H2 = $10k ? H3 TBD | **VERIFIED** | Portal |
| Season messaging $15k | **VERIFIED** as H1+H2 sum | Portal; do not call H1 alone $15k |
| Dual Miner+Script allowed | **VERIFIED** | Portal: ?or both? |
| Track 3 after 1&2 | **VERIFIED** | Portal |
| ?300+ registered? | **SECONDARY** | Portal marketing; not Discord-audited |
| Exact 1st/2nd prize splits inside $5k | **UNVERIFIED** | Still open |

---

## Protocol / SDK facts

| Claim | Status | Evidence |
|---|---|---|
| YAML Standard `version: "1"` | **VERIFIED** | GitBook yaml-standard.md |
| Canonical signal types + 27 intents | **VERIFIED** | Same |
| `registerMiner(string,bytes32,address,uint256,string[])` | **VERIFIED** | miner-registry-facet.md |
| Diamond Base Sepolia `0x122396E8602BEed349434AA6E83123E7dD97F5A0` | **VERIFIED in docs** | Re-verify on explorer before tx |
| x402 headers + $0.01 floor | **VERIFIED** | x402-payment.md |
| On-chain price is source of truth (YAML price informational) | **VERIFIED** | x402-payment.md |
| WASM eval scripts by Script Authors | **VERIFIED** | Portal + protocol site |
| Full WASM host API surface for graders | **PARTIAL** (still) | Official GitBook ABI missing; community `telegraph-wasm-check` only ? do not treat as final |
| integrate.telegraphprotocol.com enters hackathon | **VERIFIED** | Console copy |
| Live leaderboard has data | **VERIFIED empty (console widget)** | integrate `/`: “No leaderboard data yet” (2026-08-30) |
| Dispatcher has scored miners | **VERIFIED** | `/integrations` scores[] e.g. veritarach AI_TEXT r2; livecert IP_GEO r1 |
| Console Connect API path | **VERIFIED** | `/register` (not `/connect`); steps Connection→`/api/validate`+`/api/upload` Pinata→`registerMiner` |
| Console WASM path | **VERIFIED** | `/wasm`; `/api/upload-wasm` + `/api/hash-remote` → `registerWasm` Base Sepolia |
| livecert #1 on AI_TEXT | **FALSE vs dispatcher dump** | livecert has AI_TEXT intent but **no** AI_TEXT score; IP_GEO r1; AI_TEXT scored: veritarach r2, itsai r3 only |
| YAML schemas required for activation | **FALSE** | veritarach (no schemas) active+scored; livecert/preflight have schemas |

---

## Product / repo claims

| Claim | Status | Evidence |
|---|---|---|
| CALIBER locked as Telegraph thesis | **VERIFIED** | LOCKED.md ? RECHECK ? Bible |
| Vertical locked | **VERIFIED (product decision 2026-08-29)** | `CURRENT_STATE.md` + vertical research; Bible ?3 may still say open ? prefer CURRENT_STATE |
| `caliber-gold-v3` / 4128 rows exist | **FALSE** (UI stripped) | Was invent fiction; marketing/status no longer claim 4128 |
| Grader agreement 0.912 | **FALSE** (UI stripped) | Was cosplay; UI no longer claims 0.912 ? use smoke Brier only |
| YAML + registry on-chain | **VERIFIED (2026-08-30)** | registerMiner tx `0xb45f13bf81e4b779fc8667389283768faade0bbd46601fd2197b769e24351f2b`; registrationId 44 |
| Site YAML (`vertical.verify`, invented checksum) | **INVALID vs schema** | Compare to GitBook; use `protocol/yaml/caliber-truthport.yaml` |
| ?Cannot be gamed? grader marketing | **OVERCLAIM** | Prefer ?resistance to gaming? + published tests; never absolute |
| `protocol/` miner + grader packages | **VERIFIED local** | `npm test` + `npm run smoke` (2026-08-29); synthetic CI holdout only |
| YAML SHA-256 `3bee59037c3c9ff2f7018036a112e7872afc47b1192b8a80cfa8e0c3ab30f629` | **VERIFIED** | `npm run hash-yaml` after on_chain integers/bools fix (2026-08-29) |
| YAML `on_chain.fields` uses integers + bools (not string-only) | **VERIFIED** | `protocol/yaml/caliber-truthport.yaml` |
| Smoke honest mean Brier ? 0.05493 (synthetic-ci, n=64) | **VERIFIED local** | `npm run smoke` 2026-08-29 |
| WASM ABI still PARTIAL | **PARTIAL** | Community ABI target; official GitBook UNVERIFIED |
| UI claims fake 4128 / 0.912 | **FALSE / removed** | Status + routes use honest protocol-status / smoke figures |
| Gate A public HTTPS (YAML + detect) | **VERIFIED (2026-08-30)** | curl GET YAML 200; POST /detect returns confidence/isAI; host `caliber-teamtitanlink.vercel.app`; sha256 `44117168d49965769e3064919f8d816f2c40d0e965450ad596e4f9fa85756212` |
| YAML SHA-256 `44117168d49965769e3064919f8d816f2c40d0e965450ad596e4f9fa85756212` | **VERIFIED** | `cd protocol && npm run hash-yaml` after Gate A base_url + auth none (2026-08-30) |
| YAML SHA-256 `3bee59037c3c9ff2f7018036a112e7872afc47b1192b8a80cfa8e0c3ab30f629` | **STALE** | Pre?Gate A draft hash; superseded by live Gate A bytes |

---


| `registerMiner` CALIBER on Base Sepolia | **VERIFIED (2026-08-30)** | Current tx `0x162d8c07fc4a3e93305d030b9f0e7a71bf2cee68459bce28167a39eeecb96a42` (id **48**); priors 44/45/46/47 deregistered |
| registrationId **44** / **46** / **47** | **STALE** | Superseded by **48** |
| Live YAML sha256 `4b8499facd04a3cf061825e29885bc2903c6a0b71c61e91ce612e19ef55b1052` | **STALE** | Superseded |
| Gate A sha256 `44117168?85756212` | **STALE vs live** | Superseded |
| Live YAML sha256 `69f4d780f931eb5c07e7ebe6b3558f51b24d4da2a7fa944c0cf3c477de99095e` | **STALE** | Pre-intent-case fix; superseded by `666eaf83â€¦8749` |
| Diamond `0x122396E8602BEed349434AA6E83123E7dD97F5A0` used in live tx | **VERIFIED on-chain** | Successful registerMiner against docs Diamond |
| Dispatcher OpenAPI server `http://13.237.89.59:7044/miner-dispatcher` | **VERIFIED (2026-08-30)** | GitHub Telegraph-api-docs openapi; `GET /healthz` 200 |
| Unauth `/v1/*` returns HTTP 402 + `PAYMENT-REQUIRED` | **VERIFIED** | Also returns 402 for unknown ids (global gate) |
| x402 paid `GET /v1/x402-test` ? 200 + settlement tx | **VERIFIED** | `memory/artifacts/x402-receipt.json`; tx `0xde146c9da2983692932fd7f787035e1063f6b3506a7badb9313a8286190493cf` |
| YAML subnet `id: 91001` free | **FALSE** | Taken by `sarzops-transaction-risk` |
| Free YAML id **92001** | **VERIFIED free in /integrations (2026-08-30)** | Still absent from dispatcher listing |
| Live YAML `id: 92001` + sha256 `666eaf831cd3546fce00bd27d39e1fe3ce76ca44590fb2749f577c5062b38749` | **VERIFIED** | GET live YAML after Vercel prod; matches reg 48 event hash |
| Live integrations use `kind: miner` (not `subnet`) | **VERIFIED** | 125/125 integrations `kind: miner` |
| Live integrations omit `signal_mapping.type` | **VERIFIED** | 0/125 have type; ITS-AI/Veritarach/preflight YAMLs omit type |
| Live intents are UPPERCASE | **VERIFIED** | e.g. `AI_TEXT_DETECTION`; GitBook lowercase **STALE vs live node** |
| GitBook YAML `kind: subnet\|validator` only | **STALE vs live node** | Prefer live integrations YAML |
| `deregisterMiner(uint256)` then re-`registerMiner` | **VERIFIED** | GitBook update flow; txs through id 48 |
| Current registrationId **48** | **VERIFIED** | topic1; tx `0x162d8c07â€¦6a42`; dump `_onchain-tx48.json` |
| On-chain reg 46 yamlUrl+yamlHash matched then-live bytes | **VERIFIED** | Event data decode; `_onchain-tx46` path via manual decode |
| CALIBER in dispatcher `/integrations` | **FALSE (not activated)** | Still 125; no slug/id 92001 after reg 48 + polls; `activation-diagnosis-2026-08-30.json` |
| Dispatcher `/rejected` `/pending` APIs | **FALSE / 404** | Probed; cannot read reject reason via HTTP |
| Paid `/v1/92001/detect` miner path | **FALSE (404 after pay)** | `paid-attempt-fail.json`; listing blocker |
| `EPOCH_BLOCK_INTERVAL` default 300 | **VERIFIED in GitBook** | miner-registry-facet.md |
| Activation diagnosis root cause | **HYPOTHESIS** | Silent off-chain reject or listener miss â€” see `activation-diagnosis-2026-08-30.json`; do **not** claim activated |

---

## Security language

| Claim | Status |
|---|---|
| Build is unhackable / NK hackers can?t find bugs | **REJECTED** ? residual risk always remains |
| Production hardening + tests reduce risk | **OK** if evidenced |

---

## Corrections to apply in docs/UI

1. Deadline ? **23:59 UTC** everywhere (Bible, LOCKED, roadmap).
2. Vertical locked; registry **done on-chain** (Gate B). Labeled RAID import still open.
3. Replace invented YAML with schema-valid draft after vertical lock.
4. Soften absolute anti-game language.
5. Rotate API keys pasted in chat (2026-08-29).

---

## Text authenticity datasets + WASM (2026-08-29 research)

| Claim | Status | Evidence |
|---|---|---|
| Canonical signal `text_authenticity` + intents `ai_text_detection`, `text_authenticity_check`, `content_verification` | **VERIFIED** | `gitbook-yaml-standard-2026-08-29.md` |
| GitBook has full WASM Script Author ABI | **FALSE / missing** | `llms.txt` ? no script/WASM eval pages |
| Portal: miners + evaluation scripts / Script Authors | **VERIFIED** | portal TinyFish fetch |
| WASM exports `alloc`/`dealloc`/`rank_answer`/(`breakdown_answer`) | **PARTIAL (community)** | `neromtoobad/telegraph-wasm-check` README ? not GitBook |
| WASM register hash = keccak256; miner YAML = SHA-256 | **PARTIAL (community)** | same README |
| RAID license MIT; HF `liamdugan/raid` | **VERIFIED** | GitHub LICENSE + HF API card |
| RAID labels via `model` (`human` vs LLM) + detector `list[float]` | **VERIFIED** | HF viewer + RAID README |
| HC3 license CC-BY-SA-4.0 | **VERIFIED** | HF API `Hello-SimpleAI/HC3` |
| Ghostbuster essay cleaned CC-BY-3.0; 7-class `label` | **VERIFIED** | HF API + TinyFish fetch |
| M4 redistribution license clear for commercial | **UNVERIFIED** | mbzuai-nlp/M4 README lacks clear SPDX |
| Recommended H1 holdout = RAID | **RECOMMENDATION** | dumps under `memory/research-raw/vertical/text-authenticity/` |


---

## Protocol honesty refresh (2026-08-29 BUILDING)

| Claim | Status | Evidence |
|---|---|---|
| WASM Script Author ABI (official) | **PARTIAL / UNVERIFIED** | GitBook still lacks full surface; community `rank_answer` only |
| YAML `on_chain` field groups | **VERIFIED** integers + bools | `confidence_x10000` + `is_ai` in `caliber-truthport.yaml` |
| Smoke Brier (honest mean) | **VERIFIED** 0.05493 | `protocol` smoke on synthetic-ci holdout |
| Fake UI metrics 4128 / 0.912 | **REMOVED** | Do not reinstate; cite `PROTOCOL_STATUS` / smoke |

### 2026-08-30 (YAML rewrite / reg 49)
- Claim: live \caliber-truthport.yaml\ parses â€” **VERIFIED** (js-yaml).
- Claim: recent working miners omit \on_chain\ â€” **VERIFIED** (preflight, degenlens; veritarach too).
- Claim: CALIBER listed in dispatcher after reg 49 â€” **FALSE** (still 125, no 92001 after ~3 min).

| Live `/miner.yaml` + `/protocol/caliber-truthport.yaml` Content-Type application/yaml | **VERIFIED (2026-08-30)** | Both 200; sha256 `c9f96c3b…0bd2a7`; PARSE_OK |
| `registerMiner` registrationId **50** | **VERIFIED on-chain** | tx `0x8f6fa5b6a00efffe9af3b9adad7340f218ab03fd688a3fbd33d481ce4f09e22c`; prior 49 deregistered |
| CALIBER in dispatcher `/integrations` after reg 50 | **FALSE (as of 8m poll)** | 8 rounds × 60s; count 125; no 92001 |
| Paid miner detect receipt truthport | **NOT DONE** | Skipped while unlisted |

### 2026-08-30 (GitHub raw YAML / reg 51)
| Claim | Status | Evidence |
|---|---|---|
| Commit `25f16bbb8d710d6309b33ae6dbfcc3807735ee6f` on origin/main | **VERIFIED** | git push |
| Tracked `.env` removed from git | **VERIFIED** | commit deletes `.env`; `.env*` gitignored |
| Repo public (for raw.githubusercontent.com) | **VERIFIED** | `gh repo edit --visibility public` |
| Raw YAML URL HTTP 200 + sha256 match local | **VERIFIED** | `c9f96c3b…0bd2a7` |
| `registerMiner` registrationId **51** | **VERIFIED on-chain** | tx `0xd28d7a8d…330efa`; deregistered 50 |
| CALIBER in dispatcher `/integrations` after reg 51 | **FALSE (as of 10m poll)** | ~8 polls; count 125; no 92001 |
| Paid miner detect receipt truthport | **NOT DONE** | Skipped while unlisted |
| Track 1/2 close Aug 31 (Miner+Script) | **VERIFIED** | `memory/PORTAL_RULES_2026-08-30.md` from portal Rules |

### 2026-08-30 (template rewrite / regs 52–53) — **Aug 31 urgency**

| Claim | Status | Evidence |
|---|---|---|
| Track **1 Miners** + **2 Script Authors** close **Aug 31, 2026** (not Sep 7) | **VERIFIED** | Portal Rules paste `PORTAL_RULES_2026-08-30.md`; Track 3 apps Aug 31–Sep 7 only |
| Sep 7 = Track 3 / overall apps window (not Miner close) | **VERIFIED** | Same portal rules |
| Miner prize pool $2k (1st $1k / 2nd $600 / 3rd $400) | **VERIFIED** | Portal Rules |
| Live `AI_TEXT_DETECTION` peers (3) | **VERIFIED** | integrations: veritarach `708425`, itsai `32`, livecert `4433` (multi-intent) |
| Closest peer YAML shape = veritarach (minimal, auth none, POST, no schemas) | **VERIFIED** | Pinata `QmStgms5GJXxTpd1gqsgQAKYwm4KZWfBe5fwYcpECLjMBB` |
| Same-day activate template Preflight id `20260828` | **VERIFIED** | raw GitHub Preflight miner.yaml downloaded |
| Free numeric ids `20260830` / `92002` / `92001` | **VERIFIED free** | not in live integrations id set |
| YAML rewritten id **20260830**, intent **AI_TEXT_DETECTION** only, sha256 `982dffe9…90bfac` | **VERIFIED** | commit `c10e58f`; triple sync public+protocol+miner.yaml |
| GitHub raw YAML HTTP 200 + hash match | **VERIFIED** | `…/c10e58f…/public/protocol/caliber-truthport.yaml` |
| jsDelivr YAML HTTP 200 | **VERIFIED** | `cdn.jsdelivr.net/gh/henrysammarfo/caliber@c10e58f…` |
| `registerMiner` **52** (GitHub raw) | **VERIFIED on-chain** | tx `0xe0c01e9f…00320`; deregistered 51 |
| CALIBER in `/integrations` after reg 52 | **FALSE (12m poll)** | 12×60s; count 124; no 20260830 / caliber slug |
| `registerMiner` **53** (jsDelivr yamlUrl) | **VERIFIED on-chain** | tx `0x5f332267…019e08`; deregistered 52 |
| CALIBER in `/integrations` after reg 53 | **FALSE (5m poll)** | count 124; still absent |
| Dispatcher `/rejected` API | **FALSE / 404** | cannot read reject reason |
| Paid miner detect receipt | **NOT DONE** | blocked while unlisted |

### 2026-08-30 LOCK-IN (Truthport v2 / reg 55)

| Claim | Status | Evidence |
|---|---|---|
| YAML sha256 `5d9c3d2d…fe3c` LF triple-sync | **VERIFIED** | public/miner.yaml = public/protocol = protocol/yaml |
| Prod deploy caliber-teamtitanlink | **VERIFIED** | dpl_ETuGisRLzQXQbzTKrnY3Y7zxFisf; aliases smoky + teamtitanlink |
| POST /predict returns label+confidence+reason | **VERIFIED** | live smoke 200 |
| GET /ai-detect returns label+confidence+reason | **VERIFIED** | live smoke 200 |
| Pinata YAML CID QmVTkd…xYS6 | **VERIFIED** | /api/upload; gateway sha256 match |
| registerMiner **55** | **VERIFIED on-chain** | tx 0xda07a128…7d07af29; dereg 53 |
| /gradelock.wasm hosted | **VERIFIED** | 200 application/wasm; sha256 1038058b… (import-free rebuild 2026-08-31) |
| WASM Pinata upload | **VERIFIED** | CID QmWxjGDseqgfmMwCX1x6REANA6f1vvFpo6uJe6vsQsBDff (replaces QmWVPg…) |
| registerWasm on-chain | **VERIFIED (2026-08-31)** | id **2256**; tx 0xc33226e6243daa5aa6aa38141765796320fa4f4196383c1a29dac2a89accc44d; Diamond 0x5a2324; keccak 0x3a034942…; prior id **2126** structurally rejected (`module[env] not instantiated`) |
| CALIBER in dispatcher /integrations | **FALSE (poll 20:06Z)** | 200 OK count 93; no 20260830 / QmVTkd / caliber-truthport |
| veritarach AI_TEXT rank ~2 | **VERIFIED** | leaderboard-2026-08-30 dump |

### 2026-08-30 Script track (registerWasm)

| Claim | Status | Evidence |
|---|---|---|
| Truthport v2 live | **VERIFIED** | prod smoke + CURRENT_STATE |
| registerMiner 55 Pinata YAML | **VERIFIED on-chain** | tx 0xda07a128; CID QmVTkd |
| Console ABI registerWasm(bytes32,string,string) | **VERIFIED** | integrate wasm page chunk 1319 |
| WASM hash keccak256 file bytes | **VERIFIED** | viem keccak256; local=Pinata for import-free build 0x3a034942… |
| Docs Diamond 0x122396 has registerWasm | **FALSE** | simulate: Function does not exist |
| Console Diamond 0x5a2324 has registerWasm | **VERIFIED** | simulate OK + successful tx |
| registerWasm id 2126 | **REJECTED structurally** | env.abort import → `module[env] not instantiated` |
| registerWasm id 2256 | **VERIFIED on-chain (2026-08-31)** | import-free WASM; WasmRegistered; tx 0xc33226e6… block 46183998 |
| Miner listed in /integrations | **VERIFIED later** | console reg 387 → listed (see dual-diamond section) |

### 2026-08-31 GRADELOCK import-free fix

| Claim | Status | Evidence |
|---|---|---|
| Prior WASM imported `env.abort` | **VERIFIED** | `gradelock.wat` `(import "env" "abort" …)` |
| Rebuild has ZERO imports | **VERIFIED** | Select-String + `WebAssembly.Module.imports` → `[]` |
| Custom `@global abort` + `use: ["abort=abort"]` | **VERIFIED** | `protocol/gradelock/assembly/{index.ts,asconfig.json}` |
| Byte-scan JSON (no String.UTF8) | **VERIFIED** | `parseLabelBytes` / `parseConfidenceBytes` |
| Smoke score Brier | **VERIFIED** | conf 0.8 label 1 → ~0.96; blank → 0 |
| Pinata CID QmWxjGD… | **VERIFIED** | `/api/upload-wasm`; keccak match local |
| telegraph-wasm-check | **SKIPPED** | `go` not installed on build host |


## Dual Diamond (console vs docs) — VERIFIED 2026-08-30

| Claim | Status | Evidence |
|---|---|---|
| Console Diamond (integrate JS) | **VERIFIED** | `0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8` from wasm/shared chunk `r=` export; console ABI includes registerMiner + registerWasm |
| Docs / GitBook Diamond | **VERIFIED in docs** | `0x122396E8602BEed349434AA6E83123E7dD97F5A0` miner-registry-facet.md |
| Console has registerMiner + registerWasm | **VERIFIED** | simulate both OK on console Diamond |
| Docs has registerMiner only | **VERIFIED** | registerMiner simulate OK; registerWasm → Diamond: Function does not exist |
| Prior miner regs 44–55 | **on docs Diamond** | `_reregister-miner.mjs` DIAMOND=0x122396…; reg 55 tx 0xda07a128… |
| registerWasm id 2126 | **on console Diamond (obsolete)** | tx 0x43d0c770…; rejected structurally |
| registerWasm id 2256 | **on console Diamond (current)** | tx 0xc33226e6…; import-free |
| registerMiner on console (same YAML as reg 55) | **VERIFIED** | registrationId **387**; tx 0x93b2bb04abc052f2e1d2f3f9ed2042dc52484792099dd4c1a926206b34d88b63; block 46179118; yamlHash 0x5d9c3d2d… |
| Dispatcher lists caliber after console reg | **VERIFIED** | `/miner-dispatcher/integrations` count 126; slug `caliber-truthport-text-auth` id 20260830 active; Pinata QmVTkd…; `integrations-poll-console-reg387.json` |
| integrate.telegraphprotocol.com/api/integrations | **404** | not public at that path (2026-08-30) |

| Miner-specific x402 paid /v1/20260830/detect | **VERIFIED** | HTTP 200; payment tx 0x6d7db1bd…; receipt `memory/artifacts/x402-receipt-truthport.json`; body confidence 0.37291 / human_written |
| Free (unauth) dispatcher predict/detect | **VERIFIED none** | All four URLs HTTP 402 Payment Required amount 10000 |
| protocol-status listed/reg387/wasm2256/x402 miner | **UPDATED** | `src/lib/protocol-status.ts` 2026-08-31 import-free WASM |
| Track 3 window Aug 31 – Sep 7 | **VERIFIED** | https://hackathon.telegraphprotocol.com/rules |
| Track 3 must use real miners (no mocks) | **VERIFIED** | Same rules page |
| Port 8080 is generic Engine `/engine/ask` | **FALSE** | 2026-09-03: OpenAPI title "Telegraph Chatbot Miner"; only `/v1/chat/completions` + `/health` |
| Track 3 paid dispatcher 5 intents | **VERIFIED** | `memory/artifacts/track3-intel-smoke.json` all HTTP 200 |
| AI_TEXT rank #1 as of 2026-09-03 | **VERIFIED then** | catalog dump epoch 305; rank can move |
