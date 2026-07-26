# Engine Adapters

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
- **Delivery rendering** — the copy-ready block is a fenced code block so the UI's
  Copy button can extract it. (The canonical core already mandates a delimited,
  copy-ready block containing only the prompt; the fence is the web rendering of it.)

## Regeneration + verification

```
node scripts/engine/parity.mjs --write   # regenerate adapters + record core hash
node scripts/engine/parity.mjs           # verify parity (read-only; nonzero on drift)
```

The live skill file is updated by copying `adapters/skill/SKILL.md` to
`~/.claude/skills/promptmystic/SKILL.md` — a deliberate, documented manual step so the
deployed skill is never silently changed.
