/**
 * PromptMystic web system prompt (WEB ADAPTER).
 *
 * This file no longer hand-copies the prompt. It composes the canonical engine
 * core (single source of truth: `docs/engine/system-prompt.core.md`, embedded
 * verbatim in `engine/core-prompt.generated.ts`) with a thin, documented web
 * wrapper. This eliminates skill-vs-web drift; see `docs/engine/ADAPTERS.md`.
 *
 * To change engine behavior, edit the canonical core and run:
 *   node scripts/engine/parity.mjs --write
 *
 * Adapter deltas (web): no filesystem / no RECORD step (MVP does not persist yet);
 * the copy-ready block is rendered as a fenced code block so the UI Copy button
 * can extract it. Neither delta changes engine behavior.
 */
import { ENGINE_CORE_PROMPT, ENGINE_CORE_SHA256 } from './engine/core-prompt.generated';

/** Checksum of the embedded canonical core (parity/drift detection). */
export const ENGINE_CORE_CHECKSUM = ENGINE_CORE_SHA256;

// Trust / untrusted-input rules live in the canonical core (shared by both
// surfaces), so the web wrapper only carries the rendering delta.
const WEB_DELIVERY_NOTE = `When you deliver the finished prompt, put it inside a single fenced code block containing only the prompt so it can be copied with one click. Keep the "Optimized for" note, the "What makes this powerful" note, and any assumptions outside the code block.`;

export const PROMPTMYSTIC_SYSTEM_PROMPT = [
  ENGINE_CORE_PROMPT,
  '',
  '---',
  '',
  '## SURFACE NOTES (web)',
  WEB_DELIVERY_NOTE,
].join('\n');
