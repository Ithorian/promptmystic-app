# PromptMystic Benchmark

Two clearly distinct stages. **The ~50-case starter set is NOT the final benchmark.**

## Starter benchmark (first 30 days) — ~50 cases

Used to freeze a baseline and protect against regressions while hardening the engine.

| Split | File | Approx count | Purpose |
|-------|------|--------------|---------|
| Development | `development.json` | ~25 | Iterate freely. |
| Holdout | `holdout.json` | ~15 | Never tuned against; used for go/no-go. |
| Edge / adversarial | `edge.json` | ~10 | Injection, boundary, and multi-turn clarification cases. |

Multi-turn clarification scenarios are included in `edge.json` (`type: "multi_turn"`).

## Expanded production-readiness benchmark — 75-100 total cases

Completed **before** serious web-engine migration or production rollout (gate G7).
It preserves all distinct categories:

- Development cases
- Holdout cases
- Edge and adversarial cases
- Multi-turn clarification cases
- **Cross-provider compatibility cases** (a small subset run against a second provider,
  e.g. GPT-4o, to catch portability breaks)

Grow the starter set toward 75-100 by adding realistic Phase-1 requests (senior /
low-tech / side-income). **All committed cases must be SYNTHETIC or carefully
generalized — never raw private user content** (privacy rule; see the Engine Contract).

## Running

```
node scripts/engine/run-benchmark.mjs                 # score all splits (automatable dims)
node scripts/engine/run-benchmark.mjs --split holdout # one split
```

The harness validates fixtures and computes the **automatable subset** of the Engine
Quality Score over any case that includes a `reference_output`. Dimensions requiring
judgment (and all Downstream Success Rate scoring) are reported as `PENDING_MANUAL`
until a founder or LLM-judge scores them. Live model runs are intentionally not made by
the harness (cost/keys); they are a manual step.

## Metrics reported

- **Engine Quality Score** (0-100) — internal, rubric-based. Never the north star.
- **Downstream Success Rate** (%) — separate, Layer 2.
- **Average User Rating** — real users only; not produced by this harness. When too few
  real ratings exist, say so; do not substitute benchmark scores.

Baselines are recorded in `baselines/` (e.g. `baseline-0.9.0.json`).
