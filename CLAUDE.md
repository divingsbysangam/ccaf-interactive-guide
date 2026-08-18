# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

A free, interactive study guide for Anthropic's **Claude Certified Architect – Foundations (CCA-F)** exam, built from Sangam's 977/1000 pass experience. It is a **static HTML site** — vanilla HTML/CSS/JS, no framework, no build step, no backend, no login. v1 is built and **live at https://ccaf-guide.divingsbysangam.com** (Vercel alias: ccaf-interactive-guide.vercel.app); work is ticketed in Linear.

## Repo, deploy, and dev loop

- **GitHub:** `divingsbysangam/ccaf-interactive-guide` (private). Local `origin` points there. Note the account: the Vercel team is connected to the `divingsbysangam` GitHub login, not the `gellasangameshgupta` CLI identity that authors commits — that's fine, just don't move the repo.
- **Vercel:** project `ccaf-interactive-guide` in team "Sangamesh Gella's projects", git-linked, production branch `main`. **Every push to `main` auto-deploys** — there is no separate deploy step. Static output, root directory, no framework. Commits must be authored as `divingsbysangam <sangameshgella@divingsbysangam.com>` (set repo-locally in `.git/config`) or Vercel blocks the git-triggered deploy.
- **Domain:** `ccaf-guide.divingsbysangam.com` — CNAME on Cloudflare DNS pointing at Vercel, Cloudflare proxy OFF (grey cloud). Keep it off; Vercel handles TLS and edge. The `vercel` CLI on this machine is logged into a *different* Vercel account — use the dashboard or the MCP for this project, not the CLI.
- **Dev loop:** edit files, open `index.html` directly in a browser (or regenerate `demos/scaffold-preview.html`, a single-file bundle of index+css+js used for the in-app preview pane, which cannot load external files). Verify with the Node smoke harness (see below), then commit and push.
- **Structure:** `index.html` (shell + hero) · `css/main.css` (design tokens + all styling) · `js/particles.js` (ambient layer, `CCAF_FX`) · `js/content.js` (ALL content as data: `CCAF_CARDS`, `CCAF_DRILLS`, `CCAF_MOCK_SAMPLES`, `CCAF_MOCK_LINKS`, `CCAF_STORY`) · `js/app.js` (hash router, card/quiz engines, localStorage progress). Content edits almost always mean editing `js/content.js` only.

## Source of truth

* `docs/plans/2026-08-10-001-feat-ccaf-interactive-guide-plan.md` — the Product Contract (requirements R1–R16, key decisions, flows, acceptance examples, scope boundaries). Read this before building anything; do not invent product behavior it doesn't cover.

* **Linear** (workspace `divings`, team Divings, project "CCA-F Interactive Guide"): v1 epics DIV-19/20/21/22 with sub-issues DIV-23–36 are all done or canceled (DIV-32 timer, DIV-33 export/import, DIV-36 glossary, DIV-31 Spotify were cut as v1 overkill). **Open work: epic DIV-38 "v1.1 redesign — clean, light, Brilliant-style + flashcard decks + accessibility"** — build order: DIV-49 theme/type/retire particles → DIV-50 deck engine → DIV-51 accessible drill feedback (P1) → DIV-52 skip link/headings/announcements → DIV-42 hero collapse → DIV-45 hint → DIV-41 waypoint mobile → DIV-47 focus styles. (DIV-39/40/43/44/46/48 were superseded by the redesign and canceled.) Each carries scope and acceptance. Plus the quarterly-refresh chain starting at DIV-37. Tickets carry per-feature UI direction and acceptance checklists; work them in dependency order. Update ticket status as work proceeds. (An identical older copy of the v1 board exists in the retired `sangampersonaldev` workspace — ignore it.)

* `CCA-F-Open-Source-Resources.md` — the annotated inventory of \~25 external prep resources the guide curates and links out to.

## Architecture (planned, per the plan)

Five-step **Journey Map** as the landing page (blueprint → reading → labs → drills → mock exam), each step opening layered "quick-bit" concept cards (default quick bit + two collapsed expanders: "from zero" and "how the exam twists this"). Progress, drill scores, and read-state live in **localStorage** — never a server. All "ambient" features (Spotify widget, study timer, export/import) and the glossary were cut as v1 overkill — do not reintroduce them without Sangam asking. Everything must run by opening local HTML files directly; deployment to Vercel must not change behavior.

