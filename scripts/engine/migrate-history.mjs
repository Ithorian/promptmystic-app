#!/usr/bin/env node
// Non-destructive migration: legacy prompt_history.json -> normalized
// generation_history.json (generation-record schema v1.0).
//
//   node scripts/engine/migrate-history.mjs <skill-dir> [--dry-run]
//
// Reads <skill-dir>/prompt_history.json, normalizes each record, and writes
// <skill-dir>/generation_history.json ONLY if it does not already exist. The legacy
// file is NEVER modified or deleted. Run this once, locally, against your private skill
// directory (e.g. ~/.claude/skills/promptmystic). Nothing here is committed to git and
// no raw content is copied outside the skill dir.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const skillDir = process.argv[2];
const dryRun = process.argv.includes('--dry-run');
if (!skillDir) {
  console.error('Usage: node scripts/engine/migrate-history.mjs <skill-dir> [--dry-run]');
  process.exit(2);
}

const legacyPath = resolve(skillDir, 'prompt_history.json');
const outPath = resolve(skillDir, 'generation_history.json');

if (!existsSync(legacyPath)) { console.error(`No legacy file at ${legacyPath}`); process.exit(1); }
if (existsSync(outPath)) { console.error(`Refusing to overwrite existing ${outPath}. Migration skipped.`); process.exit(1); }

const legacy = JSON.parse(readFileSync(legacyPath, 'utf8'));
if (!Array.isArray(legacy)) { console.error('Legacy file is not a JSON array.'); process.exit(1); }

const normalized = legacy.map((r) => {
  const createdAt = /^\d{4}-\d{2}-\d{2}T/.test(r.id || '') ? r.id : new Date().toISOString();
  return {
    id: (r.id && String(r.id).startsWith('hist_')) ? r.id : `hist_${r.id ?? createdAt}`,
    schema_version: '1.0',
    engine_version: r.engine_version ?? '0.9.0',
    created_at: createdAt,
    user_input: r.user_input ?? '',
    target_model: r.target_model ?? null,
    final_prompt: r.final_prompt ?? '',
    questions_asked: r.questions_asked ?? null,
    prompt_char_count: r.prompt_char_count ?? (r.final_prompt ? r.final_prompt.length : 0),
    revision_requested: r.revision_requested ?? null,
    user_rating: (typeof r.user_rating === 'number') ? r.user_rating : null,
    // Consolidate the historically inconsistent fields into one:
    feedback: r.feedback ?? r.user_feedback ?? r.notes ?? ''
  };
});

console.log(`Read ${legacy.length} legacy records; normalized ${normalized.length}.`);
if (dryRun) { console.log('[dry-run] would write:', outPath); process.exit(0); }
writeFileSync(outPath, JSON.stringify(normalized, null, 2) + '\n', 'utf8');
console.log(`Wrote ${outPath}. Legacy ${legacyPath} left untouched.`);
