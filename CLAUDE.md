# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

A free, interactive study guide for Anthropic's **Claude Certified Architect – Foundations (CCA-F)** exam, built from Sangam's 977/1000 pass experience. It is a **static HTML site** — vanilla HTML/CSS/JS, no framework, no build step, no backend, no login. v1 is built and **live at https://ccaf-guide.divingsbysangam.com** (Vercel alias: ccaf-interactive-guide.vercel.app); work is ticketed in Linear.

## Repo, deploy, and dev loop

- **GitHub:** `divingsbysangam/ccaf-interactive-guide` (private). Local `origin` points there. Note the account: the Vercel team is connected to the `divingsbysangam` GitHub login, not the `gellasangameshgupta` CLI identity that authors commits — that's fine, just don't move the repo.
- **Vercel:** project `ccaf-interactive-guide` in team "Sangamesh Gella's projects", git-linked, production branch `main`. **Every push to `main` auto-deploys** — there is no separate deploy step. Static output, root directory, no framework. Commits must be authored as `divingsbysangam <sangameshgella@divingsbysangam.com>` (set repo-locally in `.git/config`) or Vercel blocks the git-triggered deploy.
- **Domain:** `ccaf-guide.divingsbysangam.com` — CNAME on Cloudflare DNS pointing at Vercel, Cloudflare proxy OFF (grey cloud). Keep it off; Vercel handles TLS and edge. The `vercel` CLI on this machine is logged into a *different* Vercel account — use the dashboard or the MCP for this project, not the CLI.
- **Dev loop:** edit files, open `index.html` directly in a browser (or regenerate `demos/scaffold-preview.html`, a single-file bundle of index+css+js used for the in-app preview pane, which cannot load external files). Verify with the Node smoke harness (see below), then commit and push.
- **Structure:** `index.html` (Field System chrome: nav, subdomain bar, hero, inverse footer band) · `css/main.css` (Field System tokens + all styling) · `js/orb.js` (`CCAF_ORB`, the dot-lattice orbs — the whole motion budget) · `js/icons.js` (`CCAF_ICONS`, the twelve hairline icons) · `js/content.js` (ALL content as data: `CCAF_CARDS`, `CCAF_DRILLS`, `CCAF_MOCK_SAMPLES`, `CCAF_MOCK_LINKS`, `CCAF_STORY`) · `js/app.js` (hash router, flashcard deck engine, quiz engine, localStorage progress). Content edits almost always mean editing `js/content.js` only. `js/particles.js` is deleted — do not bring it back.

## Source of truth

* `docs/plans/2026-08-10-001-feat-ccaf-interactive-guide-plan.md` — the Product Contract (requirements R1–R16, key decisions, flows, acceptance examples, scope boundaries). Read this before building anything; do not invent product behavior it doesn't cover.

* **Linear** (workspace `divings`, team Divings, project "CCA-F Interactive Guide"): v1 epics DIV-19/20/21/22 with sub-issues DIV-23–36 are all done or canceled (DIV-32 timer, DIV-33 export/import, DIV-36 glossary, DIV-31 Spotify were cut as v1 overkill). **Epic DIV-38 "v1.1 redesign — Divings Field System + flashcard decks + accessibility"** and all eight sub-issues (DIV-49 theme/orbs, DIV-50 deck engine, DIV-51 drill a11y, DIV-52 structure a11y, DIV-42 hero collapse, DIV-45 hint, DIV-41 waypoint mobile, DIV-47 focus) are **built locally and In Review as of 2026-08-20** — not committed, not pushed, so the live site still shows the v1 dark look. Each ticket carries a comment recording exactly what was applied and where its written scope was superseded by the Field System. Open items before they close: a VoiceOver pass, Sangam's visual review, `assets/og-image.png` still being the dark v1 artwork, and live verification after deploy. (DIV-39/40/43/44/46/48 were superseded and canceled.) Plus the quarterly-refresh chain starting at DIV-37. Update ticket status as work proceeds. (An identical older copy of the v1 board exists in the retired `sangampersonaldev` workspace — ignore it.)

* `CCA-F-Open-Source-Resources.md` — the annotated inventory of \~25 external prep resources the guide curates and links out to.

## Architecture (planned, per the plan)

Five-step **Journey Map** as the landing page (blueprint → reading → labs → drills → mock exam), each step opening layered "quick-bit" concept cards (default quick bit + two collapsed expanders: "from zero" and "how the exam twists this"). Progress, drill scores, and read-state live in **localStorage** — never a server. All "ambient" features (Spotify widget, study timer, export/import) and the glossary were cut as v1 overkill — do not reintroduce them without Sangam asking. Everything must run by opening local HTML files directly; deployment to Vercel must not change behavior.

## Visual identity (binding design decision — Divings Field System, adopted 2026-08-20)

