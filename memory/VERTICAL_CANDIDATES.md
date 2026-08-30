# CALIBER — VERTICAL CANDIDATES (pre-lock)

> Vertical is **not locked**. Must fit YAML canonical `signal_mapping.type` + `supported_intents`.  
> Kill homepage clones (BitMind media / Zeus weather) unless unique labeled data exists.

## Constraints (binding)

1. Real **labeled** eval set with provenance (license + source URLs in README).
2. Miner returns **probabilities** (0–1) so Brier/calibration grading is meaningful.
3. Prefer `on_chain.transform: direct` (deterministic) over `llm`.
4. Africa never primary GTM; US/global agent builders first.
5. No FENN / trading DNA.

## Shortlist (research-backed directions — pick one)

### A — AI text authenticity (RECOMMENDED default)

| | |
|---|---|
| Signal type | `text_authenticity` |
| Intents | `ai_text_detection`, `text_authenticity_check`, `content_verification` |
| Why win | Agents ingest web text constantly; Script track rewards anti-game ranking; public labeled corpora exist (document exact datasets after Tavily/TinyFish dump before lock) |
| Clone risk | Lower than BitMind deepfake homepage |
| Fatals | Weak open models; must own labeled holdout + methodology honesty |

### B — Fact check / claim verification

| | |
|---|---|
| Signal type | `search_relevance` or pair with research intents |
| Intents | `fact_check`, `research_synthesis`, `web_search` (as allowed) |
| Why win | Clear agent pain; FEVER-style labels |
| Fatals | Harder production API; hallucination risk if LLM-only without retrieval |

### C — Content moderation score

| | |
|---|---|
| Signal type | `task_completion` / use closest enum after docs re-read |
| Intents | `content_moderation` |
| Why win | Paid agent safety path |
| Fatals | Policy ambiguity; compliance claims must be careful |

### KILL / defer

| Idea | Why |
|---|---|
| Homepage deepfake miner | Bible forbid unless unique labels; BitMind is docs example |
| Weather-only wrap | Zeus is docs example; thin wrap |
| Generic chat completion | Crowded; weak ground truth |
| Sibyl TAKEN bridge | LOCKED kill for now |

## Lock checklist (before coding)

- [ ] Chosen signal type + intents written here as LOCKED
- [ ] Labeled dataset dump path under `memory/research-raw/vertical/<slug>/`
- [ ] License allows eval + commercial miner use (or restrict)
- [ ] Holdout partition defined for anti-game tests
- [ ] Upstream API design (input/output JSON) matches YAML endpoints
- [ ] Henry confirms
