# PromptMystic

**PromptMystic** is an AI-powered prompt engineering tool that transforms simple, everyday language into high-quality, well-structured prompts.

**Slogan:**  
“AI that works for you, not against you.”

---

## Documentation

All project documentation is located in the `docs/` folder:

- **[PromptMystic-PRD.md](docs/PromptMystic-PRD.md)** — Product Requirements Document (v1.0)
- **[PROJECT-STRUCTURE.md](docs/PROJECT-STRUCTURE.md)** — Project layout and key file locations
- **[PRD-Sync-Note.md](docs/PRD-Sync-Note.md)** — How to keep the two PRD copies in sync

## Tech Stack

- Next.js 15 (App Router) + TypeScript
- Supabase (Database + Auth + RLS)
- Stripe (Payments & Subscriptions)
- Resend (Email)
- Tailwind CSS + shadcn/ui
- Vercel (Hosting)

## Project Philosophy

- Documentation lives with the code.
- We follow **PRD-First Development**.
- We keep the experience simple and accessible, especially for non-technical users.

## Getting Started

```bash
git clone https://github.com/Ithorian/promptmystic-app.git
cd promptmystic-app
pnpm install

Create a .env.local file using .env.local.example and add your credentials, then run:
pnpm dev

For detailed setup instructions and project guidelines, see the documentation in the docs/ folder.

Last updated: July 13, 2026

