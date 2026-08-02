# PromptMystic Engine (canonical)

This folder is the **single source of truth** for how the PromptMystic engine behaves.
The Claude Code skill and the web app both consume these assets so they cannot drift.

## Contents

| Path | What it is |
|------|-----------|
| `engine-contract.md` | The canonical, versioned behavior specification. |
| `system-prompt.core.md` | The canonical core prompt (shared body) between `CORE:BEGIN`/`CORE:END`. |
| `engine-version.json` | Current build version, core checksum, adapter registry, stage compliance. |
| `ADAPTERS.md` | The thin, documented per-surface wrapper differences + parity rule. |
| `adapters/skill/` | Skill adapter template + generated `SKILL.md`. |
| `schemas/` | Canonical JSON schemas (generation record, preference profile, pattern record, output envelope). |
| `patterns/pattern_library.global.json` | Founder-created SYNTHETIC global strategies + anti-patterns. |
| `benchmark/` | Starter benchmark (cases + rubric + recorded baselines). |
| `baseline/` | Frozen v0.9.0 pre-contract snapshots for recovery + regression. |

## How the surfaces consume the canonical core

```
docs/engine/system-prompt.core.md   (edit here only)
        │  node scripts/engine/parity.mjs --write
        ├────────────► src/features/promptmystic/engine/core-prompt.generated.ts  (web)
        └────────────► docs/engine/adapters/skill/SKILL.md                         (skill)
                                     │  documented manual copy
                                     └────► ~/.claude/skills/promptmystic/SKILL.md  (deployed skill)
```

- Web: `system-prompt.ts` imports the generated core and adds a thin web wrapper.
- Skill: `SKILL.md` is generated from `SKILL.template.md` + the core, then copied to the live skill dir as a deliberate step.

## Drift detection

```
node scripts/engine/parity.mjs        # verify (read-only, exits 1 on drift)
node scripts/engine/parity.mjs --write # regenerate adapters + record hash
```

Only the canonical core block is hashed; adapter wrappers may differ (see `ADAPTERS.md`).

## Versioning

- `0.9.0` — pre-contract baseline (frozen in `baseline/`).
- `1.0.0-alpha.N` — canonical core built up across stages (tone → REVIEW_COMPRESS → adaptive clarification → trust boundary → structured learning).
- `1.0.0` — promoted only after gate **G1** (two consecutive green benchmark cycles).

## Metrics (do not conflate — see contract section 11)

- **Average User Rating** (north star ≥ 8.5) — real users only.
- **Engine Quality Score** — internal benchmark rubric; never reported as the north star.
- **Downstream Success Rate** — % beating raw-request and simple-rewrite baselines.

## Surfaced conflicts (precedence: Patrick > PRD/KB > implementation > proposals)

- **A — Clarification:** locked adaptive 0-3/5 policy supersedes the old "up to 5". (Resolved in Stage 5.)
- **B — Compression:** no compression existed; REVIEW_COMPRESS added. (Stage 4.)
- **C — "Learning implemented" (PRD §7):** overstated — no retrieval step existed at baseline. Implementation is the truth. (Stage 7 adds real, local, curated learning.)
- **D — Skill/web drift:** the web prompt was a hand-copied, drifted duplicate. (Resolved by this canonical structure.)
- **E — History in V1:** PRD says store history; MVP-Scope says out of scope; code persists nothing. **Unresolved — deferred to web-port decision.**
- **F — Numeric rating:** old skill said "do not ask for a numeric rating" but the north star needs it. Reconciled with a gentle post-value rating (approved default A4).
- **G — Model scope:** "Claude and GPT-4o" is aspirational; only Claude is wired. Cross-provider stays a small periodic benchmark subset.

## Tooling note

The repo standardized on pnpm (`.cursorrules`) while the operator prefers npm. The
engine scripts are dependency-free Node ESM (`node scripts/engine/*.mjs`) and add no
packages, so this does not block engine work. Flag for later resolution.
