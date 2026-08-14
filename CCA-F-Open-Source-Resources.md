# CCA-F (Claude Certified Architect – Foundations) — Open-Source Resource Library

> Compiled 2026-08-10. Star counts are approximate as of that date.
> CCA-F is **Anthropic's Claude Certified Architect – Foundations** certification (sometimes written CCAR-F):
> $125 · 60 multiple-choice questions · 120 minutes · proctored via Pearson VUE.
>
> **The 5 exam domains (with weights):**
> 1. Agentic Architecture & Orchestration — 27%
> 2. Claude Code Configuration & Workflows — 20%
> 3. Prompt Engineering & Structured Output — 20%
> 4. Tool Design & MCP Integration — 18%
> 5. Context Management & Reliability — 15%

---

## 1. Official Anthropic Resources

| Resource | Link |
|---|---|
| Official certification page (Anthropic Academy / Skilljar) | https://anthropic.skilljar.com/claude-certified-architect-foundations-certification/444989 |
| Partner Academy page (exam guide PDF, blueprint, policies) | https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification |
| Support | academy-support@anthropic.com |

---

## 2. The Repo You Shared (starting point)

### [sarveshtalele/claude-architect-exam-guide](https://github.com/sarveshtalele/claude-architect-exam-guide) — ~149 ★
Prep guide for **both CCA-F (Foundations) and CCA-P (Professional)**, deliberately written for non-technical learners as well as engineers.
- Two folders: `foundations/` and `professional/`
- Official exam guide PDFs + blueprints for each tier
- **Claude Skills files** — slash-command study coaches with diagnostic and mock-test modes
- Three copy-paste prompt packs per tier: Learning · Practice · Mock Test
- No leaked questions — practice content generated from official blueprints
- Author documents their own certification journey (Medium/Substack)

---

## 3. Major Community Study Guides (comparable or bigger)

### [daronyondem/claude-architect-exam-guide](https://github.com/daronyondem/claude-architect-exam-guide) — ~1,000 ★ (largest)
The most popular community guide. 11 knowledge areas in one long-form `exam-preparation-guide.md`:
API fundamentals, tool interface design, error handling in agent tools, structured extraction, context management, system prompts, MCP, agentic/multi-agent patterns, customer-service workflow design, Claude Code & Agent SDK, evals/batch processing.
- PDF + EPUB builds via GitHub Releases (Pandoc scripts included)
- "Core concepts + common pitfalls" per section, plus cheat sheets
- CC BY 4.0 licensed

### [hamzafarooq/claude-certified-architect](https://github.com/hamzafarooq/claude-certified-architect) — ~130 ★
- **Interactive 64-question practice exam** (`practice-exam.html`, runs in any browser)
- 5 domain cheat sheets, each opening with "global rules that resolve most questions" + common exam traps
- Sample questions with detailed explanations
- Memorable framing: *"prompts are probabilistic, hooks are deterministic"*
- MIT licensed

### [aderegil/claude-certified-architect](https://github.com/aderegil/claude-certified-architect) — ~92 ★
**Guided hands-on labs**: 6 scenarios, 5 domains, 30 tasks. Best for learning-by-doing rather than reading.

### [dnacenta/claude-certified-architect](https://github.com/dnacenta/claude-certified-architect) — ~69 ★
- All 5 domains with explanations, code examples, anti-patterns, decision frameworks, practice questions
- Published as a **website** (dnacenta.github.io) + downloadable PDF
- Bonus: overview guides for the sibling certifications (CCAO-F, CCA-P, CCDV-F)
- Includes exam logistics + a 4-week study plan; refreshed July 2026

### [ujjwalbsoni/claude-architect-foundations-study-guide](https://github.com/ujjwalbsoni/claude-architect-foundations-study-guide)
"Production-grade" self-paced course: 5 weighted domain modules, **runnable Python** (anthropic SDK + MCP), 50 scenario-based MCQs, mini-labs, cheatsheet, 4-week study plan. Code-first approach.

### [hegdesumanth/claude-certified-architect-guide](https://github.com/hegdesumanth/claude-certified-architect-guide)
All 5 domains + 6 production scenarios, recommended Anthropic Academy courses, key-concepts checklist for Claude API, Agent SDK, Claude Code, and MCP.

### [jamesbuckett/ccaf-exam-tutorial](https://github.com/jamesbuckett/ccaf-exam-tutorial) — ~14 ★
Self-contained **single-file HTML workbook** with 8 runnable tutorials covering every domain, plus a companion visual study guide. (Interesting model for your own interactive guide.)

---

## 4. Practice Exams & Quiz Apps

