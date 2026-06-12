# PromptMystic Documentation

This folder contains the core documentation for the PromptMystic project.

## Key Documents

| File                              | Description                                              | Notes |
|-----------------------------------|----------------------------------------------------------|-------|
| `PromptMystic-PRD.md`             | Product Requirements Document (Working Version)         | Main source of truth for product direction and scope |
| `PROJECT-STRUCTURE.md`            | Overview of project layout and important file locations | Reference for developers and AI agents |
| `PRD-Sync-Note.md`                | Rules for keeping the two PRD copies in sync            | Follow this when updating the PRD |
| `README.md`                       | This file — Index of documentation                      | Start here |

## Project Overview

**PromptMystic** is an AI-powered prompt engineering tool that transforms simple, everyday language into high-quality, well-structured prompts for AI models.

**Core Focus:**  
Helping non-technical users (especially seniors) and side-hustle creators get better results from AI tools with minimal friction.

**Current Status:**  
- PRD Version: **1.0 (Finalized)**
- Primary Product: Self-improving Claude Code skill (`/promptmystic`)
- Secondary: Web application (Next.js + Supabase + Stripe + Resend)

## Important Rules

- The **working version** of the PRD is located at `docs/PromptMystic-PRD.md`.
- After making changes to the PRD, copy the updated file to the knowledge-base repository (`knowledge-base/Projects/PromptMystic/PromptMystic-PRD.md`) so both versions stay in sync.
- Always update documentation when making significant architectural or structural changes.
- Follow the rules defined in `.cursorrules` at the project root.

## Tech Stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend & Database:** Supabase (PostgreSQL + Auth + RLS)
- **Payments:** Stripe
- **Email:** Resend
- **Hosting:** Vercel

## Development Philosophy

- Documentation lives with the code.
- We follow **PRD-First Development**.
- We keep the experience simple and accessible for non-technical users.
- We respect the existing Supabase + Stripe + Resend template structure.

---

*Last updated: June 11, 2026*