**The guide runs on the Divings Field System**, the shared design system for `divingsbysangam.com` and every subdomain, authored in the **Paper file "Divings Design System"** (team Divings; pages `00 Foundations`, `02 Templates`). Paper is the source of truth — read it with the Paper MCP (`get_basic_info` returns the token set; page `02 Templates` holds the chrome) before changing anything visual. This **supersedes the v1.1 "Brilliant light" direction** (paper/blue/Inter) recorded in plan R18–R20: the guide is a subdomain, and Field System rule 04 is "subdomains share tokens and chrome; they may change density, not identity."

- **Field System rules:** 01 structure first (grid, type, rules before decoration) · 02 one hot signal (safety orange is the only loud colour — action, never wallpaper) · 03 writer + builder (serif for thought, sans for product, mono for coordinates) · 04 inherit, then flex.
- **Palette (light only, exact Paper token values):** background `#FFFFFF` · foreground/steel `#141413` · muted/formwork `#5C5A54` · border `#E4E2DC` · surface/chalk `#F4F3F0` · primary/safety `#E23B12` · inverse `#141413` / inverse-foreground `#F4F3F0` / inverse-muted `#A8A59C` · success `#2F6B3A` · warning `#C9A227` (fill only, 2.42:1) · danger `#C81E1E`.
- **Three AA siblings are ours, not Paper's** (documented at the top of `css/main.css`): `--color-primary-ink #C22F0A` (safety as small text, and as the fill behind white button labels — white on raw `#E23B12` is 4.31:1), `--color-primary-on-inverse #FF6A3D` (safety on the steel band), `--color-warning-ink #7A6112`. Raw `--color-primary` still carries every fill, rule and border. `node scripts/check-contrast.js` enforces all of this.
- **Type:** **Instrument Serif** (display, titles, quotes) + **IBM Plex Sans** (UI, body, product) + **IBM Plex Mono** (eyebrows, meta, labels, buttons — uppercase, `--tracking-wide`/`--tracking-wider`). All three **self-hosted under `assets/fonts/`** (OFL) so file:// and offline work; IBM Plex Sans ships as one variable face. Anthropic's own typefaces are proprietary — never use them.
- **Form:** square corners (`--radius` 0–4px), 1px hairline rules instead of boxes wherever possible, 4px spacing base, **no drop shadows, no gradients, no glass**. Chrome is nav → subdomain bar (chalk band, mono host in safety) → content at `--container-lg` with a 720px reading measure → inverse insight band as the footer.
- **Interaction model:** **flashcard decks** inside every step — one card/question at a time, domain tabs, dot strip, Prev/Next, keyboard (←/→, Space, 1/2, A–D, N), swipe, "show as list" fallback. **Next marks the card read and advances.** The Journey Map stays a rule-separated vertical list.
- **Accessibility is a requirement (WCAG 2.2 AA):** feedback never colour-only, focus never lost (and never a ring on a programmatically focused heading), skip link, strict heading outline, per-route titles/announcements. See `docs/ACCESSIBILITY-AUDIT-2026-08.md`.
- **Orbs and icons are frozen carry-overs — do not restyle them.** The journey-step nodes are **dot-lattice globes** (`js/orb.js`, ported verbatim from `demos/wireframe-orbs.html`; in the spirit of Jakub Antalik's MIT *thinking-orbs*, reimplemented, credited in the README). Grey = ahead (still), **blue** = current (slow rotation), **gold** = done (still). Their grey/blue/gold palette is deliberately *not* Field System tokens; it is an approved asset kept unchanged. They appear on the map (48px), tiny in step headers (22px), and beside the brand in the hero (64px) — nowhere else; `prefers-reduced-motion` freezes them. This is the site's entire motion budget. The twelve hairline icons (`js/icons.js`, 1.5px stroke, inline SVG) are likewise carried over unchanged from `demos/wireframe-components.html`.
- **References:** the Paper file first; then `demos/wireframe-orbs.html` (orbs) and `demos/wireframe-components.html` (icons) as the frozen asset sources. `demos/wireframe-brilliant-light.html` and `demos/wireframe-flashcards.html` are the superseded v1.1 theme study and the still-valid deck study. `demos/guide-particles-preview.html` and `demos/humanoid-avatar-demo.html` are historical v1 artifacts.

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
node scripts/smoke-test.js "$PWD"    # run after any change to js/ — asserts routing, decks, drills, progress, accessibility markup, hostile-localStorage safety
node scripts/check-contrast.js       # run after any change to the palette — WCAG 2.2 AA audit read straight out of css/main.css
node scripts/build-preview.js        # run after any change to index.html/css/js — regenerates demos/scaffold-preview.html
node scripts/build-og.js             # run after a brand/palette change — redraws assets/og-image.png from scripts/og/og-source.html (needs local Chrome)
node scripts/check-links.js          # quarterly: fetches every external URL in content.js + README, exits 1 on any failure
```

The smoke test stubs the DOM and drives `js/app.js` through its public `window.CCAF` surface (`steps`, `storage`, `progressOf`, `toggleCard`); extend it when adding features. Commit the regenerated preview bundle alongside the change.