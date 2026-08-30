---
name: caliber-build
description: >-
  Builds and maintains CALIBER for Telegraph Season I — TRUTHPORT miner, GRADELOCK
  WASM grader, x402/registry, honest UI, and H1→H3 demand path. Use when working in
  the caliber repo, Telegraph miner/YAML/WASM/x402 tasks, CALIBER bible/memory, or
  when Henry asks to ship production Telegraph submissions.
disable-model-invocation: false
---

# CALIBER build skill

## Read first

1. `memory/CURRENT_STATE.md`
2. `memory/FACT_CHECK.md`
3. `memory/WIN_RECOMMENDATIONS.md`
4. Scoutbot `docs/CALIBER_BIBLE.md` + `docs/memory/research-raw/hackathons/telegraph/LOCKED.md`
5. Live docs: https://telegraph-2.gitbook.io/telegraph/llms.txt and portal HTML for deadlines

## Research loop

1. Tavily search → dump JSON under `memory/research-raw/`
2. TinyFish with header `X-API-Key` (not Bearer for Search/Fetch):
   - Search: `GET https://api.search.tinyfish.ai?query=...`
   - Fetch: `POST https://api.fetch.tinyfish.ai/` body `{ "urls": [...] }`
   - Agent: `POST https://agent.tinyfish.ai/v1/automation/run`
3. Prefer **raw HTML** over Fetch markdown for portal countdown (Fetch has mis-shown 12:00 when HTML said 23:59)
4. Update FACT_CHECK same turn; never invent

## Architecture (binding)

| Module | Track | Job |
|---|---|---|
| TRUTHPORT | Miner | Vertical API + YAML v1 + Base registry + x402 |
| GRADELOCK | Script Author | WASM proper scoring + anti-game tests |
| DEMAND APP | H2/H3 | Product that only works by paying this miner |

Vertical must be locked via `memory/VERTICAL_CANDIDATES.md` before miner code.

## H1 production checklist

```
Task Progress:
- [ ] Vertical + labeled holdout locked (provenance)
- [ ] Miner API typed, validated, tested
- [ ] YAML schema-valid, hosted HTTPS/IPFS
- [ ] registerMiner + hash match documented
- [ ] x402 e2e receipt artifact
- [ ] GRADELOCK.wasm + adversarial CI
- [ ] Honest UI (no fake metrics)
- [ ] X thread + submit package
- [ ] Threat model / residual risk note (no unhackable claims)
```

## Architect output shape (when implementing a module)

1. **Architecture Analysis** — where it fits
2. **Filepath Declaration** — path, deps, consumers
3. **Code Implementation** — production-grade
4. **Testing Requirements** — unit + integration paths
5. **Architectural Impact** + security checklist

## Co-founder phases

Use DISCOVERY → PLANNING → BUILDING → POLISH → HANDOFF. Challenge cosplay metrics and scope creep. Prefer working slices with real artifacts over theater dashboards.

## Memory hygiene

Every material chat: update `CURRENT_STATE.md`, append `SESSION_LOG.md`, correct `FACT_CHECK.md`.
