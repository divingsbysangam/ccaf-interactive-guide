<p align="center">
  <img src="assets/mark.svg" width="88" height="88" alt="CCA-F Interactive Guide mark">
</p>

<h1 align="center">CCA-F Interactive Guide</h1>

<p align="center">
  A free, interactive five-step study guide for Anthropic's <strong>Claude Certified Architect – Foundations</strong> exam —<br>
  built from a 977/1000 pass. No login, no ads, nothing to install.
</p>

<p align="center">
  <a href="https://ccaf-guide.divingsbysangam.com"><strong>ccaf-guide.divingsbysangam.com</strong></a>
</p>

---

## What it is

Most CCA-F prep out there is reading-heavy: repos, PDFs, question dumps. This guide is a **journey map** — five steps in the order that actually works, each opening into bite-sized "quick-bit" concept cards you can read in two minutes:

| Step | What you get |
|---|---|
| **1 · Blueprint** | How the exam works, the five domains and their weights, and the official sources worth your time |
| **2 · Reading** | 21 concept cards across all five domains, grouped and weighted like the exam |
| **3 · Labs** | Five build-it-yourself missions in Claude Code — the exam tests judgment, and judgment comes from building |
| **4 · Drills** | 11 original analogy-style questions that train *recognition*: the scenario never names the concept, all four options sit close, and every option's explanation teaches the disguise |
| **5 · Mock** | Sample questions to set expectations, then a curated panel of full-length community mocks — and the link to book your seat |

Every card has two optional layers: **"From zero"** (plain language plus an analogy from a familiar platform — Salesforce, in the author's case) and **"How the exam twists this"** (the recognition cues for exam day). Woven through the steps are three **blocker waypoints** from the author's own prep — the walls he hit and how he got past them.

Progress (cards read, missions done, drill scores) lives in your browser's localStorage. Nothing is sent anywhere.

## Who made it

[Sangam](https://divingsbysangam.com) — a Salesforce consultant who crossed into agent-native architecture by building things (custom MCP servers, personal agents, voice AI), sat CCA-F, scored 977/1000, and wanted the next person to have a clearer path than he did. The through-line of the guide is his own confession: *build, learn, and then you can crack CCA-F.*

## Running it locally

There's no build step. Clone and open:

```bash
git clone https://github.com/divingsbysangam/ccaf-interactive-guide.git
cd ccaf-interactive-guide
open index.html        # or double-click it
```

The site is vanilla HTML/CSS/JS with zero dependencies — the same files that are deployed are the ones you open.

**Structure**

```
index.html          shell + hero
css/main.css        design tokens and all styling
js/particles.js     the ambient particle layer (the guide's visual identity)
js/content.js       ALL content as data — cards, missions, drills, mock samples, story
js/app.js           hash router, card + quiz engines, localStorage progress
assets/             logo mark, favicons, social preview image
scripts/            smoke test + preview-bundle build
```

**Checks**

```bash
node scripts/smoke-test.js "$PWD"    # verifies routing, cards, drills, progress, and hostile-localStorage safety
node scripts/build-preview.js        # regenerates demos/scaffold-preview.html (single-file bundle)
```

Pushes to `main` deploy automatically via Vercel.

## Content and licensing

- All cards, missions, questions, and explanations are **original writing**, style-inspired by the public exam blueprint. Nothing is reproduced from the actual exam (which is under NDA) or from any third-party question bank.
- Where content is adapted from openly licensed sources it carries attribution and a credits entry. Community mock exams are **linked, not copied**.
- Domain weights and exam logistics are re-verified against the official blueprint on a quarterly refresh; the guide shows its "last verified" date in the footer. When a source and the blueprint disagree, the blueprint wins.

## Contributing

Spotted an inaccuracy, a broken link, or a card that could be clearer? Open an issue. Content lives almost entirely in `js/content.js`, so fixes are usually small, reviewable edits.

## Acknowledgements

The open-source CCA-F community that made a guide like this possible, in particular the projects the Mock step links out to — see `CCA-F-Open-Source-Resources.md` for the full annotated inventory.

---

<p align="center"><sub>Not affiliated with or endorsed by Anthropic. Claude and Claude Certified Architect are trademarks of Anthropic, PBC.</sub></p>