| Repo | What it is |
|---|---|
| [mominurr/cca-f-mock-exam](https://github.com/mominurr/cca-f-mock-exam) | Full mock exam: 60 domain-aligned questions with a 120-minute timer (mirrors real format) |
| [kamiimeteor/cca-f-dojo](https://github.com/kamiimeteor/cca-f-dojo) | Bilingual practice app, 163 questions, works offline |
| [pankajarm/cca-f-game](https://github.com/pankajarm/cca-f-game) | Gamified practice-exam app |
| [shourabhmodak/claude-certified-architect-exam-prep](https://github.com/shourabhmodak/claude-certified-architect-exam-prep) | 6 practice tests + 5 domain cheat sheets, scenario-based |

## 5. Cheat Sheets, Awesome Lists & Niche Repos

| Repo | What it is |
|---|---|
| [mbcltd/awesome-claude-certification](https://github.com/mbcltd/awesome-claude-certification) | Curated list across all Claude certifications |
| [devopsyields/awesome-cca-f](https://github.com/devopsyields/awesome-cca-f) | Curated CCA-F resources organized by domain |
| [DaStru/cca-f-cheat-sheet](https://github.com/DaStru/cca-f-cheat-sheet) | Personal quick-reference cheat sheet |
| [AgustinVillagran/cca-f-study-guide](https://github.com/AgustinVillagran/cca-f-study-guide) | Mental models + quick references (no exam questions) |
| [kenortiz/ccaf-marcus-files](https://github.com/kenortiz/ccaf-marcus-files) | Story-driven, hands-on study guide |
| [cyrus-tt/cca-f-complete-guide-cn](https://github.com/cyrus-tt/cca-f-complete-guide-cn) | Chinese-language guide: 25 chapters, 6 domains, self-assessments |
| [tinesoft/cca-f](https://github.com/tinesoft/cca-f) | Training & prep guide |
| [parmar-m/claude-architect-certification-prep](https://github.com/parmar-m/claude-architect-certification-prep) | Foundation + Professional prep |
| [avidevelops/claude-architect-exam-prep](https://github.com/avidevelops/claude-architect-exam-prep) | Exam prep materials |
| [paullarionov/claude-certified-architect](https://github.com/paullarionov/claude-certified-architect) | Study materials |
| [rkendev/claude-mcp-server-minimal](https://github.com/rkendev/claude-mcp-server-minimal) | Minimal MCP server implementation (Domain 4 fundamentals) |
| [rkendev/claude-mcp-patterns-audit](https://github.com/rkendev/claude-mcp-patterns-audit) | Audit of production MCP servers — patterns & anti-patterns |
| [tedzoe/AdoptViaAI](https://github.com/tedzoe/AdoptViaAI) | CLI demo touching all 5 domains (chat, tool use, agents, guardrails) |
| [schinchli/cloud-certification-exam-prep](https://github.com/schinchli/cloud-certification-exam-prep) | Multi-cert prep (AWS SAA/SAP, GCP ACE/PCA) **plus** a CCA-F exam guide PDF |
| [raul-sq/cca-f-solutions](https://github.com/raul-sq/cca-f-solutions) | Verified solutions to 4 CCA-F prep exercises (Spanish) |

**GitHub topic pages to watch for new repos:**
- https://github.com/topics/cca-f
- https://github.com/topics/cca-f-study-guide

## 6. Courses, Articles & Free Websites

| Resource | Notes |
|---|---|
| [freeCodeCamp CCA-F prep article](https://www.freecodecamp.org/news/claude-certified-architect-foundations-prep-for-anthropic-s-new-certification-exam/) | Announces the full free video prep course by Andrew Brown (ExamPro) on freeCodeCamp's YouTube |
| [Claude Certification Guide](https://claudecertificationguide.com/) | Free: 30 lessons, 250+ practice questions, full mock exam |
| [claudecertifiedarchitects.com](https://www.claudecertifiedarchitects.com/) | Practice tests, exam prep, registration walkthrough |
| [anthropiccertifications.com](https://www.anthropiccertifications.com/) | CCA-F study platform |
| [DEV: "The Claude Certified Architect Exam: 5 Domains, 6 Scenarios"](https://dev.to/aws-builders/the-claude-certified-architect-exam-5-domains-6-scenarios-and-everything-you-need-to-know-4le3) | Good structural overview of the exam |
| [Claude Directory — certification program overview](https://www.claudedirectory.org/blog/anthropic-claude-certification-program) | Explains the proctored Skilljar/Pearson VUE process |

---

## Suggested study stack (if building an interactive guide from these)

1. **Blueprint + official PDFs** → sarveshtalele repo or the official Skilljar page
2. **Deep reading** → daronyondem (breadth, 1k★) + dnacenta (domain-by-domain structure)
3. **Hands-on** → aderegil labs (30 tasks) or jamesbuckett's single-file HTML workbook
4. **Code-first drills** → ujjwalbsoni (runnable Python, SDK + MCP)
5. **Assessment** → hamzafarooq interactive exam (64 q) + mominurr timed mock (60 q / 120 min)
