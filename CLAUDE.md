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

* **Linear** (workspace `divings`, team Divings, project "CCA-F Interactive Guide"): v1 epics DIV-19/20/21/22 with sub-issues DIV-23–36 are all done or canceled (DIV-32 timer, DIV-33 export/import, DIV-36 glossary, DIV-31 Spotify were cut as v1 overkill). **Open work: epic DIV-38 "v1.1 UX pass"** — ten tickets DIV-39–48 in a decided order (bugs 39–41 → hero auto-collapse 42 → wayfinding 43–45 → polish 46–48); each carries fix direction and acceptance. Plus the quarterly-refresh chain starting at DIV-37. Tickets carry per-feature UI direction and acceptance checklists; work them in dependency order. Update ticket status as work proceeds. (An identical older copy of the v1 board exists in the retired `sangampersonaldev` workspace — ignore it.)

* `CCA-F-Open-Source-Resources.md` — the annotated inventory of \~25 external prep resources the guide curates and links out to.

## Architecture (planned, per the plan)

Five-step **Journey Map** as the landing page (blueprint → reading → labs → drills → mock exam), each step opening layered "quick-bit" concept cards (default quick bit + two collapsed expanders: "from zero" and "how the exam twists this"). Progress, drill scores, and read-state live in **localStorage** — never a server. All "ambient" features (Spotify widget, study timer, export/import) and the glossary were cut as v1 overkill — do not reintroduce them without Sangam asking. Everything must run by opening local HTML files directly; deployment to Vercel must not change behavior.

## Visual identity (binding design decision)

The guide's look is a **subtle ambient particle system** (plan R16). Reference implementation: `demos/guide-particles-preview.html` — dark calm base, three depth layers of slow drifting particles, sparks along the journey path, gentle bursts on completion, warm-gold "done" nodes. Rules: particles always render *behind* content, motion is slow and dim, text is never obstructed, `prefers-reduced-motion` disables ambient animation. Vanilla canvas by default; adopt tsParticles/Three.js only when a specific effect demands it. `demos/humanoid-avatar-demo.html` is an earlier experiment, superseded — do not extend it.

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