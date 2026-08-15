# Quarterly refresh — maintainer checklist

The guide is a *living* guide (plan R15). This pass keeps it honest against a fast-moving exam. Run it **every quarter, or sooner after any major Anthropic release** (new model family, blueprint revision, big Claude Code / MCP / Agent SDK change). The footer's "last verified" date should never be older than about four months; the site turns it gold with a hover warning at 120 days.

Budget: 60–90 minutes for a clean pass. Do it in a branch or straight on `main` — every push to `main` auto-deploys.

## 0 · Before you start

- [ ] Note today's date and the current `CCAF_LAST_VERIFIED` value at the top of `js/content.js`.
- [ ] Open the official certification page: https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification and download the current **exam guide / blueprint PDF**.

## 1 · Blueprint deltas (highest priority — everything else hangs off this)

Compare the fresh PDF against what the guide states.

- [ ] **Exam format** — question count, duration, price, delivery (Pearson VUE), scoring. Lives in the Blueprint step card `exam-at-a-glance` (`js/content.js`).
- [ ] **Domain names and weights** — currently 27 / 20 / 20 / 18 / 15. Lives in **two** places that must agree: the `DOMAINS` array in `js/app.js` and the Blueprint card `five-domains` in `js/content.js`. (Also mentioned in `README.md`.)
- [ ] **Task statements per domain** — skim for new or removed topics. For each new topic: is there a Reading card? a drill? If not, add one (see §5). For each removed topic: retire or reframe the card so it doesn't teach something the exam no longer asks.
- [ ] If any of the above changed materially, note it in the commit message and consider a one-line "What changed" note in the Blueprint step.

## 2 · Anthropic platform drift (does the *content* still describe reality?)

Skim the current docs and release notes:

- Platform docs — https://platform.claude.com/docs
- Claude Code docs — https://code.claude.com/docs
- Release notes — https://platform.claude.com/docs/en/release-notes/overview

Check for changes that would make a card wrong or stale:

- [ ] **Model lineup** — model names/tiers referenced anywhere (Mock sample `m-triage-model` talks about tiers generically; keep it generic).
- [ ] **Claude Code surface** — CLAUDE.md, hooks (event names!), skills, permissions, headless/CI mode. Cards: `claude-md-brief`, `hooks-deterministic`, `skills-package-workflows`, `permissions-least-privilege`, `headless-ci`. Lab Mission 2 depends on hook event names.
- [ ] **MCP** — the three primitives (tools / resources / prompts), config mechanics. Cards: `mcp-in-90s`; Lab Mission 1.
- [ ] **Structured outputs / batch / caching / thinking** — feature names and semantics. Cards: `structured-output-json`, `let-it-think`; Mock samples `m-nightly-tickets`, `m-shared-prefix`.
- [ ] **Agent SDK / Managed Agents** — naming and positioning. Card: `api-sdk-code`.
- [ ] Anything terminology-level that a learner would type into a search and find renamed.

## 3 · Link rot

Every external link must resolve and still be what we say it is.

- [ ] Run the automated check:

  ```bash
  node scripts/check-links.js
  ```

  It extracts every `https://` URL from `js/content.js` and `README.md`, requests each, and reports non-2xx/3xx or timeouts. Fix or replace anything flagged.
- [ ] Manually eyeball the **Mock step external panel** (`CCAF_MOCK_LINKS`): is each project still maintained? Still a *mock exam* and not something else? Do the one-line "what it's good for" notes still hold (question counts, timer, offline)? Drop entries that have gone stale; consider adding a strong new one from `CCA-F-Open-Source-Resources.md` or the `cca-f` GitHub topic.
- [ ] Official links in the Blueprint `official-sources` card still land on the right pages (Skilljar URLs have moved before).

## 4 · Content & licensing hygiene

- [ ] Any card that *adapts* openly-licensed material must still carry attribution — and re-verify the source's licence hasn't changed (currently everything is original writing, so this is a no-op unless that changed).
- [ ] Nothing in the guide reproduces exam questions or third-party question-bank content. If a contributor added questions, review them against this rule.
- [ ] Re-read the drills once as if you were sitting the exam again: do the "exam twist" cues still match how the exam actually asks? Sangam is the authority here.

## 5 · Adding or changing content (if §1–2 turned anything up)

Everything is data in `js/content.js`:

- **Reading card:** add to `CCAF_CARDS.reading` with `domain` set to one of `agentic | claude-code | prompting | tools-mcp | context`. Shape: `{ id, domain, title, minutes, quick, fromZero, examTwist }`. Keep the quick bit ~2 minutes; the two lanes are optional-depth.
- **Drill:** add to `CCAF_DRILLS`. Scenario must not name the concept; four close options; every option's `explain` teaches why it's tempting / what distinguishes the right one. Set `correct` to the index.
- **Lab mission:** add to `CCAF_CARDS.labs` with `...MISSION_LANES`.
- Keep per-domain card counts roughly proportional to exam weight.

Then:

- [ ] `node scripts/smoke-test.js "$PWD"` passes (it asserts counts — bump the expected numbers in the test if you intentionally added questions).
- [ ] `node scripts/build-preview.js` to regenerate the preview bundle.

## 6 · Ship

- [ ] Bump `CCAF_LAST_VERIFIED` in `js/content.js` to today's date (ISO, `YYYY-MM-DD`).
- [ ] Commit with a message that summarises what changed, e.g. `chore(refresh): 2026-Q4 pass — weights unchanged, 2 links replaced, hooks card updated`.
- [ ] Push to `main` (author identity must be `divingsbysangam` — see CLAUDE.md). Confirm the Vercel deployment goes READY.
- [ ] Open https://ccaf-guide.divingsbysangam.com in a private window: footer shows the new date, no console errors, one card and one drill work.
- [ ] Close the quarter's reminder ticket in Linear (project "CCA-F Interactive Guide"), and make sure the next one exists.

## If a pass finds nothing to change

That's a valid outcome — still bump the date and ship. The date is a promise that someone *looked*, not that something changed.
