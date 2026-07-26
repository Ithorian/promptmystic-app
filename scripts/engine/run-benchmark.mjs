#!/usr/bin/env node
// PromptMystic benchmark harness (dependency-free).
//
//   node scripts/engine/run-benchmark.mjs                 # all splits
//   node scripts/engine/run-benchmark.mjs --split holdout # one split
//   node scripts/engine/run-benchmark.mjs --out docs/engine/benchmark/baselines/baseline-0.9.0.json
//
// Scope (honest by design): this harness computes only the AUTOMATABLE subset of the
// Engine Quality Score over cases that ship a `reference_output` (a golden prompt
// representing engine behavior). Dimensions needing judgment, and all Downstream
// Success Rate scoring, are reported as PENDING_MANUAL. The harness does NOT call any
// model (cost/keys); live scoring is a manual step. See docs/engine/benchmark/rubric.md.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const BENCH = resolve(ROOT, 'docs/engine/benchmark');

const ROLE_INFLATION = /\b(world[- ]?renowned|world[- ]?class|elite|top\s*0\.1%|unparalleled|internationally recognized|legendary|guru|ninja|rock\s*star|best[- ]in[- ]the[- ]world)\b/i;
const LIFE_COACH = /(you'?re (amazing|incredible|so brave)|so proud of you|you'?ve got this|you got this|crushed it|let'?s make something (incredible|amazing)|absolutely amazing idea)/i;
const META_IN_PROMPT = /(what makes this powerful|optimized for:|to use this prompt|copy everything inside)/i;
const PLACEHOLDER = /\[[A-Z][A-Z _]{2,}\]/g;

const args = process.argv.slice(2);
const only = args.includes('--split') ? args[args.indexOf('--split') + 1] : null;
const outIdx = args.indexOf('--out');
const outPath = outIdx !== -1 ? resolve(ROOT, args[outIdx + 1]) : null;

const splits = ['development', 'holdout', 'edge'].filter((s) => !only || s === only);

function scoreReference(ref, expect) {
  const checks = {};
  const vetoes = [];
  checks.char_count = ref.length;

  checks.role_inflation = ROLE_INFLATION.test(ref);
  if (checks.role_inflation) vetoes.push('role_inflation');

  checks.life_coach = LIFE_COACH.test(ref);

  checks.meta_in_copy_block = META_IN_PROMPT.test(ref);
  if (checks.meta_in_copy_block) vetoes.push('commentary_in_copy_block');

  const placeholders = ref.match(PLACEHOLDER) || [];
  checks.placeholder_count = placeholders.length;

  if (expect && Array.isArray(expect.length_band)) {
    const [lo, hi] = expect.length_band;
    checks.within_length_band = ref.length >= lo && ref.length <= hi;
    if (!checks.within_length_band && (ref.length > hi * 2 || ref.length < lo / 2)) {
      vetoes.push('length_grossly_out_of_band');
    }
  }

  // Automatable dimension points (0-2): concision(3), copy-ready(7), no-inflation(8), length(9).
  let pts = 0;
  pts += checks.placeholder_count <= 2 ? 2 : checks.placeholder_count <= 4 ? 1 : 0; // dim 3 proxy
  pts += checks.meta_in_copy_block ? 0 : 2; // dim 7
  pts += checks.role_inflation ? 0 : 2; // dim 8
  pts += checks.within_length_band === undefined ? 2 : checks.within_length_band ? 2 : 1; // dim 9
  pts += checks.life_coach ? 0 : 2; // tone partial (dim 5 automatable slice)
  checks.automatable_points = pts; // out of 10
  checks.automatable_score = Math.round((pts / 10) * 100);
  checks.vetoes = vetoes;
  return checks;
}

const report = { generated_at: new Date().toISOString(), splits: {}, totals: {} };
let totalCases = 0, scored = 0, vetoTotal = 0, sumAuto = 0, pendingManual = 0;
const problems = [];

for (const split of splits) {
  const file = resolve(BENCH, `${split}.json`);
  let data;
  try { data = JSON.parse(readFileSync(file, 'utf8')); }
  catch (e) { problems.push(`${split}: cannot parse (${e.message})`); continue; }

  const cases = data.cases || [];
  const splitReport = { count: cases.length, scored: 0, pending_manual: 0, vetoes: [], cases: [] };

  for (const c of cases) {
    totalCases++;
    if (!c.id || (!c.input && !c.turns)) { problems.push(`${split}: case missing id/input/turns`); }
    const entry = { id: c.id, type: c.type || c.category || 'generation' };
    if (typeof c.reference_output === 'string') {
      const s = scoreReference(c.reference_output, c.expect);
      entry.automatable_score = s.automatable_score;
      entry.char_count = s.char_count;
      entry.vetoes = s.vetoes;
      splitReport.scored++; scored++; sumAuto += s.automatable_score;
      if (s.vetoes.length) { splitReport.vetoes.push({ id: c.id, vetoes: s.vetoes }); vetoTotal += s.vetoes.length; }
    } else {
      entry.status = 'PENDING_MANUAL';
      splitReport.pending_manual++; pendingManual++;
    }
    splitReport.cases.push(entry);
  }
  report.splits[split] = splitReport;
}

report.totals = {
  total_cases: totalCases,
  automatable_scored: scored,
  pending_manual_or_live_run: pendingManual,
  mean_automatable_engine_quality_score: scored ? Math.round(sumAuto / scored) : null,
  critical_failure_vetoes: vetoTotal,
  downstream_success_rate: 'PENDING_MANUAL (Layer 2 requires live model runs)',
  average_user_rating: 'N/A — real users only; not produced by this harness'
};
report.fixture_problems = problems;

const pretty = JSON.stringify(report, null, 2);
if (outPath) { mkdirSync(dirname(outPath), { recursive: true }); writeFileSync(outPath, pretty + '\n', 'utf8'); console.log(`[benchmark] wrote ${outPath}`); }

console.log('--- PromptMystic benchmark (automatable subset) ---');
console.log(`cases: ${totalCases} | automatable-scored: ${scored} | pending: ${pendingManual}`);
console.log(`mean automatable Engine Quality Score: ${report.totals.mean_automatable_engine_quality_score}`);
console.log(`critical-failure vetoes: ${vetoTotal}`);
if (problems.length) { console.log('fixture problems:'); problems.forEach((p) => console.log('  - ' + p)); }
process.exit(problems.length ? 1 : 0);
