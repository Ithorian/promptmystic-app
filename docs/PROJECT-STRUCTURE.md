# PromptMystic Project Structure

This document explains the key files and organization of the PromptMystic development project.

## Key Files & Locations

| File / Folder                        | Purpose                                                                 | Notes |
|--------------------------------------|--------------------------------------------------------------------------|-------|
| `docs/PromptMystic-PRD.md`           | **Working version** of the Product Requirements Document                | Edit this version during development |
| `docs/PROJECT-STRUCTURE.md`          | This file – explains project layout and important locations             | Keep updated as structure evolves |
| `docs/PRD-Sync-Note.md`              | Explains how to keep the two PRD copies in sync                         | Follow this rule when updating the PRD |
| `.cursorrules`                       | Project-specific rules for Cursor / AI coding assistants                | Located at project root |
| `src/`                               | Main application source code                                            | Follow existing template structure |
| `supabase/`                          | Supabase migrations and configuration                                   | Respect RLS policies |

## PRD Synchronization Rule

- **Working Version:** `docs/PromptMystic-PRD.md` (inside this project)
- **Archive / Backup Version:** `C:\Dev\knowledge-base\Projects\PromptMystic\PromptMystic-PRD.md`

**Rule:** After making significant changes to the PRD, copy the updated file to the knowledge-base repository so both versions stay in sync.

## Project Philosophy
- Documentation lives with the code.
- We follow **PRD-First Development**.
- We use the existing Supabase + Stripe + Resend template structure.
- We keep changes minimal and focused.

Last Updated: June 11, 2026

---