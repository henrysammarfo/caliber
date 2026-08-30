# LOCK-IN — How APIs land on Live Leaderboard (2026-08-30)

> Research dump: `memory/research-raw/leaderboard-2026-08-30/`  
> Keys: `TAVILY_API_KEY` / `TINYFISH_API_KEY` **absent** from `caliber/.env` (aftercut has placeholders only). TinyFish Fetch/Agent + Tavily advanced **skipped** — substituted with direct curl of integrate HTML/JS, dispatcher HTTP, WebFetch, prior GitBook dump. See `api-keys-status.json`.

---

## Exact registration path → Live Leaderboard

### Verdict

**Diamond `registerMiner` is necessary and sufficient for discovery.** The integrate console is a **guided UX** over the same on-chain call (plus Pinata pin + sandbox validate). There is **no separate “console-only” leaderboard enrollment API**.

Console UI currently shows **“No leaderboard data yet”** on `/`, while the dispatcher already has `scored: true` miners with ranks — treat **dispatcher `/integrations` scores** as the live scoring truth; the homepage leaderboard widget may be empty/stub.

### Path A — Integrate console (Connect API)

URL: `https://integrate.telegraphprotocol.com/register` (home “Connect API / Continue →”; `/connect` = **404**)

Wizard (from `app/register/page-*.js`):

1. **Connection / form → YAML**  
   Fields: Name, Base URL, Docs (website/documentation/repository/twitter/discord), Authentication (`none` | `bearer` + env/header/prefix), Error Reporting, Rate Limits & Resilience, Endpoints (path/method/intents/params/content-type/multipart/param-map), Semantics (label/confidence/reason + Supported Intents), optional On-Chain section, Advanced.  
   Or: **paste/upload a YAML file** (“Paste or upload a YAML file to continue.” / “Fill in the form to generate your YAML” / YAML PREVIEW).

2. **STEP 2 OF 3 — Validate & Upload to IPFS**  
   - `POST /api/validate` (sandbox-test endpoints; “no API key needed for keyless miners”)  
   - `POST /api/upload` → Pinata (`{"error":"yaml is required"}` on empty body; GET=405; OPTIONS=204)  
   - Result: IPFS HASH + IPFS URL (“Pinned to IPFS successfully.”)

3. **Register On-Chain** (wallet)  
   - Wallet Connect · **Base Sepolia**  
   - Calls **`registerMiner(string yamlUrl, bytes32 yamlHash, address feeAddress, uint256 minPriceUsdc, string[] supportedIntents)`**  
   - Auth note in UI: API key can be installed later via **Dashboard → API Key**, signed with registering wallet.

### Path B — Diamond-only (what CALIBER already did)

Same contract, no console required:

| Item | Value |
|---|---|
| Diamond (Base Sepolia) | `0x122396E8602BEed349434AA6E83123E7dD97F5A0` |
| Function | `registerMiner(string,bytes32,address,uint256,string[])` |
| yamlUrl | HTTPS or `ipfs://…` |
| yamlHash | **SHA-256** of raw YAML bytes (`0x…`) — not keccak |
| minPriceUsdc | ≥ 10000 ($0.01) |

Source: prior GitBook dump `gitbook-miner-registry-facet.md.txt` (live GitBook now behind sign-in).

### Activation → scored → “leaderboard”

Per GitBook + live probes:

1. On-chain `MinerRegistered` event  
2. Off-chain node fetches `yamlUrl`, verifies SHA-256 vs on-chain hash  
3. Stages pending → **activates at next epoch** → appears in `GET http://13.237.89.59:7044/miner-dispatcher/integrations` with `activation_status: "active"`  
4. Epoch scoring fills `scored`, `scores[]` (`intent_id`, `rank`, `score`)  
5. **No public** `/rejected` / `/pending` (404) — silent fail if validation rejects  

**CALIBER blocker:** regs 51–53 succeeded on-chain but **still absent** from `/integrations` (count **124** this dump). Until listed + scored, you cannot appear on any live scoreboard.

---

## WASM submit path (Script track)

URL: `https://integrate.telegraphprotocol.com/wasm`

From `app/wasm/page-*.js`:

1. Connect wallet · **Base Sepolia**  
2. Upload `.wasm` via **`POST /api/upload-wasm`** and/or remote hash via **`POST /api/hash-remote`** (“Link verified and hashed successfully.”)  
3. On-chain **`registerWasm`** (“Register WASM Module” / “Registering the scoring module on Base Sepolia.”)  
4. Success surface includes `registrationId`, `intentId`, `wasmUrl`, `wasmHash`, `txHash`  
5. Copy: winning module is **hot-swapped** as the live scorer  

