# PromptMystic Engine — Stage 8 Readiness Report

**Date:** 2026-07-25
**Branch:** `feature/promptmystic-engine-contract`
**Engine build:** `1.0.0-alpha.5` (from baseline `0.9.0`)
**Canonical core checksum:** `4a6afa7a1c0b475f50abb16b687de75088926a56805f64a31b98731b34385861`

## What was implemented (Stages 1-7)

| Stage | Outcome | Version |
|-------|---------|---------|
| 1 | Baseline preserved (in-repo `baseline/` snapshots), privacy verified, branch created | 0.9.0 |
| 2 | Canonical Engine Contract, core prompt, schemas, adapters, drift detection | 1.0.0-alpha.1 |
| 3 | ~50-case starter benchmark + frozen baseline recorded | — |
| 4 | REVIEW_COMPRESS elevated (blocking checklist, leave-unchanged rule, expansion guard) | 1.0.0-alpha.2 |
| 5 | Adaptive clarification (0-3/5, high-value test, escape hatch, disclose, contradiction) | 1.0.0-alpha.3 |
| 6 | Trust hierarchy + untrusted-data boundary made canonical | 1.0.0-alpha.4 |
| 7 | Lightweight local structured learning (retrieval, retention, promotion, migration) | 1.0.0-alpha.5 |

## Metrics — reported as three DISTINCT measures (Contract section 11)

### Engine Quality Score (internal benchmark)
- **Automatable subset:** mean **100/100**, **0 critical-failure vetoes** — unchanged
  from the `0.9.0` frozen baseline (no regression) across all four post-change cycles
  (alpha.2 → alpha.5).
- **Caveat (honest):** only 2 of 50 cases currently ship a `reference_output`, so the
  automatable comparison is thin. The full 10-dimension Engine Quality Score and the
  judgment dimensions (clarity, completeness, scannability, tone, assumptions,
  clarification fit) are **PENDING_MANUAL** — they require a founder or LLM-judge pass,
  and for the generative cases a live model run. This harness deliberately does not call
  a model (cost/keys).

### Downstream Success Rate (Layer 2)
- **PENDING_MANUAL.** Requires running generated prompts through the target model and
  scoring against the raw-request and simple-rewrite baselines. Not yet performed.

### Average User Rating (north star, real users only)
- **N/A — insufficient real-user ratings.** The web app does not yet capture ratings,
  and the private skill history has only a handful of rated records. Per the contract we
  **state this explicitly and do NOT substitute a benchmark score** for the ≥ 8.5 north
  star.

## Prompt-length and question-count changes
- **PENDING live-run measurement.** Length deltas from REVIEW_COMPRESS and question
  deltas from adaptive clarification can only be measured by running the engine on the
  benchmark inputs (a live-model step). The instrumentation (length bands per case,
  `questions_asked` in the record schema, `prompt_char_count`) is in place; the numbers
  await the first live cycle.

## Critical failures
- **None** in the automatable harness (0 vetoes). Injection behavior (edge-001..006) is
  encoded in the benchmark but its live verification is part of the pending manual cycle.

## Parity / drift
- **Green.** `scripts/engine/parity.mjs` confirms the web adapter, the skill adapter,
  and `engine-version.json` all match the canonical core checksum above. Adapter
  differences are documented and minimal (`ADAPTERS.md`).

## Remaining blockers / decisions for Patrick
1. **Live benchmark cycle not yet run** (needs ANTHROPIC_API_KEY + intentional spend).
   This is required to produce real Engine Quality Score, Downstream Success Rate,
   length, and question-count numbers, and to satisfy gate G1 (two green cycles). I did
   not spend API budget autonomously.
2. **Deploy to live skill:** `~/.claude/skills/promptmystic/SKILL.md` is still `0.9.0`.
   Copying the generated `docs/engine/adapters/skill/SKILL.md` to it is a deliberate
   manual step (left for approval). Run `migrate-history.mjs` first if you want the new
   local stores.
3. **Conflict E (history in V1)** remains unresolved: PRD says store history; MVP-Scope
   says out of scope; code persists nothing. A product decision for the web-port phase.
4. **Reference outputs:** add `reference_output` to more benchmark cases to widen the
   automatable safety net (cheap, high value).

## Recommendation
The Engine Contract and canonical core are **structurally complete and internally
consistent (alpha.5), with parity green and no automatable regressions** — ready to
enter the **first of the two required live benchmark cycles (gate G1)**. Do **not**
begin serious web-engine migration or claim the north star until: (a) two consecutive
green live cycles, (b) real Downstream Success Rate ≥ baseline, and (c) the expanded
75-100 case benchmark (G7) is built. Out of scope for this phase and correctly not
started: databases, embeddings, fine-tuning, automated global learning, and major web
UI changes.
