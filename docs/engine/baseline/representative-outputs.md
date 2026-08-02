---
BASELINE REPRESENTATIVE OUTPUTS — v0.9.0
captured: 2026-07-25
privacy: SYNTHETIC / GENERALIZED ONLY. No raw private user history is reproduced here.
purpose: Capture the *shape and quality* of pre-contract engine output so behavioral
         change is visible against the baseline.
---

# Representative outputs of the pre-contract engine (v0.9.0)

These are generalized illustrations of how the engine behaved at baseline. They
are reconstructed from the *patterns* observed in the private skill history
(side-hustle / senior / low-tech domain) WITHOUT copying any real user's words,
business names, or personal details. Real private records remain in
`~/.claude/skills/promptmystic/prompt_history.json` (out of repo, untracked).

## Characteristic strengths at baseline
- Warm "kitchen-table friend" tone.
- Strong, specific expert roles.
- Clear numbered section structure for how-to / side-hustle plans.
- Plain-language constraints ("explain every term", "free or low-cost tools").
- Good real-user ratings clustering ~8.5-9.5 for side-hustle plans.

## Characteristic weaknesses at baseline (targets for the contract)
- No compression pass — prompts trend long; redundancy not removed.
- Occasional role inflation risk (no explicit guard).
- Fixed "up to 5 questions" mindset rather than value-tested adaptive questions.
- No escape hatch ("use your best judgment") in clarifying questions.
- One-shot mega-builds delivered instead of phased builds (observed ~7/10).
- No trust/injection boundary.

## Illustrative baseline output A — beginner marketplace side hustle (generalized)

User (generalized): "I want a simple side hustle selling handmade items online."

Engine (baseline-style) final prompt:

    You are an experienced marketplace-seller coach and handmade-product
    specialist who helps complete beginners — including seniors with limited tech
    experience — launch a simple product online and make their first sale. You
    explain everything from scratch, without jargon or overwhelm.

    I want to start a side hustle selling handmade items online but I have no
    prior experience selling or building anything technical. I need a complete,
    beginner-friendly plan to go from idea to first sale.

    Sections: 1. What this is (plain English + example), 2. What I actually need,
    3. Where to sell, 4. Simple pricing formula, 5. How to get first sales
    without ads, 6. Realistic 30/90-day expectations, 7. Quick-start checklist.

    Rules: Explain every term on first use. Tools free or under $15/month. Honest
    about the effort involved. Doable by one person from home.

    Tone: Warm, patient, and genuinely encouraging — like a knowledgeable friend
    at the kitchen table, walking me through every step with kindness and no rush.

Notes: high-rated shape, but long; role slightly padded; no compression applied.

## Illustrative baseline output B — over-ambitious one-shot app build (generalized)

User (generalized): "Build me an app that identifies items from photos and
auto-lists them for sale on several sites, with pricing."

Engine (baseline-style): delivered a single very large build prompt covering
requirements + architecture + integrations + pricing at once.

Observed outcome pattern: rated markedly lower (~7/10) — "too ambitious for one
shot." Correct behavior (post-contract): split into phased prompts and prefer a
build tool for the build steps (captured as anti-pattern AP-0001).
