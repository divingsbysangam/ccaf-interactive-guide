# Accessibility audit — live site, 2026-08-16

**Scope:** https://ccaf-guide.divingsbysangam.com, all five steps, desktop + 375px viewport. Method: DOM/ARIA inspection, computed contrast (WCAG 2.x formula), keyboard walkthrough, motion checks. **Target: WCAG 2.2 AA.** No automated scanner used; hand-audited. Findings are input to the v1.1 UX pass (Linear epic DIV-38).

**Overall:** the foundation is better than most hand-built sites — real landmarks, `lang`, labelled nav, real `<button>`s with `aria-pressed`, native `<details>`, `prefers-reduced-motion` honoured, canvas hidden from AT, body-text contrast excellent. The gaps cluster in three places: **the drills** (colour-only feedback + lost focus), **the "faint" colour token**, and **announcements/heading structure**. Nothing here requires a redesign; all are targeted fixes.

## Findings, by severity

### P1 — blocks or seriously degrades use for some users

| # | Finding | WCAG | Where | Fix direction |
|---|---|---|---|---|
| A1 | **Drill/mock feedback is colour-only.** After answering, correct = gold border, wrong = dimmed; there is no text or ARIA cue on the options themselves. Colour-blind and screen-reader users cannot tell which option was right. | 1.4.1 Use of Color; 4.1.2 | Drills, Mock samples | Add visible text badges ("✓ Correct" / "✗ Your answer") and `aria-label`s on options after answering; mark the explanation block `role="region" aria-live="polite"` so the reveal is announced. |
| A2 | **Focus is lost after answering.** The whole view re-renders on answer, so keyboard focus drops to `<body>`; a keyboard/SR user loses their place mid-quiz. Same on "Mark as read" (in-place update — fine) but the full re-render happens on answers and resets. | 2.4.3 Focus Order; 3.2 | Drills, Mock | After re-render, restore focus to the answered question's explanation heading (or the next unanswered question). Same for `data-reset`. |
| A3 | **"Faint" token fails AA for small text.** `--ink-faint #557a9e` = 4.2:1 on card, 4.4:1 on page (needs 4.5). Used for progress labels, "~2 min", domain meta, story signature. Footer `#3d5a78` = **2.75:1** (fails outright). | 1.4.3 Contrast (Minimum) | Everywhere | Lift `--ink-faint` to ≈`#6f93b8` (≥5:1) and footer to ≈`#5f7f9f`; one token change fixes most instances. |

### P2 — real barriers for keyboard / screen-reader users

| # | Finding | WCAG | Where | Fix direction |
|---|---|---|---|---|
| B1 | **No skip link.** Keyboard users tab through the hero + story every visit to reach the map/content. | 2.4.1 Bypass Blocks | Global | Visually-hidden "Skip to content" link as first focusable, targeting `#view`. |
| B2 | **Flat heading outline.** Home: H1 → H3 (no H2). Step pages: domain sections and cards are both H3, waypoints also H3 — an SR user navigating by headings can't distinguish domain from card. Drill questions have **no heading at all**. | 1.3.1 Info & Relationships; 2.4.6 | Home, Reading, Drills | Home map heading H2 (visually hidden ok); domains H3 → cards H4; waypoint H3; each drill question gets an H3 ("Question 1"). |
| B3 | **Route changes and progress updates aren't announced.** `#view` has `aria-live=polite` (good) but replacing the whole subtree is a poor announcement; `document.title` never changes per step; the progress chip (`#step-prog`) updates silently. | 2.4.2 Page Titled; 4.1.3 Status Messages | Global | Set `document.title` per route ("Reading · CCA-F Interactive Guide"); move focus to the step H2 on route change; make `#step-prog` `aria-live=polite`. |
| B4 | **Option group lacks structure.** The four options are bare buttons in a `<div>`; no group label ties them to the scenario. | 1.3.1; 4.1.2 | Drills, Mock | Wrap options in `role="group" aria-labelledby="<scenario id>"`; each option `aria-label="Option A: …"`. |
| B5 | **Reset is one click, no confirmation, and it re-renders (focus loss).** "Reset all answers" wipes 11 answers irreversibly. | 3.3.4 Error Prevention (advisory here) | Drills, Mock | Two-step confirm (button turns into "Confirm reset · Cancel") or an undo toast; keep focus. |
| B6 | **External links don't announce they open in a new tab.** | 3.2.5 (AAA, but best practice) | Blueprint, Mock | Visually-hidden "(opens in new tab)" or `aria-label` suffix; ↗ glyph already present on mock panel — mirror it on Blueprint links. |

