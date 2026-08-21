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
index.html          shell: Field System nav, subdomain bar, hero, inverse footer band
css/main.css        Divings Field System tokens and all styling
js/orb.js           the dot-lattice orbs (the site's entire motion budget)
js/icons.js         the twelve hairline outline icons, inline SVG
js/content.js       ALL content as data — cards, missions, drills, mock samples, story
js/app.js           hash router, flashcard deck engine, quiz engine, localStorage progress
assets/fonts/       self-hosted Instrument Serif + IBM Plex Sans/Mono (OFL)
assets/             brand mark (mark.svg), generated favicons, social preview image
scripts/            smoke test, contrast audit, preview-bundle build, link check
```

**Checks**

```bash
node scripts/smoke-test.js "$PWD"    # verifies routing, decks, drills, progress, accessibility markup, hostile-localStorage safety
node scripts/check-contrast.js       # WCAG 2.2 AA audit of every colour pairing the stylesheet uses
node scripts/build-preview.js        # regenerates demos/scaffold-preview.html (single-file bundle)
node scripts/build-og.js             # regenerates assets/og-image.png from scripts/og/og-source.html (needs local Chrome)
node scripts/build-icons.js          # regenerates the favicons + apple-touch icon from assets/mark.svg (needs local Chrome)
```

Pushes to `main` deploy automatically via Vercel.

## Licence

Two licences, because a study guide is two different things.

| | |
|---|---|
| **Code** (`js/`, `css/`, `scripts/`, `index.html` markup) | [MIT](LICENSE) |
| **Content** (cards, missions, drills, explanations, the story, the docs) | [CC BY 4.0](LICENSE-CONTENT) |

Reuse the content freely, including commercially, as long as you credit it and
say what you changed. Suggested line:

> "CCA-F Interactive Guide" by Gella Sangamesh Gupta, licensed under CC BY 4.0.
> https://ccaf-guide.divingsbysangam.com

Neither licence covers Anthropic's trademarks or exam material, which this
guide only references. The self-hosted typefaces are OFL 1.1.

## Content and licensing

- All cards, missions, questions, and explanations are **original writing**, style-inspired by the public exam blueprint. Nothing is reproduced from the actual exam (which is under NDA) or from any third-party question bank.
- Where content is adapted from openly licensed sources it carries attribution and a credits entry. Community mock exams are **linked, not copied**.
- Domain weights and exam logistics are re-verified against the official blueprint on a quarterly refresh; the guide shows its "last verified" date in the footer. When a source and the blueprint disagree, the blueprint wins.

## Contributing

Spotted an inaccuracy, a broken link, or a card that could be clearer? [Raise an issue](https://github.com/divingsbysangam/ccaf-interactive-guide/issues/new), or email <sangameshgella@divingsbysangam.com> if that's easier. Content lives almost entirely in `js/content.js`, so fixes are usually small, reviewable edits.

Drill questions, mock samples and the blocker stories are reviewed by Sangam before they change; everything else is fair game for a pull request.

## Design

The guide runs on the **Divings Field System** — the shared design system for
`divingsbysangam.com` and its subdomains. White ground, steel ink, formwork grey,
and one hot signal (safety orange) used for action, never decoration; Instrument
Serif for thought, IBM Plex Sans for product, IBM Plex Mono for coordinates;
square corners, hairline rules, no drop shadows. Subdomains inherit the tokens
and the chrome and may change density, not identity.

Two colour roles are darkened or lightened siblings of the hot signal
(`--color-primary-ink`, `--color-primary-on-inverse`) so small text on the chalk
band and on the inverse footer still clears WCAG 2.2 AA — `node scripts/check-contrast.js`
proves it on every run.

## Acknowledgements

The dot-lattice orbs that mark journey progress are in the spirit of
**[Jakub Antalik](https://antalik.com)**'s MIT *thinking-orbs* — reimplemented
from scratch here in vanilla 2D canvas, with thanks.

The open-source CCA-F community that made a guide like this possible, in particular the projects the Mock step links out to — see `CCA-F-Open-Source-Resources.md` for the full annotated inventory.

---

<p align="center"><sub>Not affiliated with or endorsed by Anthropic. Claude and Claude Certified Architect are trademarks of Anthropic, PBC.</sub></p>
