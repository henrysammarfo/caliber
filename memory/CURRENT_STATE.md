# CALIBER — CURRENT STATE (LOCK-IN)

> Updated **2026-09-03** — Track 3 demand app in-repo. Miner **387** + WASM **2256** VERIFIED. X `@henrysammarfo_2`. Wallet `0x9ADd0ac311e9E528800afc3F4A04e9cDe52C9cE0`.

## Doctrine

- Dual track shipped: TRUTHPORT (Miner) + GRADELOCK (Script)
- Track 3: DEMAND APP — product that pays live Telegraph miners via x402
- Intent focus: **AI_TEXT_DETECTION** (plus weather / crypto / fraud / news consumption)
- Quality flywheel evidence > demo theater
- Never claim unhackable; residual risk documented
- Frontend (`src/lib/miner`) is live miner source of truth; `protocol/truthport` keeps v1 CI smoke

## Competitors (Live Leaderboard / dispatcher)

Poll `memory/research-raw/track3-integrations-2026-09-03.json` epoch **305**:

| Peer | Notes |
|---|---|
| **caliber-truthport-text-auth** | AI_TEXT rank **#1** — score 2.403846e-10 |
| livecert | AI_TEXT rank **#2** |
| veritarach-ai-text-detector | AI_TEXT rank **#3** |
| bittensor-sn32-itsai | AI_TEXT rank **#4** |

Rank is not frozen — re-poll before claiming in posts.

## Product (LOCK-IN snapshot)

| Layer | Status |
|---|---|
| Truthport **v2** detector | Live — `label` / `reason` / `verdict` + `/predict` + `/detect` + `/ai-detect` |
| YAML scoring contract | Multi-endpoint v2; sha256 `5d9c3d2d…` |
| Deploy | `https://caliber-teamtitanlink.vercel.app` |
| On-chain register | **Console reg 387** |
| x402 rail | Miner-specific paid `/detect` verified |
| GRADELOCK WASM | Import-free; registerWasm **2256** |
| Track 3 app | Public checker `/demand-app` + console `/dashboard/intel` + analytics `/dashboard/demand` |
| Track 3 proxy | `POST /intel` — x402 to miner-dispatcher |
| X | Track 1 thread posted; Track 3 drafts in `memory/TRACK3_X_DRAFTS.md` (Henry to post) |

## Track 3 (Applications) — 2026-09-03

Window: Aug 31 – Sep 7. Must use **real** Telegraph miners (no mocks).

| Surface | Path |
|---|---|
| Public AI checker | `/demand-app` |
| Intelligence console | `/dashboard/intel` |
| Demand analytics | `/dashboard/demand` |
| Paid proxy | `POST /intel` `{ intent, query }` |

Intent routes (dispatcher, smoke HTTP 200 — `memory/artifacts/track3-intel-smoke.json`):

| Intent | Miner | Path |
|---|---|---|
| AI_TEXT_DETECTION | caliber-truthport-text-auth `20260830` | POST `/detect` |
| WEATHER_FORECAST | weathertop-v3 `82920263` | GET `/weather-forecast` |
| CRYPTO_PRICE | optivis-crypto-price `7311` | GET `/price` |
| FRAUD_DETECTION | sarzops-transaction-risk `91001` | POST `/fraud` |
| NEWS_SEARCH | verity-news-search `9004` | GET `/news` |

**Ops:** set `PRIVATE_KEY` or `EVM_PRIVATE_KEY` on Vercel production so `/intel` can pay x402. Apply `supabase/migrations/20260903160000_create_query_log.sql` for analytics persistence. Do not commit keys.

Port `8080` is **not** a generic Engine — it is a chatbot miner (`/v1/chat/completions`). Consumption uses miner-dispatcher `:7044`.

## Verified (portal)

Hackathon My Submissions: miner **387** + WASM **2256** VERIFIED (2026-08-31).

## Blocker

None on miner listing. Track 3 live path needs Vercel env key + query_log migration applied on hosted Supabase. Keep miner up through Sep 7.

## Leaderboard history

- **2026-09-03** epoch 305: CALIBER AI_TEXT **#1** (see dump `track3-integrations-2026-09-03.json`)
- **2026-08-31** epoch 297: CALIBER AI_TEXT **#2** behind livecert (`rank-now-2026-08-31.json`)
