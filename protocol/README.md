# CALIBER protocol packages

Production-oriented TypeScript packages for Telegraph Season I:

| Package path | Role |
|---|---|
| `truthport/` | Miner — deterministic text authenticity detector + `node:http` server |
| `gradelock/` | Script — Brier ranking, adversarial suite, AssemblyScript WASM (PARTIAL ABI) |
| `shared/` | Brier, calibration bins, JSON helpers, shared types |
| `eval/` | Synthetic CI holdout (`synthetic-ci`); RAID is primary real holdout (not vendored here) |
| `yaml/` | Telegraph YAML Standard `version: "1"` miner descriptor |

No API keys are required for local detect / test / smoke.

## Architecture

```
Client / Telegraph node
        │  POST /detect  (+ bearer CALIBER_MINER_API_KEY in prod)
        ▼
  TRUTHPORT (features → fixed logit → sigmoid → confidence)
        │
        ▼
  GRADELOCK scores miners via mean Brier vs labeled holdout
        │
        ▼
  WASM rank_answer = clamp01(1 - Brier(confidence, label))  [PARTIAL community ABI]
```

**Detector honesty:** v1 uses fixed feature weights (length, TTR, punctuation, burstiness, function words, repetition, markdown/list density, hedges, contractions). Threshold `0.5` for `isAI`. Production calibration should re-fit on a labeled holdout (RAID primary). Do not treat CI fixture metrics as production accuracy.

**WASM ABI:** Official GitBook does not fully specify Script Author exports (2026-08-29). We target community [`telegraph-wasm-check`](https://github.com/neromtoobad/telegraph-wasm-check) as **PARTIAL**. See `gradelock/wasm-abi.md`. Re-verify before `registerWasm`.

## Run

```bash
cd protocol
npm install
npm test
npm run smoke
npm run miner          # http://127.0.0.1:8787  POST /detect  GET /health
npm run hash-yaml      # SHA-256 of yaml/caliber-truthport.yaml (registerMiner bytes32 input)
npm run adversarial
npm run build:wasm     # requires npx asc (assemblyscript); else source remains + this note
```

### Detect request / response

```json
{ "text": "..." }
```

or `{ "texts": ["...", "..."] }`

Per text:

```json
{
  "confidence": 0.0,
  "isAI": false,
  "explanation": "...",
  "model": "caliber-truthport-v1"
}
```

Max text length: 50_000 characters. Rate limiting is a **placeholder** (header comment in `truthport/server.ts`); enforce in production per YAML `rate_limit_per_sec`.

## GRADELOCK results shape

```ts
{
  honestMinerId: string,
  honestMeanBrier: number,
  attacks: [{
    name: "confidence_inflation" | "hedge_spam" | "label_echo" | "volume_irrelevant",
    minerId: string,
    meanBrier: number,
    honestMeanBrier: number,
    rankDrop: number,
    expectedWorseThanHonest: boolean,
    passed: boolean
  }],
  allPassed: boolean
}
```

`rankMiners` sorts by mean Brier **ascending** (lower better).

## Holdout provenance

See `eval/provenance.md`. RAID is the intended real holdout. `holdout.fixture.json` is **CI-only** synthetic data (`source: synthetic-ci`). Do not claim RAID rows without importing them.

## Security / residual risk

- No secrets in repo. Auth env var name only: `CALIBER_MINER_API_KEY`.
- Detector can be gamed (style transfer, paraphrase). Adversarial suite reduces naive inflation; it does **not** make the system unhackable.
- WASM host ABI may drift; Stage-2 thresholds are withheld by community checker docs.
- Facilitator / registry / key ops remain operational risks.
- Hardening + tests lower risk; they never eliminate it.

## YAML note

Subnet `id: 91001` is a **placeholder** high ID. Confirm unused before on-chain registration. `base_url` is a placeholder until public HTTPS is live.
