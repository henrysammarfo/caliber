# Holdout provenance

## Primary (production)

**RAID** (MIT / AI-generated text detection benchmark) is the intended **primary real holdout** for CALIBER TRUTHPORT calibration and GRADELOCK evaluation.

This repository does **not** currently vendor RAID rows. Do **not** claim RAID sample counts, agreement scores, or row contents until an explicit licensed import is checked in with its own provenance note.

## This fixture (`holdout.fixture.json`)

| Field | Value |
|---|---|
| Purpose | CI-only regression + smoke (deterministic detector / adversarial gates) |
| Source tag | `synthetic-ci` |
| Labels | `1` = AI-like synthetic · `0` = human-like synthetic |
| Partitions | `holdout` (eval) · `train_cal` (optional weight sanity; not leaked into WASM) |
| License | Generated for CALIBER CI; not a substitute for RAID |

Texts are hand-authored / template-expanded to exercise surface features (lists, hedges, contractions, burstiness). They are **not** claimed to represent real web distribution or RAID difficulty.

## Honesty rules

- Never display this fixture’s size as “production dataset size.”
- Never invent RAID metrics in UI.
- When RAID (or another licensed set) is imported, add a dated section here with URL, license, hash, and row count.
