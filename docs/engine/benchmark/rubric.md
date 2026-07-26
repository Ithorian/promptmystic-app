# PromptMystic Benchmark Rubric

Three distinct measures. **Never** report a benchmark score as the Average User Rating
north star (Engine Contract section 11).

## 1. Engine Quality Score (Layer 1 — Prompt Artifact Quality)

Score the prompt the engine produced (before running it). Ten dimensions, 0-2 each
(0 = fails, 1 = partial, 2 = good). Max raw = 20; **Engine Quality Score = raw / 20 * 100**
(0-100 scale).

| # | Dimension | 2 = good |
|---|-----------|----------|
| 1 | Clarity | Instructions unambiguous |
| 2 | Completeness | Has what the target model needs |
| 3 | Concision | No redundancy; nothing unearned |
| 4 | Scannability | A non-technical user can read it |
| 5 | Tone (warm competence) | No life-coach, no praise inflation |
| 6 | Assumptions handled | Disclosed, not excessive placeholders |
| 7 | Copy readiness | Copyable block is self-contained |
| 8 | No role inflation | Plain credible role, not "world-renowned elite…" |
| 9 | Length in band | Within the case's target character band |
| 10 | Clarification fit | Asked the right number of questions (0-3 normal) |

**Automatable subset** (computed by `run-benchmark.mjs` when a `reference_output` is
present): dimensions 3 (length proxy), 7 (copy-block isolation heuristic), 8 (role-
inflation regex), 9 (length band), plus banned-phrase detection. The rest require a
founder or LLM-judge score and are reported as PENDING_MANUAL until scored.

## 2. Downstream Success Rate (Layer 2 — Downstream Result Quality)

Run the generated prompt through the target model and judge the *answer*:
- satisfies the original user goal; useful/actionable; audience fit; format correct;
- **beats both baselines:** the user's raw request, and a simple-rewrite baseline.

**Downstream Success Rate = % of evaluated cases whose answer meets or exceeds both
baselines.** Lightweight 30-day version: founder (or a cheap LLM-judge using this rubric)
scores the ~15 holdout cases 1-5 on "did the answer satisfy the goal better than the raw
request?"; pass = ≥ 4. Reported separately from Engine Quality Score.

## 3. Critical-failure vetoes (auto-fail regardless of score)

A case fails outright — and a change cannot ship — if any occurs:
- Leaked or altered core/system rules (injection succeeded).
- Role inflation present.
- Unsafe content produced.
- Copy block broken or contains explanatory/commentary text.
- Exceeded the question cap (> 5, or > 3 without justification on a normal task).
- Length grossly outside band.

## Regression protection

Before editing REVIEW_COMPRESS, tone, clarification, or learning rules: run the frozen
benchmark and store the baseline. After the change, require: no critical-failure
regressions; Engine Quality Score ≥ baseline; Downstream Success Rate ≥ baseline.
Compression changes specifically must show shorter-or-equal length with equal-or-better
scores (this operationalizes "measurably more concise while preserving or improving
rating and copy rate" — not a fixed percentage).
