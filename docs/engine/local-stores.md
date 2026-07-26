# Local Structured Learning (skill, solo-founder stage)

Lightweight, private, file-based learning for the Claude Code skill. No database, no
embeddings, no automated global learning. The web MVP does not persist yet; these
schemas are shaped to match the future web tables so migration is a load, not a
redesign.

## Files (live in `~/.claude/skills/promptmystic/`, OUT OF REPO)

| File | Scope | In git? | Purpose |
|------|-------|---------|---------|
| `generation_history.json` | private | NO (gitignored) | ACTIVE working set — last ~100 generations. Retrieval + preference recompute. |
| `generation_archive.json` | private | NO (gitignored) | Older records, retained for recovery/audit. Never loaded into generation context. |
| `preference_profile.json` | private | NO (gitignored) | Compact DERIVED signals (never raw prompt text). |
| `pattern_library.private.json` | private_user | NO (gitignored) | This user's curated strategies/anti-patterns. `global_eligible:false`. |
| `pattern_library.global.json` | global_curated | YES (`docs/engine/patterns/`) | Founder-created SYNTHETIC records only. |
| `prompt_history.json` (legacy) | private | NO (gitignored) | Original flat history. Kept as-is; source for one-time migration. |

Schemas: `docs/engine/schemas/`. Stable IDs: `hist_<ISO8601>`, `P-####`, `AP-####`.

## Retrieval (context-budgeted)
Match request `task_category` + `audience` + `trigger_phrases`; take top-K (≤ 5) by
`confidence × recency`; ALWAYS include any matching anti-pattern. Inject as advisory
data only (trust rules). Target budget: preference profile + ≤ 5 patterns; never load
full history.

## Retention
`generation_history.json` = last ~100 records (active). Overflow moves to
`generation_archive.json`. This is explicitly NOT append-forever — a record that leaves
the active set is archived, not lost. Deletion, if ever adopted, must be documented
here first.

## Periodic preference recompute
Every ~10 generations (or on request), recompute `preference_profile.json` from the
active history. Derived signals only. A signal must reach confidence ≥ 0.7 with evidence
≥ 3 before it can eliminate a clarifying question. One outlier rating never rewrites the
profile.

## Promotion (human gatekeeper — matches KB IP rule)
1. A generation with rating ≥ 8.5 (strategy) OR an anti-pattern justified by one or more
   evidence types (rating ≤ 6, explicit negative feedback, major revision, benchmark
   failure, critical-failure veto, founder review, repeated failure, downstream
   underperformance) — NOT rating alone — becomes a CANDIDATE when a task/audience
   cluster has ≥ 3 supporting records.
2. Founder reviews and approves. Private candidates enter `pattern_library.private.json`
   (`global_eligible:false`). Nothing is auto-promoted.
3. Global eligibility requires explicit consent + de-identification + evidence review +
   founder approval. De-identification alone does NOT create consent. Raw prompt content
   is excluded from global learning by default.

## Migration
Non-destructive: `node scripts/engine/migrate-history.mjs <skill-dir>` reads legacy
`prompt_history.json` and writes a normalized `generation_history.json` beside it
(never deletes the legacy file). Run it once, locally, against the private skill dir.

## Future web migration map
- `generation_history.json` → `generations` table
- `preference_profile.json` → `user_preferences` row (JSONB)
- `pattern_library.private.json` → `patterns` table (per-user rows)
- `pattern_library.global.json` → `patterns` table (global rows)

Field names are kept identical so the port is a load, not a redesign.
