# CALIBER â€” CURRENT STATE (LOCK-IN)

> Updated **2026-08-30 late evening** — console Diamond registerMiner **387** landed; dispatcher lists caliber-truthport-text-auth (active, unscored).

## Doctrine

- Die-hard dual track: TRUTHPORT (Miner) + GRADELOCK (Script)
- Intent focus: **AI_TEXT_DETECTION**
- Quality flywheel evidence > demo theater
- Never claim unhackable; residual risk documented
- Frontend (`src/lib/miner`) is live miner source of truth; `protocol/truthport` keeps v1 CI smoke

## Competitors (Live Leaderboard / dispatcher)

| Peer | Notes |
|---|---|
| **veritarach-ai-text-detector** | AI_TEXT rank **#2** â€” DeBERTa â€” primary rival |
| bittensor-sn32-itsai | AI_TEXT rank ~3 |
| livecert | Multi-intent; #1 IP_GEO in dump; AI_TEXT often unscored |

## Product (LOCK-IN snapshot)

| Layer | Status |
|---|---|
| Truthport **v2** detector | Live â€” `label` / `reason` / `verdict` + `/predict` + `/detect` + `/ai-detect` |
| YAML scoring contract | Multi-endpoint v2; sha256 `5d9c3d2dâ€¦`; byte-identical LF at `/miner.yaml` + `/protocol/caliber-truthport.yaml` + `protocol/yaml/` |
| Deploy | `https://caliber-teamtitanlink.vercel.app` (`dpl_ETuGisRLzQXQbzTKrnY3Y7zxFisf`) |
| Pinata YAML | CID `QmVTkdLFe6sxJpXqBkPeHzBGwy392q9ezDRP7WgEobxYS6` |
| On-chain register | **Console reg 387** (docs Diamond still has reg 55) — console Diamond `0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8`; fee `0x9ADd0ac311e9E528800afc3F4A04e9cDe52C9cE0`; minPrice 10000; intents `AI_TEXT_DETECTION` |
| x402 rail | **Miner-specific paid /detect verified** — receipt `memory/artifacts/x402-receipt-truthport.json`; tx 0x6d7db1bd…; free path none (402) |
| GRADELOCK WASM | Hosted + Pinata CID QmWVPg; keccak 0x8d295d46; registerWasm id 2126 on console Diamond 0x5a2324 (tx 0x43d0c770); docs Diamond 0x122396 has no registerWasm facet |
| Integrations listing | **LISTED** 2026-08-30T21:56Z — dispatcher count 126; slug `caliber-truthport-text-auth` id 20260830; activation_status active; scored false; Pinata QmVTkd |
| X | After ship |

## Blocker

Listed + paid detect green. Still **scored:false** on AI_TEXT_DETECTION — wait for Stage scoring epochs / Discord if stuck after 10m poll.

