# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

A free, interactive study guide for Anthropic's **Claude Certified Architect – Foundations (CCA-F)** exam, built from Sangam's 977/1000 pass experience. It is a **static HTML site** (no framework decided yet, no backend, no login) that will eventually deploy to Vercel on a divingsbysangam.com subdomain. Development has **not started** — the project is in the requirements/design phase, and work is ticketed in Linear to be taken one ticket at a time.

## Source of truth

- `docs/plans/2026-08-10-001-feat-ccaf-interactive-guide-plan.md` — the Product Contract (requirements R1–R16, key decisions, flows, acceptance examples, scope boundaries). Read this before building anything; do not invent product behavior it doesn't cover.
- **Linear** (workspace `divings`, team Divings, project "CCA-F Interactive Guide"): epics DIV-19/20/21/22 with sub-issues DIV-23–36. Tickets carry per-feature UI direction and acceptance checklists; work them in dependency order (DIV-23 scaffold first). Update ticket status as work proceeds. (An identical older copy exists in the retired `sangampersonaldev` workspace — ignore it.)
- `CCA-F-Open-Source-Resources.md` — the annotated inventory of ~25 external prep resources the guide curates and links out to.

## Architecture (planned, per the plan)

Five-step **Journey Map** as the landing page (blueprint → reading → labs → drills → mock exam), each step opening layered "quick-bit" concept cards (default quick bit + two collapsed expanders: "from zero" and "how the exam twists this"). Progress, drill scores, and read-state live in **localStorage** — never a server (export/import and the study timer were cut 2026-08-14 as v1 overkill). Music (Spotify embed) is a corner widget. Everything must run by opening local HTML files directly; deployment to Vercel must not change behavior.

## Visual identity (binding design decision)

The guide's look is a **subtle ambient particle system** (plan R16). Reference implementation: `demos/guide-particles-preview.html` — dark calm base, three depth layers of slow drifting particles, sparks along the journey path, gentle bursts on completion, warm-gold "done" nodes. Rules: particles always render *behind* content, motion is slow and dim, text is never obstructed, `prefers-reduced-motion` disables ambient animation. Vanilla canvas by default; adopt tsParticles/Three.js only when a specific effect demands it. `demos/humanoid-avatar-demo.html` is an earlier experiment, superseded — do not extend it.

## Content rules (legal — non-negotiable)

- Only original content or adaptations of openly licensed sources, with visible attribution and a credits entry. Verified licenses: daronyondem/claude-architect-exam-guide (CC BY 4.0), hamzafarooq/claude-certified-architect (MIT). Re-verify licenses at adaptation time.
- **Never** copy questions from claudecertificationguide.com or any third-party question bank, and never reproduce actual exam content (NDA). Original drill questions are style-inspired from the official blueprint only.
- External mock exams are linked (new tabs), not rebuilt.
- All exam-style questions, blocker stories, and adapted passages require Sangam's review before publishing.

## Workflow notes

- Sangam handles the Vercel account/domain transfer in parallel; it gates deployment (DIV-34) only — never local build work.
- This is a "living guide": quarterly refresh workflow (DIV-35) with a visible "last verified" date. When updating content, check official blueprint deltas and link rot.
- Inputs still owed by Sangam (tickets labeled `needs-sangam`): hero story + blocker narratives, Spotify playlist link, subdomain choice.

There are no build, lint, or test commands yet — the site is static files opened directly in a browser. Add commands here if tooling is introduced.
