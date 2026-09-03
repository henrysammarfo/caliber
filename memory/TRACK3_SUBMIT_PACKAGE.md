# CALIBER — Track 3 Submit Package

> Prepared **2026-09-03**. App track: Applications. Deadline **Sep 7, 2026 23:59 UTC**.

## Identity

| Field | Value |
|---|---|
| Product | CALIBER Demand App — Multi-Intent Intelligence Console |
| Builder | Henry Sam Marfo |
| X | `@henrysammarfo_2` (tag `@Telegraphprotoc`) |
| Wallet / fee | `0x9ADd0ac311e9E528800afc3F4A04e9cDe52C9cE0` |
| Repo | https://github.com/henrysammarfo/caliber |
| Live app | https://caliber-smoky.vercel.app |
| Public checker | https://caliber-smoky.vercel.app/demand-app |
| Console | https://caliber-smoky.vercel.app/dashboard/intel |
| Demand analytics | https://caliber-smoky.vercel.app/dashboard/demand |

## What it is

A production Track 3 app whose **paid multi-intent path** only works by paying live Telegraph miners via x402. No mocked miner responses on that path.

| Surface | Behavior |
|---|---|
| **Public AI Text Checker** (`/demand-app`) | Free **local** `POST /detect` (TRUTHPORT in-process). Honest “local TRUTHPORT” label. CTA to sign in for paid multi-intent. |
| **Multi-intent console** (`/dashboard/intel`) | Cookie session required → `POST /intel` → x402 dispatcher (weather, crypto, fraud, news, AI text). |
| **Demand analytics** (`/dashboard/demand`) | Own-row `query_log` only (per-user tenant). |

**Auth:** Production uses `@supabase/ssr` cookie sessions (no durable localStorage JWT on smoky/teamtitanlink). Paid `/intel` rejects unsigned requests with **401**; per-user rate limit **429**.

## Must-use miners (real dispatcher)

| Intent | Miner | Dispatcher |
|---|---|---|
| AI_TEXT_DETECTION | **caliber-truthport-text-auth** (`20260830`) | POST `/v1/20260830/detect` |
| WEATHER_FORECAST | weathertop-v3 (`82920263`) | GET `/weather-forecast` |
| CRYPTO_PRICE | optivis-crypto-price (`7311`) | GET `/price` |
| FRAUD_DETECTION | sarzops-transaction-risk (`91001`) | POST `/fraud` |
| NEWS_SEARCH | verity-news-search (`9004`) | GET `/news` |

Proxy: `POST /intel` `{ "intent", "query" }` with **cookie session** → miner-dispatcher `http://13.237.89.59:7044` with `@x402/fetch`. Same-origin only (no `Access-Control-Allow-Origin: *`).

## Evidence artifacts

| Artifact | Path / URL |
|---|---|
| Paid 5-intent smoke | `memory/artifacts/track3-intel-smoke.json` |
| Catalog dump | `memory/research-raw/track3-integrations-2026-09-03.json` |
| AI_TEXT rank poll | `memory/research-raw/leaderboard-2026-09-03/ai-text-rank-now.json` |
| Prior TRUTHPORT x402 receipt | `memory/artifacts/x402-receipt-truthport.json` |
| Miner (Track 1) | Console reg **387** VERIFIED |
| WASM (Track 2) | Console reg **2256** VERIFIED |

## Judging alignment

- Uses **real** Telegraph miners (rules: no mocks)
- Drives demand to TRUTHPORT (helps ≥100 Track 3 request guardrail for AI_TEXT)
- X thread drafts: `memory/TRACK3_X_DRAFTS.md`
- Honest UI — no fake telemetry; residual detector error documented

## Portal form fields (fill when submitting)

Copy/paste ready:

```
App name: CALIBER Demand App
Description: Multi-intent intelligence console that pays Telegraph miners via x402 (cookie-authed). Public /demand-app uses free local TRUTHPORT /detect; signed-in /dashboard/intel drives paid dispatcher demand for AI text, weather, crypto, fraud, and news.
Live URL: https://caliber-smoky.vercel.app
GitHub: https://github.com/henrysammarfo/caliber
X handle: @henrysammarfo_2
Related miner: caliber-truthport-text-auth (registrationId 387)
```

Note: miner YAML `base_url` on-chain remains `caliber-teamtitanlink.vercel.app` (same deployment). **Public / Track 3 share link = smoky.**
## Ops checklist (production)

- [x] Code on `main` (`aa5a28d`) — GitHub Production deploy **success** 2026-09-03
- [x] `PRIVATE_KEY` + `EVM_PRIVATE_KEY` on Vercel Production/Preview
- [x] `SUPABASE_URL` + publishable keys on Vercel Production/Preview
- [x] Prod smoke (pre-auth gate): `POST /intel` AI_TEXT → **HTTP 200** (TRUTHPORT) on both hosts
- [x] Public checker UI live at `/demand-app` (now **local** `/detect`)
- [x] Cookie sessions + `/intel` auth gate + per-user rate limit shipped in repo
- [x] `query_log` migration applied on Supabase (table reachable 2026-09-03; Lovable/git sync)
- [ ] Apply `20260903190000_per_user_tenant_rls.sql` on hosted Supabase
- [ ] Re-smoke signed-in `/intel` → 200; signed-out → 401; `/detect` → 200
- [ ] Track 3 X thread posted (`memory/TRACK3_X_DRAFTS.md`) — update copy: public = local; paid = signed-in console
- [ ] Portal Track 3 form submitted before Sep 7 23:59 UTC

### Apply SQL (one-time)

Supabase dashboard → SQL editor → run:

1. `supabase/migrations/20260903160000_create_query_log.sql` (if not already)
2. `supabase/migrations/20260903190000_per_user_tenant_rls.sql` (own-row RLS; service_role-only full access)

Or set `SUPABASE_ACCESS_TOKEN` and run: `node protocol/scripts/apply-query-log.mjs` (query_log create only).

## Residual risk

x402 facilitator trust, miner upstream availability, detector false positives/negatives, XSS vs logged-in cookie session, shared server wallet key, in-memory rate-limit reset per instance. **Not unhackable.**
