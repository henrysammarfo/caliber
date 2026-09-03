# CALIBER — CURRENT STATE (LOCK-IN)

> Updated **2026-09-03** — Safe sessions + per-user tenants. Public = local `/detect`; paid `/intel` = cookie auth. Miner **387** + WASM **2256** VERIFIED. X `@henrysammarfo_2`. Wallet `0x9ADd0ac311e9E528800afc3F4A04e9cDe52C9cE0`.

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
| Deploy | **https://caliber-smoky.vercel.app** (primary share); alias `caliber-teamtitanlink` (miner YAML base_url) |
| On-chain register | **Console reg 387** |
| x402 rail | Miner-specific paid `/detect` verified |
| GRADELOCK WASM | Import-free; registerWasm **2256** |
| Track 3 app | Public checker `/demand-app` (local) + console `/dashboard/intel` (paid) + `/dashboard/demand` |
| Track 3 proxy | `POST /intel` — **cookie session required** → x402 miner-dispatcher; rate-limited per `user_id` |
| Auth | Production: `@supabase/ssr` cookies (no localStorage JWT on smoky/teamtitanlink). Lovable preview keeps brokered storage |
| Tenancy | Per-user RLS (`user_id` = tenant). Migration `20260903190000_per_user_tenant_rls.sql` |
| X | Track 1 thread posted; Track 3 drafts in `memory/TRACK3_X_DRAFTS.md` (Henry to post) |

## Track 3 (Applications) — 2026-09-03

Window: Aug 31 – Sep 7. Must use **real** Telegraph miners (no mocks) on the **paid** path.

| Surface | Path | Auth / payment |
|---|---|---|
| Public AI checker | `/demand-app` → `POST /detect` | None — **local TRUTHPORT** (fast demo) |
| Intelligence console | `/dashboard/intel` → `POST /intel` | Cookie session + x402 |
| Demand analytics | `/dashboard/demand` | Cookie; own `query_log` rows only |
| Paid proxy | `POST /intel` `{ intent, query }` | Cookie `getUser()`; 401 if signed out; 429 if rate-limited |

Intent routes (dispatcher, smoke HTTP 200 — `memory/artifacts/track3-intel-smoke.json`):

| Intent | Miner | Path |
|---|---|---|
| AI_TEXT_DETECTION | caliber-truthport-text-auth `20260830` | POST `/detect` |
| WEATHER_FORECAST | weathertop-v3 `82920263` | GET `/weather-forecast` |
| CRYPTO_PRICE | optivis-crypto-price `7311` | GET `/price` |
| FRAUD_DETECTION | sarzops-transaction-risk `91001` | POST `/fraud` |
| NEWS_SEARCH | verity-news-search `9004` | GET `/news` |

**Ops:** Vercel Production has `PRIVATE_KEY` / `EVM_PRIVATE_KEY` + Supabase URL/keys (set 2026-09-03). Deploy `aa5a28d` live — prior open prod `POST /intel` AI_TEXT **200**; **now requires signed-in cookie** (unsigned → 401). Apply both migrations in Supabase SQL editor if not yet applied: `20260903160000_create_query_log.sql` + `20260903190000_per_user_tenant_rls.sql`. Do not commit keys.

Port `8080` is **not** a generic Engine — it is a chatbot miner (`/v1/chat/completions`). Consumption uses miner-dispatcher `:7044`.

**Residual risk (sessions):** XSS can still abuse a logged-in browser session; shared server wallet key remains a server-side risk; in-memory rate limits reset per instance. Not unhackable.

## Verified (portal)

Hackathon My Submissions: miner **387** + WASM **2256** VERIFIED (2026-08-31).

## Blocker

None for product code path. Remaining: apply RLS migration on hosted Supabase; post Track 3 X; portal form by Sep 7; drive ≥100 AI_TEXT via **signed-in** `/intel` (public `/demand-app` no longer hits paid rail). Keep miner up through Sep 7.

## Leaderboard history

- **2026-09-03** epoch 305: CALIBER AI_TEXT **#1** (see dump `track3-integrations-2026-09-03.json`)
- **2026-08-31** epoch 297: CALIBER AI_TEXT **#2** behind livecert (`rank-now-2026-08-31.json`)