### P3 — polish / robustness

| # | Finding | Where | Fix direction |
|---|---|---|---|
| C1 | Focus ring is the browser default (orange/blue) — visible (passes) but off-palette. Already **DIV-47**. | Global | In-palette `:focus-visible` ring, ≥3:1 against surfaces. |
| C2 | Card "Mark as read" button collapses to a squashed circle → tiny/odd target. Already **DIV-39**. | Reading, Labs | `white-space: nowrap`; ensure ≥24×24 target (2.5.8). |
| C3 | Breadcrumb "← Journey map" is a 15px-tall target. | Step pages | Add padding to reach ≥24px hit area (visual size can stay). |
| C4 | Long single-scroll steps with no in-page navigation (SR users have to walk 21 cards linearly). Already **DIV-43** (progress strip) — make the strip a `<nav aria-label="Domains">` so it doubles as SR navigation. | Reading, Drills | — |
| C5 | Hero story: three long paragraphs before the map on first visit; heavy for SR users too. Already **DIV-42**. | Home | Collapsed state must remain reachable/expandable by keyboard, with `aria-expanded`. |
| C6 | Waypoints render as `<aside>` — correct role — but the "From Sangam's journey" kicker isn't tied to the aside as its label. | Steps | `aria-labelledby` the kicker/title. |
| C7 | Particle canvas: honoured `prefers-reduced-motion` ✓, `aria-hidden` ✓. Cursor-repel is pointer-only, no keyboard equivalent needed (decorative). No issue — recorded for completeness. | — | — |
| C8 | Zoom/reflow: `viewport` meta correct, no `user-scalable=no`; layout is single-column so 400% zoom reflows. Passes 1.4.4/1.4.10 by inspection. | — | — |

## What passes cleanly (don't touch)

- `lang="en"`, semantic landmarks (`header/main/nav/footer/aside`), nav labelled.
- Body/heading text contrast 6.6–15:1 on all surfaces; buttons 6.9:1; ghost buttons 12.8:1.
- Real `<button type=button>` with `aria-pressed` for mark-as-read; native `<details>/<summary>` for lanes (keyboard + SR for free).
- Images: decorative mark has `alt=""`; canvas `aria-hidden="true"`.
- `prefers-reduced-motion` disables ambient animation and transitions.
- Option buttons are 58px tall (well over 24px minimum).
- No autoplaying media, no timeouts, no flashing.

## Recommended mapping onto DIV-38

- **New ticket, P1 (do first):** *Accessible drill feedback + focus management* = A1 + A2 + B4 + B5. This is the single most important accessibility fix on the site.
- **New ticket, P1:** *Contrast token lift* = A3 (small, mechanical, high impact).
- **New ticket, P2:** *Skip link, heading outline, route titles & announcements* = B1 + B2 + B3 + B6 + C3 + C6.
- Fold C1 → **DIV-47**, C2 → **DIV-39**, C4 → **DIV-43**, C5 → **DIV-42** as acceptance additions.

Suggested epic order becomes: A1/A2 drill accessibility → A3 contrast → bugs 39–41 → hero 42 → wayfinding 43–45 (with B1–B3 folded in) → polish 46–48.
