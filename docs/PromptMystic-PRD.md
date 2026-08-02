# PromptMystic Product Requirements Document (PRD)

**Product Name:** PromptMystic  
**Domain:** PromptMystic.com  
**Version:** 1.0  
**Date:** June 09, 2026  
**Owner:** Patrick Fitzgerald  
**Status:** Finalized v1.0

---

## 1. Overview

**PromptMystic** is an AI-powered prompt engineering tool that transforms simple, everyday language into high-quality, well-structured prompts for AI models (starting with Claude and GPT-4o).

The core promise is to deliver a “Google-like” experience for prompt creation — users type simple words or short sentences, and PromptMystic returns a professional, optimized prompt that produces strong results.

**Slogan:**  
“AI that works for you, not against you.”

---

## 2. Problem Statement

Many people (especially non-technical users and seniors) struggle to write effective prompts for AI tools. They know what they want but don’t know how to phrase it in a way that produces good results. This creates friction and reduces the usefulness of AI for side hustles, small businesses, and personal productivity.

PromptMystic aims to remove that friction by acting as an intelligent intermediary between casual ideas and high-quality AI outputs.

---

## 3. Target Users & Positioning Strategy

### Primary Audience (Phase 1 Focus)

- **Seniors and low-tech / non-technical users** who want to create side income using AI tools.
- People who feel overwhelmed by AI but want simple, practical ways to benefit from it.
- Users looking for doable side hustles (digital products, services, content, etc.).

### Secondary / Expansion Audience (Phase 2)

- Content creators who regularly use AI tools and want faster, more consistent results.
- Small business owners exploring how AI can help their business.
- Students, engineers, and professionals who work with AI systems but want to communicate with them more effectively.

### Positioning Approach

PromptMystic will launch with a strong focus on the **senior / low-tech / side income** audience. This group has the clearest pain point and emotional resonance. Once the product is proven with this audience, marketing and messaging will expand to serve a broader range of users who work with AI tools.

**Core Promise:**  
Turn simple, everyday words into professional, well-engineered prompts that feel like magic — especially for people who don’t consider themselves “technical.”

---

## 4. Value Proposition

PromptMystic turns vague or simple user input into **professional-grade prompts** that deliver consistent, high-quality results from AI models.

Key differentiators:

- Simple, conversational input (no prompt engineering knowledge required)
- Built-in prompt improvement and self-review process
- Self-improving system that learns from user ratings over time
- Designed specifically for non-technical users

---

## 5. MVP Scope (Version 1)

**Goal for V1:**  
Deliver a focused, high-quality experience that solves the core problem extremely well for the Phase 1 audience before expanding.

### In Scope for V1
- Core PromptMystic Claude Code skill (`/promptmystic`) with full self-improving loop
- Up to 5 clarifying questions (one at a time)
- Internal "highly trained prompt engineer" review step
- Warm, reassuring brand voice aligned with “AI that works for you, not against you.”
- Support for Claude and GPT-4o at launch
- Basic web application (Next.js) with user accounts and prompt history
- Simple dashboard showing past prompts and ratings
- Subscription billing via Stripe ($9 / $19 / $29 tiers)
- Prompt history stored securely
- Clear onboarding that feels encouraging and low-pressure

### Out of Scope for V1 (Future Phases)
- Public prompt marketplace or sharing
- Team / organization accounts
- Advanced analytics dashboard
- Integration with image/video generation tools (Hailuo, Veo, Sora, etc.)
- Autonomous income-generating agents
- Multi-language support
- Mobile app (iOS/Android)
- White-label or API access for other builders

**Guiding Principle:**  
V1 must feel magical and reliable for non-technical users. We will resist adding features that increase complexity until the core experience is proven.

---

## 6. User Journey (V1)

The primary goal of the V1 user journey is to deliver immediate value with minimal friction, especially for seniors and low-tech users who may feel intimidated by AI tools.

### Primary Path (Recommended for V1)

1. **Discovery**  
   The user hears about PromptMystic through a short tutorial video, recommendation, or search. They are looking for help creating better prompts for side income ideas, content, or personal projects.

