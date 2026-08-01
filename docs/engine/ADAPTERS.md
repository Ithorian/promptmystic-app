# Engine Adapters

**Engine version:** `1.0.0` (stable, gate G1 satisfied on `1.0.0-alpha.15`)
**Canonical core checksum:** `ce87bf1994c0b33033ee9ceff120b60628140483f252b3fd86fd99a204b8acf5`

Both surfaces embed the **verbatim canonical core** from
`system-prompt.core.md` (the block between `CORE:BEGIN` and `CORE:END`). Only thin,
runtime-specific wrappers may differ, and every difference is listed here. None of
these differences alter product behavior; a behavioral change requires an
`engine_version` increment (Engine Contract section 9).

## Parity requirement (corrected)

- The canonical core content must match by version and checksum across both surfaces.
- The Engine Contract, schemas, canonical examples, and behavior rules must match.
- A whole-file, full-text diff of zero between adapters is **not** required.
- Drift is detected by `scripts/engine/parity.mjs` (compares the embedded core hash to
  `engine-version.json.canonical_core_sha256`).

## Skill adapter (`adapters/skill/SKILL.md` → `~/.claude/skills/promptmystic/SKILL.md`)

Justified, minimal deltas around the canonical core:
- **YAML frontmatter** (`name`, `description`, `argument-hint`, `allowed-tools: Read, Write`) — required by Claude Code.
- **`$ARGUMENTS` intake line** — how Claude Code passes the user's words.
- **RECORD step** — appends a structured record to the local stores and reads
  patterns/preferences (skill has filesystem access; see Stage 7).
- **Feedback capture** — post-value numeric rating recorded to history (reconciles the
  old "do not ask for a numeric rating" line with the Average User Rating north star).

## Web adapter (`src/features/promptmystic/engine/core-prompt.generated.ts` + `system-prompt.ts`)

Justified, minimal deltas around the canonical core:
- **No filesystem / no RECORD step** — the web MVP does not persist history yet;
  persistence + rating widget are surface responsibilities added later.
- **Delivery rendering** — the UI's Copy button extracts the fenced code block. As of
  `1.0.0-alpha.6` the fence itself is mandated by the canonical core on both surfaces,
  so this is a rendering dependency rather than an adapter behavior delta.

## Regeneration + verification

```
node scripts/engine/parity.mjs --write   # regenerate adapters + record core hash
node scripts/engine/parity.mjs           # verify parity (read-only; nonzero on drift)
```

The live skill file is updated by copying `adapters/skill/SKILL.md` to
`~/.claude/skills/promptmystic/SKILL.md` — a deliberate, documented manual step so the
deployed skill is never silently changed.

**The deployed skill is still `0.9.0`.** Promoting the engine to `1.0.0` did not touch it,
by design. Until that copy is made, the versioned source here and the file Claude Code
actually loads are different engines.
