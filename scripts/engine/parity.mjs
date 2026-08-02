#!/usr/bin/env node
// PromptMystic engine parity + sync tool (dependency-free).
//
//   node scripts/engine/parity.mjs           -> verify parity (read-only; exit 1 on drift)
//   node scripts/engine/parity.mjs --write    -> regenerate adapters + record core hash
//
// Guarantees the canonical core (docs/engine/system-prompt.core.md, between the
// CORE:BEGIN / CORE:END markers) is embedded verbatim in every adapter and that the
// recorded checksum in engine-version.json matches. Adapters may add thin wrappers;
// only the core block is hashed (see docs/engine/ADAPTERS.md).

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const p = (...parts) => resolve(ROOT, ...parts);

const CANONICAL = p('docs/engine/system-prompt.core.md');
const VERSION_FILE = p('docs/engine/engine-version.json');
const SKILL_TEMPLATE = p('docs/engine/adapters/skill/SKILL.template.md');
const SKILL_OUT = p('docs/engine/adapters/skill/SKILL.md');
const WEB_CORE_OUT = p('src/features/promptmystic/engine/core-prompt.generated.ts');

const BEGIN = '<!-- CORE:BEGIN -->';
const END = '<!-- CORE:END -->';

function extractCore(text, file) {
  const start = text.indexOf(BEGIN);
  const end = text.indexOf(END);
  if (start === -1 || end === -1 || end < start) {
    throw new Error(`Could not find CORE:BEGIN/END markers in ${file}`);
  }
  // Normalize CRLF/CR to LF so the checksum is platform-independent (a repo
  // checked out with different line endings must still match).
  return text.slice(start + BEGIN.length, end).replace(/\r\n?/g, '\n').trim();
}

function sha256(s) {
  return createHash('sha256').update(s, 'utf8').digest('hex');
}

const write = process.argv.includes('--write');
const canonicalCore = extractCore(readFileSync(CANONICAL, 'utf8'), CANONICAL);
const canonicalHash = sha256(canonicalCore);

if (write) {
  // 1. Skill adapter: inject core into the template.
  const template = readFileSync(SKILL_TEMPLATE, 'utf8');
  if (!template.includes('{{CORE}}')) throw new Error('SKILL.template.md missing {{CORE}} placeholder');
  writeFileSync(SKILL_OUT, template.replace('{{CORE}}', canonicalCore), 'utf8');

  // 2. Web adapter core (generated TS constant; JSON.stringify handles all escaping).
  const ts =
    '// AUTO-GENERATED FROM docs/engine/system-prompt.core.md — DO NOT EDIT.\n' +
    '// Regenerate with: node scripts/engine/parity.mjs --write\n' +
    `export const ENGINE_CORE_SHA256 = ${JSON.stringify(canonicalHash)};\n` +
    `export const ENGINE_CORE_PROMPT = ${JSON.stringify(canonicalCore)};\n`;
  mkdirSync(dirname(WEB_CORE_OUT), { recursive: true });
  writeFileSync(WEB_CORE_OUT, ts, 'utf8');

  // 3. Record hash in engine-version.json (preserve other fields).
  const version = JSON.parse(readFileSync(VERSION_FILE, 'utf8'));
  version.canonical_core_sha256 = canonicalHash;
  writeFileSync(VERSION_FILE, JSON.stringify(version, null, 2) + '\n', 'utf8');

  console.log(`[parity] wrote adapters. canonical_core_sha256 = ${canonicalHash}`);
  process.exit(0);
}

// ---- verify mode ----
const problems = [];

const version = JSON.parse(readFileSync(VERSION_FILE, 'utf8'));
if (version.canonical_core_sha256 !== canonicalHash) {
  problems.push(`engine-version.json hash ${version.canonical_core_sha256} != canonical ${canonicalHash}`);
}

try {
  const skillCore = extractCore(readFileSync(SKILL_OUT, 'utf8'), SKILL_OUT);
  if (sha256(skillCore) !== canonicalHash) problems.push('skill adapter core hash != canonical (run --write)');
} catch (e) {
  problems.push(`skill adapter: ${e.message}`);
}

try {
  const webTs = readFileSync(WEB_CORE_OUT, 'utf8');
  const m = webTs.match(/ENGINE_CORE_SHA256 = "([a-f0-9]{64})"/);
  if (!m) problems.push('core-prompt.generated.ts missing ENGINE_CORE_SHA256');
  else if (m[1] !== canonicalHash) problems.push('web adapter core hash != canonical (run --write)');
} catch (e) {
  problems.push(`web adapter: ${e.message}`);
}

if (problems.length) {
  console.error('[parity] DRIFT DETECTED:');
  for (const pr of problems) console.error('  - ' + pr);
  process.exit(1);
}
console.log(`[parity] OK. All adapters match canonical core (${canonicalHash}).`);