Community ABI (not official GitBook; from `telegraph-wasm-check`): exports `alloc`, `dealloc`, `rank_answer`, memory; Stage 1 hard gates before spending gas. Sample link referenced in page HTML: `scorer.wasm?dl=0`.

OpenAPI for integrate console: **none public** beyond `/api/validate`, `/api/upload`, `/api/upload-wasm`, `/api/hash-remote`. Dispatcher OpenAPI is miner proxy only (`dispatcher_miner-dispatcher_openapi.json.json`, ~988KB).

---

## Peer snapshot (`/integrations`, 124 miners)

| Peer | id | Intent Henry named | Live score note (this dump) | yaml_url |
|---|---|---|---|---|
| **livecert** | 4433 | AI TEXT DETECTION (+ others) | **No `AI_TEXT_DETECTION` score entry**; has IP_GEOLOCATION **rank 1** epoch 295 | Pinata `QmbKp37…Up2Ug` |
| **veritarach-ai-text-detector** | 708425 | AI TEXT | **AI_TEXT rank 2** epoch 294 | Pinata `QmStgms5…LjMBB` |
| **bittensor-sn32-itsai** | 32 | AI TEXT | **AI_TEXT rank 3** epoch 294 | Pinata `Qmcq2f5…Fh5E` |
| faceplus | 112 | CONTENT VERIFICATION | CONTENT_VERIFICATION **rank 1** | `http://127.0.0.1:8099/faceplus.yaml` (node-local) |
| bittensor-sn34-bitmind | 34 | DEEPFAKE | DEEPFAKE/MEDIA/VIDEO **rank 1** | node-local yaml |
| preflight-ssl-verification | 20260828 | IP GEO (among many) | IP_GEOLOCATION **rank 2** | GitHub raw Preflight |
| sarzops-transaction-risk | 91001 | RESEARCH QUERY | RESEARCH_QUERY **rank 1** | `ipfs://bafkrei…` |
| tavily | 202 | FACT CHECK / NEWS | FACT_CHECK + NEWS_SEARCH **rank 1** | node-local yaml |

**Only 3 miners declare `AI_TEXT_DETECTION`:** livecert, veritarach, itsai.  
**Only 2 have AI_TEXT scores:** veritarach #2, itsai #3 — **no rank-1 AI_TEXT row in this dump** (Henry’s “livecert #1 AI TEXT” is **not** supported by current dispatcher `scores[]`; livecert is #1 on IP_GEOLOCATION).

Saved: `peer-integrations.json`, `ai-text-all-miners.json`, `ai-text-ranks.json`, `livecert.yaml`, `veritarach.yaml`.

---

## livecert YAML shape (key sections)

```yaml
version: "1"
kind: miner
id: 4433
slug: livecert
protocol: generic
name: LiveCert Operational Signals
base_url: https://miner-wine.vercel.app
docs:
  repository: https://github.com/Harshyadav442277/miner
auth:
  type: none
rate_limit_per_sec: 20
cache_ttl_sec: 60
circuit_threshold: 5
circuit_cooldown_seconds: 30
# 7 GET endpoints with per-endpoint intents: + params.query required/optional
# … /ssl-check, /storm-alert, /papers, /translate, /ip-geolocate, /weather-forecast …
  - path: /ai-detect
    external_path: /ai-detect
    method: GET
    intents: [AI_TEXT_DETECTION]
    params:
      query:
        required: [{ name: text, type: string, intents: ["*"], … }]
        optional: [{ name: query, type: string, intents: ["*"], … }]
input_schema:  # top-level; declares text/query so router fills params
output_schema: # rich multi-intent properties incl. confidence/verdict/reason
semantics:
  signal_mapping:
    confidence_field: confidence
    label_field: verdict
    reason_field: reason
  supported_intents:
    - SSL_VERIFICATION
    - STORM_ALERT
    - WEATHER_FORECAST
    - IP_GEOLOCATION
    - LANGUAGE_TRANSLATION
    - ACADEMIC_SEARCH
    - AI_TEXT_DETECTION
```

livecert lesson in their own `input_schema.text` description: **“the engine fills only parameters a miner declares”** — undeclared params arrive empty and scoring fails.

---

## Critical diffs: livecert vs `public/protocol/caliber-truthport.yaml`

