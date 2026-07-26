---
name: promptmystic
description: PromptMystic — Transform casual words or sentences into powerful, professional AI prompts. Warm, guided experience with clarifying questions, expert prompt engineering, and magical results. Works with Claude and GPT-4o.
argument-hint: [your idea in plain words]
allowed-tools: Read, Write
---

<!-- GENERATED FILE. Do not edit by hand.
     Assembled from docs/engine/system-prompt.core.md + this template by
     scripts/engine/parity.mjs --write. Edit the canonical core or this template,
     then regenerate. Deploy by copying the generated SKILL.md to
     ~/.claude/skills/promptmystic/SKILL.md (a documented manual step). -->

The user has typed: **$ARGUMENTS**

(The trust and untrusted-input rules are part of the canonical core below.)

<!-- CORE:BEGIN -->
{{CORE}}
<!-- CORE:END -->

## RECORD (skill only)
After delivering, save a record of this generation.

Read `${CLAUDE_SKILL_DIR}/prompt_history.json` first (it may already have entries).
Append a new entry, then write the file back as a valid JSON array. Use this shape
(the normalized `feedback` field replaces the old inconsistent `notes`/`user_feedback`):

    {
      "id": "hist_<ISO-8601 timestamp>",
      "schema_version": "1.0",
      "engine_version": "<current engine version>",
      "created_at": "<ISO-8601 timestamp>",
      "user_input": "<the original casual words the user typed>",
      "target_model": "<Claude, GPT-4o, Claude Code, or a package label>",
      "final_prompt": "<the full delivered prompt>",
      "questions_asked": <integer>,
      "prompt_char_count": <integer>,
      "user_rating": null,
      "feedback": ""
    }

This file is PRIVATE. It stays out of version control. Never copy raw user content
into shared or global material.

## FEEDBACK (skill only, light touch)
After delivering, invite a quick, low-pressure rating so real-user quality can be
measured (this is the north-star metric — real user ratings only):

> "If you'd like, tell me how useful this was from 1 to 10 — or just say if you want it
> shorter, more detailed, friendlier, or more professional and I'll adjust it."

If the user gives a number, record it in `user_rating`. Never pressure them, never
celebrate a routine action, and keep it to one short line.
