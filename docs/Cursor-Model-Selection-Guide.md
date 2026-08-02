# Cursor Model Selection Guide

This guide helps choose the best AI model in Cursor depending on the task.

## Quick Recommendation

| Task Type                        | Recommended Model       | Reason |
|----------------------------------|-------------------------|--------|
| **Daily coding & refactors**     | **Claude 4 Sonnet**     | Best balance of quality and speed |
| **Planning & Architecture**      | **Claude 4 Opus**       | Strongest reasoning and planning |
| **Quick edits / small changes**  | **Composer 2**          | Very fast and cost-effective |
| **Writing or improving docs**    | **Claude 4 Sonnet**     | Excellent at clear, structured writing |
| **Complex debugging**            | **Claude 4 Opus**       | Better at deep problem analysis |
| **Simple autocomplete**          | **Composer 2** or Fast model | Fastest response |

## Model Breakdown

| Model                | Strengths                              | Weaknesses                     | Best Used For                     | Speed     | Cost     |
|----------------------|----------------------------------------|--------------------------------|-----------------------------------|-----------|----------|
| **Claude 4 Sonnet**  | Excellent code quality, great instruction following, balanced | More expensive than Composer   | Most development work             | Very Good | Medium   |
| **Claude 4 Opus**    | Best at complex reasoning and planning | Slower and more expensive      | Architecture, planning, hard problems | Good      | High     |
| **Composer 2**       | Very fast, great at multi-file edits   | Slightly weaker on very hard tasks | Daily coding, quick iterations    | Excellent | Low      |
| **GPT-5 series**     | Reliable, good all-rounder             | Can sometimes be less thorough | General coding tasks              | Very Good | Medium   |
| **o3 / o3-mini**     | Strong reasoning capabilities          | Slower                         | Complex logic and planning        | Medium    | High     |

## Recommended Setup for PromptMystic

- **Primary Model**: **Claude 4 Sonnet** — Use this for most work.
- **Planning Mode**: Switch to **Claude 4 Opus** when doing architecture, feature planning, or solving difficult problems.
- **Fast Work**: Use **Composer 2** for quick refactors, small changes, or when you want speed over maximum intelligence.
- **Documentation**: Use **Claude 4 Sonnet** when writing or updating documentation.

## Tips

- You can change models easily at the bottom of the chat window or in Composer.
- For important planning sessions, start with **Claude 4 Opus**, then switch back to **Sonnet** for implementation.
- Composer 2 is excellent when you want Cursor to make changes across multiple files quickly.

---

**Last Updated:** June 11, 2026