| Field / area | livecert | CALIBER | Block risk |
|---|---|---|---|
| Top-level keys only on livecert | `rate_limit_per_sec`, `cache_ttl_sec`, `circuit_*`, `input_schema`, `output_schema` | absent | **Low for activation** (veritarach also omits these and is active+scored) |
| `docs` | repository | repository | OK (CALIBER has docs; veritarach omits — both fine) |
| Endpoint count | 7 | 1 (`/detect`) | OK for single-intent strategy |
| AI endpoint path | `GET /ai-detect` | `POST /detect` | **Scoring**, not activation — must match what router calls |
| Endpoint `intents:` | per-endpoint `[AI_TEXT_DETECTION]` | none (only semantics list) | **Medium** — livecert/preflight style; veritarach also omits per-endpoint intents and still scores |
| Endpoint `params:` | declares `text` (+ `query`) | none | **High for scoring quality** — router may not fill body/query without declared params/schema |
| `input_schema` / `output_schema` | present | absent | Medium for routing; veritarach proves omit can still score |
| `label_field` | `verdict` | `isAI` | **High for scoring** — response must expose mapped field name |
| `reason_field` | `reason` | **missing** | Medium — optional in console UI but peers that score well often set it |
| `confidence_field` | `confidence` | `confidence` | OK |
| Method | GET | POST | Must implement whatever dispatcher OpenAPI proxies |
| Multi-intent breadth | 7 intents | 1 (`AI_TEXT_DETECTION`) | Strategy choice — focus is fine if quality wins |

vs **veritarach** (closest activated AI_TEXT peer — CALIBER already near-clone):

| Field | veritarach | CALIBER |
|---|---|---|
| Shape | minimal (no schemas/rate/docs) | + `docs.repository` only |
| Endpoint | `POST /predict` | `POST /detect` |
| `label_field` | `label` | `isAI` |
| Intents | `AI_TEXT_DETECTION` only | same |

**YAML shape is unlikely why CALIBER is missing from `/integrations`** — veritarach’s thinner YAML activates. Residual activation cause remains **off-chain silent reject / listener miss** (ask Discord).

---

## What CALIBER must change to match and beat AI TEXT DETECTION

### Must (activation / listing)

1. **Get into `/integrations`** — Discord urgent; diamond-only is already done (id 53). Console re-pin via `/register` → `/api/validate` + `/api/upload` → on-chain is an optional retry path (fresh Pinata URL may help if fetch/CDN oddity).  
2. Do **not** invent leaderboard presence until `slug`/`id` appear with `activation_status: active`.

### Should (scoring contract once listed)

1. **Expose `label` (or alias `isAI`→`label`)** to match veritarach’s `label_field: label`, **or** set `label_field` to the real JSON key and keep it stable.  
2. Add **`reason_field: reason`** and return a short reason string.  
3. Declare router inputs: either endpoint `params` for `text`/`query` **or** top-level `input_schema.properties.text` (+ `query` alias) — livecert’s hard lesson.  
4. Confirm dispatcher OpenAPI proxies `POST /detect` (or add GET alias if needed).  
5. Keep `auth.type: none` until Dashboard API-key flow is intentional.

### To beat quality (after listed)

1. Compete with **veritarach** (fine-tuned DeBERTa, currently best AI_TEXT score in dump) — RAID holdout + calibrated confidence; livecert’s statistical GET `/ai-detect` is weaker and **unscored** on AI_TEXT right now.  
2. Optional: add resilience fields (`rate_limit_per_sec`, circuit) like livecert/preflight for ops polish — **not** required for listing.  
3. Dual-track: ship **GRADELOCK** via `/wasm` + `registerWasm` before Track 2 close (Aug 31).

---

## Research gaps / honesty

| Item | Status |
|---|---|
| TinyFish Fetch + Agent | **SKIPPED** — no real `TINYFISH_API_KEY` in caliber `.env` |
| Tavily advanced | **SKIPPED** — no `TAVILY_API_KEY` |
| Live GitBook | Sign-in wall; used prior facet dump + community WASM check |
| Browser MCP automation | Failed to attach tab this session; used HTML/JS chunk extraction instead |
| Console Live Leaderboard widget | Empty copy despite dispatcher scores |

---

## Artifact index

- `integrations-raw.json` — full dispatcher dump (124)  
- `peer-integrations.json` — Henry’s peers + veritarach/itsai  
- `livecert.yaml` / `veritarach.yaml` / `preflight.yaml`  
- `yaml-field-diff.json` — top-level field diff  
- `integrate-register.html` + `…register_page-….js` — Connect API wizard  
- `integrate-wasm.html` + `…wasm_page-….js` — Script track  
- `gitbook-miner-registry-facet.md.txt` — registerMiner semantics  
- `api-keys-status.json` — key skip evidence  
