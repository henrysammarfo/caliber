# GRADELOCK WASM ABI (PARTIAL)

> **Status: PARTIAL / community-derived — not verified against official Telegraph GitBook.**

Official GitBook (as of 2026-08-29) documents miner YAML / registry / x402 but **does not publish a full Script Author WASM host API**. CALIBER targets the community checker [`neromtoobad/telegraph-wasm-check`](https://github.com/neromtoobad/telegraph-wasm-check) as a **provisional** ABI so we can build and locally validate. Re-verify against `integrate.telegraphprotocol.com` WASM wizard / Discord before mainnet registration.

## Required exports (community tool)

| Export | Signature | Notes |
|---|---|---|
| `alloc` | `(size: i32) -> i32` | Allocate linear memory; return pointer |
| `dealloc` | `(ptr: i32, size: i32)` | Free previously allocated region |
| `rank_answer` | `(q_ptr, q_len, gt_ptr, gt_len, ma_ptr, ma_len: i32) -> f32` | Score in `[0,1]` |
| `breakdown_answer` | `() -> i32` | Pointer to 5×`f32`: `[relevance, correctness, lexical, length_quality, composite]` |

Optional (both or neither): `embed`, `rank_answer_cached`.

## Host semantics (community README)

- No host imports; module must be self-contained.
- Inputs are UTF-8 bytes in linear memory for `question`, `ground_truth`, `miner_answer`.
- Empty / whitespace `miner_answer` → score exactly `0`.
- Deterministic across instances.
- WASM content hash for registry is **keccak256** (≠ miner YAML SHA-256).

## CALIBER scoring policy (this module)

- Parse `miner_answer` JSON for `confidence` ∈ `[0,1]`.
- Parse `ground_truth` JSON as `{ "label": 0 | 1 }` (1 = AI).
- `rank_answer` = `clamp01(1 - Brier(confidence, label))`.
- Missing/invalid confidence → `0`.
- `breakdown_answer` mirrors composite into all five slots for Stage-1 shape compliance (refine when official docs land).

## Residual risk

ABI drift vs the live Telegraph node, Stage-2 withheld thresholds, and host size limits can reject an otherwise correct module. Do **not** claim the grader is unhackable or immune to gaming — publish adversarial tests and residual risk instead.