## Visual identity (binding design decision — v1.1, decided 2026-08-18)

**Calm, light, reading-first, in the spirit of Brilliant.org** (plan R18–R20). The v1 dark ambient-particle identity is **retired** — do not reintroduce particles, glass, glow, or motion.

- **Palette (light only):** paper `#faf8f5`, card `#ffffff`, ink `#1c2330`, muted `#5b6675`, line `#e6e2dc`, accent blue `#2f6fdb`, done-gold `#c8901a`, success `#2f7d4a`. Two neutrals + one accent; colour means something (link/current/done/correct), never decoration. Every text pairing ≥ 4.5:1.
- **Type:** **Instrument Serif** for headings (single weight; size + italic accent carry hierarchy) + **Inter** for body/UI. Both OFL, **self-hosted under `assets/fonts/`** so file:// and offline work. Anthropic's own typefaces are proprietary — never use them.
- **Interaction model:** **flashcard decks** inside every step — one card/question at a time, domain tabs, dot strip, Prev/Next, keyboard (←/→, Space, A–D, N), swipe, "show as list" fallback. **Next marks the card read and advances.** The Journey Map stays a vertical list.
- **Accessibility is a requirement (WCAG 2.2 AA):** feedback never colour-only, focus never lost, skip link, strict heading outline, per-route titles/announcements. See `docs/ACCESSIBILITY-AUDIT-2026-08.md`.
- **References:** `demos/wireframe-brilliant-light.html` (theme/type) and `demos/wireframe-flashcards.html` (deck) — approved by Sangam. `demos/guide-particles-preview.html`, `demos/humanoid-avatar-demo.html`, and `js/particles.js` are historical v1 artifacts.

Until the redesign ships (epic DIV-38), the live site still shows the v1 dark look; the plan and tickets are the source of truth for where it's going.

## Content rules (legal — non-negotiable)

* Only original content or adaptations of openly licensed sources, with visible attribution and a credits entry. Verified licenses: daronyondem/claude-architect-exam-guide (CC BY 4.0), hamzafarooq/claude-certified-architect (MIT). Re-verify licenses at adaptation time.

* **Never** copy questions from claudecertificationguide.com or any third-party question bank, and never reproduce actual exam content (NDA). Original drill questions are style-inspired from the official blueprint only.

* External mock exams are linked (new tabs), not rebuilt.

* All exam-style questions, blocker stories, and adapted passages require Sangam's review before publishing.

## Workflow notes

* Sangam handles the Vercel account/domain transfer in parallel; it gates deployment (DIV-34) only — never local build work.

* This is a "living guide". The quarterly refresh is fully specified in **`docs/QUARTERLY-REFRESH.md`** — follow it, don't improvise. Key mechanics: the footer's "last verified" date is the single constant `CCAF_LAST_VERIFIED` at the top of `js/content.js` (bump it when a pass completes; the site turns it gold with a warning after 120 days); `node scripts/check-links.js` is the link-rot check; each quarter has a Linear ticket (first: DIV-37, due 2026-11-15) that instructs creating the next one.

* Inputs still owed by Sangam (tickets labeled `needs-sangam`): hero story + blocker narratives (DIV-25, post-launch content — a placeholder hero ships in v1), subdomain choice.

## Commands

No build or lint step. Two Node scripts, both run from the repo root:

```bash
node scripts/smoke-test.js "$PWD"    # run after any change to js/ — asserts routing, cards, drills, progress, hostile-localStorage safety
node scripts/build-preview.js        # run after any change to index.html/css/js — regenerates demos/scaffold-preview.html
node scripts/check-links.js          # quarterly: fetches every external URL in content.js + README, exits 1 on any failure
```

The smoke test stubs the DOM and drives `js/app.js` through its public `window.CCAF` surface (`steps`, `storage`, `progressOf`, `toggleCard`); extend it when adding features. Commit the regenerated preview bundle alongside the change.