2. **First Contact – Claude Code Skill**  
   The easiest entry point is installing the PromptMystic skill in Claude Code. The user types `/promptmystic` followed by a simple request in plain language (e.g., “help me create a side hustle selling digital printables on Etsy”).

3. **Clarifying Conversation**  
   PromptMystic asks up to 5 gentle, one-at-a-time clarifying questions to understand the user’s goal, audience, and constraints. This step feels like talking to a patient, knowledgeable friend rather than using a technical tool.

4. **High-Quality Prompt Delivered**  
   After the internal prompt engineer review, the user receives a well-structured, ready-to-copy prompt optimized for Claude or ChatGPT. The output feels “magical” — turning vague ideas into professional results.

5. **Rating & Learning**  
   The user can optionally rate the result (1–10). High-rated prompts are quietly learned by the system, making future outputs better over time. This creates a personal, improving assistant.

6. **Optional: Move to Web App**  
   For users who want to save history, manage multiple prompts, or access advanced features, they can sign up for the web application. The web app serves as a convenient dashboard rather than the primary experience in V1.

### Design Principles for the Journey
- **Low pressure**: No forced sign-up or complex setup to get value.
- **Encouraging tone**: Every interaction reinforces “AI that works for you, not against you.”
- **Progressive disclosure**: Advanced features (web dashboard, history, subscriptions) are introduced only after the user has experienced core value.
- **Multiple on-ramps**: Users can start with the free Claude Code skill and later move to the paid web app when it feels useful.

This journey is intentionally simple. The focus is on delivering consistent, high-quality results quickly while building trust with the Phase 1 audience.

---

## 7. Current Feature Status (as of June 2026)

| Feature                                            | Status         | Notes                                                     |
| -------------------------------------------------- | -------------- | --------------------------------------------------------- |
| Turn casual language into professional prompts     | Implemented    | Core value delivered via Claude Code skill                |
| Up to 5 clarifying questions (one at a time)       | Implemented    | Prevents vague or low-quality prompts                     |
| Internal prompt engineer review step               | Implemented    | Improves output quality before delivery                   |
| Self-improving algorithm (ratings + learning loop) | Implemented    | Uses `prompt_history.json` and high-rated examples        |
| Learning from past high-rated prompts              | Implemented    | Skill reviews 8–10 rated entries at the start of each run |
| Clean, copy-ready final prompt                     | Implemented    | Includes big “Copy Prompt” block                          |
| Warm, reassuring brand voice                       | Implemented    | “AI that works for you, not against you.”                 |
| Support for Claude + GPT-4o                        | Implemented    | At launch                                                 |
| Claude Code skill (`/promptmystic`)                | Implemented    | Available globally and in specific projects               |
| Prompt history storage                             | Implemented    | Stored for future self-improvement                        |
| Phased audience strategy                           | Defined        | Phase 1 = Seniors / Low-tech / Side income users          |
| Web application (Next.js + Supabase + Stripe)      | In Progress    | Template installed and basic setup complete               |
| User accounts + dashboard                          | Planned for V1 | Not yet built                                             |
| Subscription billing                               | Planned for V1 | Pricing tiers defined ($9 / $19 / $29)                    |

---

## 8. Go-to-Market & Positioning Strategy

### Phase 1 – Core Audience (Launch Focus)

- Primary focus: Seniors and low-tech users wanting side income.
- Marketing tone: Warm, patient, encouraging, and reassuring.
- Content style: Simple tutorials, success stories, and step-by-step guides.
- Goal: Build trust and demonstrate that powerful AI results are achievable without technical skills.

### Phase 2 – Broader Expansion

- Expand messaging to content creators, small business owners, students, and professionals.
- Highlight time-saving and consistency benefits for more experienced AI users.
- Maintain the core promise of simplicity while showing advanced use cases.

This phased approach allows PromptMystic to own a clear, underserved niche early while building toward a larger total addressable market.

---

## 9. Future Features (Post-MVP)

- Support for additional models (Gemini, Grok, etc.)
- Prompt packs / templates marketplace
- Team / shared workspaces
- Integration with other tools (Notion, Google Docs, etc.)
- Advanced self-improvement algorithms
- Video generation and automation prompt packs
- Multi-modal prompt support (image + text)

