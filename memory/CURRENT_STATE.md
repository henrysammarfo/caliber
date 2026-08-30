# CALIBER - CURRENT STATE

> Updated **2026-08-30** (miner.yaml host + reg **50**; **not** in `/integrations` after 8m poll).

## Product lock

| Field | Value |
|---|---|
| Product | **CALIBER** |
| H1 strategy | **Dual: Miner + Script** |
| Vertical | **LOCKED: AI text authenticity** |
| Signal / intents | Live-aligned: `AI_TEXT_DETECTION`, `CONTENT_VERIFICATION` (UPPERCASE) |
| Holdout | synthetic-ci (80) live in repo — **RAID** primary real set (not imported) |
| Security | Residual risk documented — **never unhackable** |

## Gate A - Public HTTPS (DONE)

| Item | Value |
|---|---|
| Primary | https://caliber-teamtitanlink.vercel.app |
| Alias | https://caliber-smoky.vercel.app |
| YAML (canonical path) | https://caliber-teamtitanlink.vercel.app/protocol/caliber-truthport.yaml |
| YAML (peer-style path) | https://caliber-teamtitanlink.vercel.app/miner.yaml |
| Detect | https://caliber-teamtitanlink.vercel.app/detect |
| Vercel projectId | `prj_PmiIcdoclM1fipuWCNjWIIjaYzT5` |
| Deployment | `dpl_2TcqFrr4dYoqZwZ7EMErg6qrwJGY` |
| YAML `id` | **92001** |
| YAML `kind` | **miner** |
| YAML sha256 (LF bytes) | `c9f96c3b395ac0637229a557d52d3ea929f3381ba311ba43bc4b3559680bd2a7` |
| Content-Type (both YAML URLs) | `application/yaml; charset=utf-8` (verified 200 + PARSE_OK) |
| auth | `type: none` (Gate A; bearer planned) |

## Gate B - registerMiner (DONE - current)

| Item | Value |
|---|---|
| Network | Base Sepolia (84532) |
| Diamond | `0x122396E8602BEed349434AA6E83123E7dD97F5A0` |
| feeAddress | `0x9ADd0ac311e9E528800afc3F4A04e9cDe52C9cE0` |
| registrationId | **50** |
| tx | `0x8f6fa5b6a00efffe9af3b9adad7340f218ab03fd688a3fbd33d481ce4f09e22c` |
| Explorer | https://sepolia.basescan.org/tx/0x8f6fa5b6a00efffe9af3b9adad7340f218ab03fd688a3fbd33d481ce4f09e22c |
| Deregistered | **49** tx `0xfc2411a7a3b9d8eff316c7d3ab5a0cb63fda23d2393cdb6614ca62bb7584d8af` |
| Prior ids | 44 → 45 → 46 → 47 → 48 → 49 → **50** |
| minPriceUsdc | 10000 (0.01 USDC units) |
| yamlUrl on-chain | `https://caliber-teamtitanlink.vercel.app/miner.yaml` |
| YAML hash on-chain | `0xc9f96c3b395ac0637229a557d52d3ea929f3381ba311ba43bc4b3559680bd2a7` |
| Status | **on-chain success** — **not** listed in dispatcher `/integrations` |

## Gate C - x402 paid path

| Item | Value |
|---|---|
| Dispatcher | `http://13.237.89.59:7044/miner-dispatcher` |
| Rail (DONE) | `GET /v1/x402-test` → 200; receipt `memory/artifacts/x402-receipt.json` |
| Miner-specific | **NOT YET** — skipped paid `/v1/92001/detect` this turn (still unlisted); no new `x402-receipt-truthport.json` |
| Integrations | CALIBER **not listed** after **8×60s** poll post-reg 50 (still **125**); poll `memory/research-raw/x402/integrations-poll-caliber.json` |

## Activation note (2026-08-30 later)

- `/miner.yaml` + `/protocol/caliber-truthport.yaml` byte-identical LF; Content-Type `application/yaml`
- Re-registered with peer-style `/miner.yaml` URL → reg **50**
- Still absent from `/integrations` — likely silent off-chain reject, host allowlist, or listener miss

## Build progress

| Layer | Status |
|---|---|
| `protocol/` TRUTHPORT + GRADELOCK + WASM | **Done** — tests+smoke green |
| YAML v1 (id 92001, kind miner, live intents) | **Live** — sha256 `c9f96c3b…0bd2a7` |
| Honest UI (no fake 4128/0.912) | **Done** |
| Threat model | `memory/THREAT_MODEL.md` |
| Keys playbook | `memory/KEYS_NEEDED.md` |
| Public HTTPS `base_url` | **DONE - Gate A** |
| `registerMiner` | **DONE - Gate B (id 50)** |
| x402 e2e rail | **DONE - Gate C** |
| x402 miner proxy / dispatcher listing | **Open** |
| RAID import | Open |
| Official WASM ABI confirm | Open (PARTIAL community ABI) |

## Smoke (synthetic-ci)

- Honest mean Brier ≈ **0.05493**
- All 4 adversarial attacks rank worse than honest

## Next for Henry (blocker)

1. **(a)** Push this repo so we can re-register with `raw.githubusercontent.com/.../miner.yaml` (or protocol YAML) like winning peers, **or (b)** ask Telegraph Discord why **registrationId 50** / yamlUrl `https://caliber-teamtitanlink.vercel.app/miner.yaml` is rejected or not ingested (no public `/rejected` API).
2. After listing appears for id **92001** / slug `caliber-truthport-text-auth`, re-run paid `POST /v1/92001/detect` → `memory/artifacts/x402-receipt-truthport.json`.
3. **Rotate Gate B wallet** — private key was chat-pasted earlier; keep only in `.env`.
4. X build posts.
