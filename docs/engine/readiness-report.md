# PromptMystic Engine — Stage 8 Readiness Report

**Date:** 2026-07-25
**Branch:** `feature/promptmystic-engine-contract`
**Engine build:** `1.0.0-alpha.5` (from baseline `0.9.0`)
**Canonical core checksum:** `4a6afa7a1c0b475f50abb16b687de75088926a56805f64a31b98731b34385861`

> **Superseded in part.** Everything below describes the pre-live state at `alpha.5`.
> The engine is now **`1.0.0` (stable)**, promoted 2026-07-31 on gate G1, which was
> satisfied by `1.0.0-alpha.15`. See the [G1 addendum](#g1-addendum-2026-07-31) at the end
> of this file for current status, deploy steps, and open quality work.

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

---

## G1 addendum (2026-07-31)

**Engine version:** `1.0.0` (stable) — promoted 2026-07-31 from `1.0.0-alpha.15`
**Canonical core checksum:** `ce87bf1994c0b33033ee9ceff120b60628140483f252b3fd86fd99a204b8acf5`
**Gate G1:** satisfied — two consecutive GREEN cycles on an identical core.

The promotion was a label change only. The core bytes are identical to `alpha.15` and the
checksum above is unchanged, so the two cycles below remain valid evidence for `1.0.0`.

| | Cycle 1 | Cycle 2 |
|---|---|---|
| Report | `live-1.0.0-alpha.15-2026-08-01T05-46-28-388Z.json` | `live-1.0.0-alpha.15-2026-08-01T06-33-39-275Z.json` |
| Hard vetoes | 0 | 0 |
| Soft flags (allowance 3) | 2/50 | 0/50 |
| Engine Quality Score | 99 | 100 |
| Delivery (expected-to-deliver) | 100% (47/47) | 100% (46/46) |
| Length delta vs 0.9.0 | −414 | −475 |
| Downstream (non-blocking) | 60% | 67% |

Six live cycles and eleven cheap checks were run between `alpha.5` and `alpha.15`. The
metrics the contract calls for are now real rather than PENDING_MANUAL, with one
exception: **Average User Rating remains N/A**, since it can only come from real users.

### Promotion to `1.0.0` — done 2026-07-31

Completed as a label-only change: `engine_version` set to `1.0.0` and `status` to
`stable` in `engine-version.json` with a final history entry, adapters regenerated via
`parity.mjs --write`, and version references updated here and in `ADAPTERS.md`. Parity
verified green afterwards on the same checksum, confirming no behavior change.

Still uncommitted at the time of writing; suggested message
`feat: promote engine to 1.0.0 (gate G1 satisfied on alpha.15)`.

### Skill deploy — deliberate manual steps

The deployed skill at `~/.claude/skills/promptmystic/SKILL.md` is still `0.9.0`; nothing
in this workstream has touched it.

1. Run `scripts/engine/migrate-history.mjs` first if you want the new local stores.
2. Copy `docs/engine/adapters/skill/SKILL.md` over the deploy target.
3. Verify the deployed copy's checksum against `engine-version.json`.
4. Smoke-test one prompt in Claude Code before relying on it.

The web adapter needs no deploy step: `src/features/promptmystic/engine/core-prompt.generated.ts`
is generated by the parity script and ships with the app.

### Backlog — narrowing and discovery goals

Both defects are now measured mechanically as non-gating observations
(`totals.observations` in every cycle report). Neither is fixed.

1. **Broad-goal narrowing.** A broad "help me start / sell / teach X" goal gets answered
   with a prompt that writes one piece of marketing copy. Confirmed on `hold-001`,
   `hold-006`, `dev-001`, `dev-007`, `dev-008`, and `dev-018`. Likely fix: an ENGINEER
   rule that a goal about building or running something yields a prompt covering the
   whole goal, with copywriting as one part rather than the whole deliverable.
2. **Interview-in-fence.** The engine writes a multi-question interview into the fenced
   prompt instead of asking the user. Confirmed on `hold-009`, `hold-015`, `dev-025`,
   `edge-007`. Note `hold-013` asks one question inside the prompt and passes downstream,
   so the target is the multi-question form, not all in-prompt questions.
3. **Clarification collapse — probable common cause.** Across 40 development and holdout
   cases only one clarifying question was asked in cycle 2. The alpha.14 turn contract
   plus alpha.15's delivery pressure left the engine nowhere to put missing information
   except inside the prompt. Any fix to 1 or 2 should consider restoring one genuinely
   high-value question on broad and discovery goals rather than adding more prohibition
   prose — two wording-only fixes failed on `edge-008` before the structural fix worked.
4. **Downstream measurement noise.** At n=15 the metric carries roughly ±14 points of
   run-to-run variance. Widening the holdout split or averaging two runs would make it
   usable as a gating signal; today it is reported only.
5. **Reference outputs.** Still only 2 of 50 cases ship one (carried over from above).
