# CALIBER — CURRENT STATE (LOCK-IN)

> Updated **2026-08-31** — GRADELOCK import-free WASM re-registered as **2256** (reg 2126 rejected: `module[env] not instantiated`).

## Doctrine

- Die-hard dual track: TRUTHPORT (Miner) + GRADELOCK (Script)
- Intent focus: **AI_TEXT_DETECTION**
- Quality flywheel evidence > demo theater
- Never claim unhackable; residual risk documented
- Frontend (`src/lib/miner`) is live miner source of truth; `protocol/truthport` keeps v1 CI smoke

## Competitors (Live Leaderboard / dispatcher)

| Peer | Notes |
|---|---|
| **veritarach-ai-text-detector** | AI_TEXT rank **#2** — DeBERTa — primary rival |
| bittensor-sn32-itsai | AI_TEXT rank ~3 |
| livecert | Multi-intent; #1 IP_GEO in dump; AI_TEXT often unscored |

## Product (LOCK-IN snapshot)

| Layer | Status |
|---|---|
| Truthport **v2** detector | Live — `label` / `reason` / `verdict` + `/predict` + `/detect` + `/ai-detect` |
| YAML scoring contract | Multi-endpoint v2; sha256 `5d9c3d2d…`; byte-identical LF at `/miner.yaml` + `/protocol/caliber-truthport.yaml` + `protocol/yaml/` |
| Deploy | `https://caliber-teamtitanlink.vercel.app` |
| Pinata YAML | CID `QmVTkdLFe6sxJpXqBkPeHzBGwy392q9ezDRP7WgEobxYS6` |
| On-chain register | **Console reg 387** — console Diamond `0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8`; fee `0x9ADd0ac311e9E528800afc3F4A04e9cDe52C9cE0`; minPrice 10000; intents `AI_TEXT_DETECTION` |
| x402 rail | **Miner-specific paid /detect verified** — receipt `memory/artifacts/x402-receipt-truthport.json`; tx 0x6d7db1bd…; free path none (402) |
| GRADELOCK WASM | **Import-free** (custom `abort`; zero `env` imports). Pinata CID `QmWxjGD…BDff`; keccak `0x3a034942…`; registerWasm id **2256** on console Diamond (tx 0xc33226e6…); supersedes rejected **2126** |
| Integrations listing | **LISTED** — slug `caliber-truthport-text-auth` id 20260830; activation_status active; scored false |
| X | After ship |

## Blocker

Listed + paid detect green. WASM structural reject on 2126 fixed via import-free rebuild + reg **2256**. Still **scored:false** on AI_TEXT_DETECTION — wait for Stage scoring / Discord if stuck.