---

## 10. Tech Stack

- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend / Database:** Supabase (PostgreSQL + Auth + RLS + Storage)
- **Payments:** Stripe
- **Email:** Resend
- **Hosting:** Vercel
- **AI Integration:** Claude (primary), with support for GPT-4o
- **Custom Skill:** PromptMystic Claude Code skill with self-improving loop

---

## 11. Success Metrics (First 12 Months)

We will measure success using the following key metrics:

| Metric                                      | Target (6 months) | Target (12 months) | Why It Matters                              |
|---------------------------------------------|-------------------|--------------------|---------------------------------------------|
| **Monthly Active Users (MAU)**              | 150               | 600                | Indicates real product adoption             |
| **Average Prompt Rating**                   | ≥ 8.3 / 10        | ≥ 8.6 / 10         | Primary measure of output quality           |
| **Prompts Generated per Active User (Monthly)** | 10            | 18                 | Shows habitual, repeated usage              |
| **User Retention (Month 3)**                | 35%               | 45%                | Indicates whether users find ongoing value  |
| **Paid Conversion Rate (from free users)**  | 10%               | 18%                | Validates willingness to pay                |
| **Net Promoter Score (NPS)**                | ≥ 45              | ≥ 55               | Measures emotional connection and referral  |

**Primary North Star Metric:**  
**Average Prompt Rating ≥ 8.5/10** combined with **consistent weekly usage** by active users.

These targets are intentionally realistic for a solo-founder product in the first year.

---

## 12. Risks & Mitigations

| Risk Category                  | Description                                                                 | Likelihood | Impact | Mitigation Strategy                                                                                      |
|--------------------------------|-----------------------------------------------------------------------------|------------|--------|----------------------------------------------------------------------------------------------------------|
| **User Adoption**              | Seniors and low-tech users may struggle with even a simple web app          | Medium     | High   | Extremely simple onboarding, heavy emphasis on the Claude skill first, lots of short tutorial videos     |
| **Prompt Quality Variability** | Some users may still get mediocre results despite the system                | Medium     | Medium | Continue strengthening the internal review step and learning loop; collect high-rated examples           |
| **IP & Methodology Leakage**   | Core IP (self-improving process, testing methodology, prompt patterns) could be copied or diluted | Medium     | High   | Document IP clearly, keep core algorithms and high-value patterns internal, consider future legal protection |
| **Competition**                | Larger AI companies (OpenAI, Anthropic, Google) could release similar features | High       | Medium | Focus on emotional trust + senior-friendly experience + self-improving personal skill as differentiators |
| **Monetization**               | Users may resist paying for prompt help                                     | Medium     | High   | Strong free tier + clear demonstration of time saved and better results                                  |
| **Technical Debt**             | Building the web app while maintaining the Claude skill                     | Medium     | Medium | Keep the Claude skill as the primary product initially; treat the web app as a supporting layer          |
| **Scope Creep**                | Temptation to add too many features too quickly                             | High       | High   | Strict adherence to the V1 scope defined above; regular “Is this V1 or V2?” reviews                      |

**Key Risk to Watch:**  
Over-engineering the web application before validating that the core prompting experience delivers consistent value.

---

## 13. Out of Scope (for MVP)

- Building a full autonomous income-generating agent
- Advanced video/image generation features
- Team collaboration features
- Public prompt marketplace
- Mobile app

---

## 14. Open Questions

- How aggressively should we push the self-improving algorithm in the early stages?
- What is the right balance between asking clarifying questions vs. making assumptions?
- How do we handle users who want prompts for very technical or specialized domains?
- Should we start with only Claude, or support GPT-4o from day one?

---

## 15. Strategic Direction

PromptMystic is not just a prompt generator. It is the first product in a broader vision of **Human + Multiple AI Systems Collaboration**.

Long-term, the methodology and systems developed here may evolve into:

- Additional AI-powered tools
- Prompt packs for specific use cases
- Educational content and tutorials
- Potentially a larger platform or methodology that can be productized

*This document is a living PRD and will be updated as the product evolves.*

**PromptMystic PRD v1.0 – Finalized on June 09, 2026**

---=