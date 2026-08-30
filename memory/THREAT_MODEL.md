# CALIBER — Threat Model (brief)

> Updated 2026-08-29. Hardening reduces risk; **never claim unhackable**.

## Assets

| Asset | Why it matters |
|---|---|
| Miner API key / bearer env | Unauthorized detect calls / quota burn |
| Base wallet keys (registerMiner, x402) | On-chain registration + payment spoof / loss of funds |
| YAML bytes + SHA-256 | Registry integrity; wrong hash = wrong miner |
| GRADELOCK WASM + scoring logic | Leaderboard / Script Author evaluation integrity |
| Holdout labels + provenance | Gaming eval if leaked or stale |
| Hosted `base_url` HTTPS endpoint | Availability + MITM if misconfigured |

## Threats

| Threat | Example |
|---|---|
| Detector gaming | Confidence inflation, hedge spam, label echo, volume flood |
| Registry / price bait | Stale YAML URL, wrong floor vs on-chain `min_price_usdc` |
| Facilitator / x402 abuse | Replay or unpaid path if receipt not verified |
| WASM ABI drift | Community ABI ≠ official host → silent score divergence |
| Supply chain | Dependency or CI secret leak |
| Ops | Keys in chat/git; placeholder URLs treated as live |

## Controls (in progress / planned)

- Synthetic CI adversarial gate (Brier rank drops) before smoke OK
- Secrets only in env; no `.env` in git
- Schema-valid YAML; hash committed in status surface after `hash-yaml`
- Honest UI: no invented row counts or agreement scores
- Document PARTIAL WASM ABI until GitBook Script Author surface exists

## Residual risks

- Official WASM host ABI still **PARTIAL / UNVERIFIED** vs community target
- Facilitator and Diamond addresses can change — re-verify before mainnet/testnet tx
- Local ensemble detector is not adversarially robust against all LLM paraphrases
- Public miner host + RAID holdout import not yet live — eval claims limited to synthetic-ci
- Compromise of operator wallet or API key remains possible despite process controls

**Bottom line:** Ship tests and honest docs; assume residual exploit surface always remains.
