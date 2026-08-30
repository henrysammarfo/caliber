# CALIBER — CURRENT STATE (LOCK-IN)

> Updated **2026-08-30 evening LOCK-IN**. Henry doctrine: **ignore deadline as kill**; dual Miner+Script **first place**; rewrite simple stubs (Truthport v2 in `src`); X posts **after** product is locked. Never print `PRIVATE_KEY`.

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
| Deploy | `https://caliber-teamtitanlink.vercel.app` (`dpl_ETuGisRLzQXQbzTKrnY3Y7zxFisf`) |
| Pinata YAML | CID `QmVTkdLFe6sxJpXqBkPeHzBGwy392q9ezDRP7WgEobxYS6` |
| On-chain register | **Reg 55** (dereg 53) — Base Sepolia Diamond; fee `0x9ADd…9cE0`; minPrice 10000; intents `AI_TEXT_DETECTION` |
| x402 rail | Proven (generic); miner-specific paid path gated on `/integrations` |
| GRADELOCK WASM | Hosted `/gradelock.wasm`; Pinata CID `QmWVPgXS5FNWUP48JBb2P6prGn8w4qe5zvF9GcNHiWBsWX`; `registerWasm` wallet tx still needed |
| Integrations listing | Polling dispatcher — **do not claim listed until hit** |
| X | After ship |

## Blocker

Off-chain activation into dispatcher `/integrations` historically silent-fails. Reg 55 + Pinata retry in flight. Discord if still absent after poll.
