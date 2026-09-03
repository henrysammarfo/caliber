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
| Live app | https://caliber-teamtitanlink.vercel.app |
| Public checker | https://caliber-teamtitanlink.vercel.app/demand-app |
| Console | https://caliber-teamtitanlink.vercel.app/dashboard/intel |
| Demand analytics | https://caliber-teamtitanlink.vercel.app/dashboard/demand |

## What it is

A production Track 3 app that **only works by paying live Telegraph miners via x402**. No mocked miner responses.

- **Public AI Text Checker** (`/demand-app`) — paste text → paid `AI_TEXT_DETECTION` → TRUTHPORT
- **Multi-intent console** (`/dashboard/intel`) — weather, crypto, fraud, news, AI text
- **Demand analytics** (`/dashboard/demand`) — real query_log counts / spend

## Must-use miners (real dispatcher)

| Intent | Miner | Dispatcher |
|---|---|---|
| AI_TEXT_DETECTION | **caliber-truthport-text-auth** (`20260830`) | POST `/v1/20260830/detect` |
| WEATHER_FORECAST | weathertop-v3 (`82920263`) | GET `/weather-forecast` |
| CRYPTO_PRICE | optivis-crypto-price (`7311`) | GET `/price` |
| FRAUD_DETECTION | sarzops-transaction-risk (`91001`) | POST `/fraud` |
| NEWS_SEARCH | verity-news-search (`9004`) | GET `/news` |

Proxy: `POST /intel` `{ "intent", "query" }` → miner-dispatcher `http://13.237.89.59:7044` with `@x402/fetch`.

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
Description: Multi-intent intelligence console that pays Telegraph miners via x402 for AI text detection, weather, crypto, fraud, and news. Public AI-text checker + authenticated console + demand analytics.
Live URL: https://caliber-teamtitanlink.vercel.app/demand-app
GitHub: https://github.com/henrysammarfo/caliber
X handle: @henrysammarfo_2
Related miner: caliber-truthport-text-auth (registrationId 387)
```

## Ops checklist (production)

- [x] Code on `main` (`aa5a28d`) — GitHub Production deploy **success** 2026-09-03
- [x] `PRIVATE_KEY` + `EVM_PRIVATE_KEY` on Vercel Production/Preview
- [x] `SUPABASE_URL` + publishable keys on Vercel Production/Preview
- [x] Prod smoke: `POST /intel` AI_TEXT → **HTTP 200** (TRUTHPORT) on both `caliber-teamtitanlink` and `caliber-smoky`
- [x] Public checker UI live at `/demand-app`
- [x] `query_log` migration applied on Supabase (table reachable 2026-09-03; Lovable/git sync)
- [ ] Track 3 X thread posted (`memory/TRACK3_X_DRAFTS.md`)
- [ ] Portal Track 3 form submitted before Sep 7 23:59 UTC

### Apply query_log (one-time)

Supabase dashboard → SQL editor → run `supabase/migrations/20260903160000_create_query_log.sql`

Or set `SUPABASE_ACCESS_TOKEN` and run: `node protocol/scripts/apply-query-log.mjs`

## Residual risk

x402 facilitator trust, miner upstream availability, detector false positives/negatives. Not unhackable.
