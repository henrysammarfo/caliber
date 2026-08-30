# Keys / accounts ? get these when asked (real-world steps)

> Agent will pause before implementing anything that needs these. Do **not** paste secrets into chat; put them in local `.env` (gitignored) or a password manager.

## Already in use (research)

| Env | Steps if rotating |
|---|---|
| `TAVILY_API_KEY` | 1. Open https://app.tavily.com/ · 2. API Keys · 3. Create/rotate · 4. Save to `.env` as `TAVILY_API_KEY=` |
| `TINYFISH_API_KEY` | 1. Open https://agent.tinyfish.ai/api-keys · 2. Create key (`sk-tinyfish-?`) · 3. Save as `TINYFISH_API_KEY=` · Header must be `X-API-Key` |

**Rotate** if these were ever pasted in chat.

---

## GATE A ? Public HTTPS for miner + YAML ? **COMPLETE (2026-08-30)**

| Item | Value |
|---|---|
| Primary | https://caliber-teamtitanlink.vercel.app |
| Alias | https://caliber-smoky.vercel.app |
| YAML | https://caliber-teamtitanlink.vercel.app/protocol/caliber-truthport.yaml |
| Detect | https://caliber-teamtitanlink.vercel.app/detect |
| projectId | `prj_PmiIcdoclM1fipuWCNjWIIjaYzT5` |
| deployment | `dpl_2wjBjsULCYaJndJEozzVSZUX5BYL` |
| sha256 | `44117168d49965769e3064919f8d816f2c40d0e965450ad596e4f9fa85756212` |

No further action on Gate A unless URL or YAML bytes change (then re-hash).

---

## GATE B ? Base Sepolia wallet (registerMiner) ? **COMPLETE (2026-08-30)**

| Item | Value |
|---|---|
| feeAddress (public) | `0x9ADd0ac311e9E528800afc3F4A04e9cDe52C9cE0` |
| registrationId | 44 |
| txHash | `0xb45f13bf81e4b779fc8667389283768faade0bbd46601fd2197b769e24351f2b` |
| Explorer | https://sepolia.basescan.org/tx/0xb45f13bf81e4b779fc8667389283768faade0bbd46601fd2197b769e24351f2b |
| Diamond | `0x122396E8602BEed349434AA6E83123E7dD97F5A0` |
| Network | Base Sepolia |

**Wallet note:** Gate B used a local `.env` `PRIVATE_KEY` (covered by `.gitignore` `.env*`). **WARN:** that key was chat-pasted this turn ? treat as compromised for anything beyond hackathon testnet; **rotate after hackathon**; never commit `.env`; never paste keys into chat/memory/docs again.

### Still needed after Gate C

1. **Free YAML subnet `id`** ? `91001` is taken by `sarzops-transaction-risk` on live dispatcher. Change id ? re-hash ? re-register / portal reload.
2. Confirm integrate console / node hot-loads `caliber-truthport-text-auth`.
3. Re-run miner-specific paid detect for a CALIBER `/detect` receipt (rail already proven via `/v1/x402-test`).

---
## NEXT GATE ? Miner API bearer (production)

| Env | Steps |
|---|---|
| `CALIBER_MINER_API_KEY` | Generate a long random secret (`openssl rand -hex 32`). Put in miner host env. Never commit. YAML only stores the **name** `CALIBER_MINER_API_KEY`. |

---

## Optional later ? stronger detector

| Env | Steps |
|---|---|
| `OPENAI_API_KEY` | platform.openai.com ? API keys ? create ? `.env` |
| Venice / Google | Only if we choose that upstream ? agent will give exact console URLs then |

Not required for current feature-ensemble v1.

---

## Portal / Discord (no API key)

1. https://hackathon.telegraphprotocol.com/ ? Register  
2. https://integrate.telegraphprotocol.com/ ? Connect API / Submit WASM when ready  
3. Join early Discord if offered  

Tell agent when registration is done.

---

## 2026-08-30 — Dispatcher listing still blocked (reg 50)

After Gate A (`/miner.yaml` + `/protocol/caliber-truthport.yaml`, Content-Type `application/yaml`, sha256 `c9f96c3b…0bd2a7`) and Gate B re-register (**registrationId 50**, yamlUrl=`…/miner.yaml`), CALIBER was **still not** in `GET /integrations` after an **8-minute** 60s poll (count stayed **125**). Miner-specific x402 receipt **not** created.

**Henry should:**
1. **(a)** Push the repo so we can host YAML on `raw.githubusercontent.com` like many activated peers and re-register, **or**
2. **(b)** Ask Telegraph Discord / integrate console why **registrationId 50** with yamlUrl `https://caliber-teamtitanlink.vercel.app/miner.yaml` is rejected or not ingested (no public reject/pending API).

Do **not** claim dispatcher activation until `/integrations` shows `92001` or slug `caliber-truthport-text-auth`.
