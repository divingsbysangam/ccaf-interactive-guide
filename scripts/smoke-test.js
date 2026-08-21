// Smoke test for js/app.js + js/icons.js + js/content.js. Run from the repo root:
//   node scripts/smoke-test.js "$PWD"
// It stubs the DOM, loads the scripts, drives the router / deck / card APIs,
// and asserts the rendered HTML matches the tickets' acceptance criteria
// (DIV-49 theme + orbs, DIV-50 decks, DIV-51 drill a11y, DIV-52 structure,
//  DIV-42 hero collapse, DIV-45 first-visit hint, DIV-41 waypoints).
const fs = require('fs');
const path = require('path');

const els = {};
function makeEl(id) {
  return {
    id, innerHTML: '', textContent: '', title: '',
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
    setAttribute() {}, getAttribute: () => null,
    focus() {},
    classList: {
      _s: new Set(),
      add(c) { this._s.add(c); }, remove(c) { this._s.delete(c); },
      contains(c) { return this._s.has(c); },
      toggle(c, on) { if (on) this._s.add(c); else this._s.delete(c); },
    },
  };
}
els.view = makeEl('view');
els.hero = makeEl('hero');
els.story = makeEl('story');
els['hero-cta'] = makeEl('hero-cta');
els['route-announce'] = makeEl('route-announce');
els['step-prog'] = makeEl('step-prog');
els['last-verified'] = makeEl('last-verified');
els['foot-social'] = makeEl('foot-social');

const listeners = {};
global.window = global;
global.document = {
  title: '',
  activeElement: null,
  getElementById: (id) => els[id] || null,
  querySelector: () => null,
  querySelectorAll: () => [],
  createElement: () => ({ getContext: () => null, width: 0, height: 0, style: {}, setAttribute() {}, dataset: {} }),
  addEventListener: (ev, fn) => { (listeners['doc:' + ev] = listeners['doc:' + ev] || []).push(fn); },
};
global.location = { hash: '' };
global.addEventListener = (ev, fn) => { (listeners[ev] = listeners[ev] || []).push(fn); };
global.scrollTo = () => {};
global.innerWidth = 1440;
global.matchMedia = () => ({ matches: false });
const store = {};
global.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
};

const root = process.argv[2];
// eval is intentional and safe here: this harness executes our own local
// first-party files (no untrusted input) inside the stubbed globals.
eval(fs.readFileSync(path.join(root, 'js/icons.js'), 'utf8'));
eval(fs.readFileSync(path.join(root, 'js/content.js'), 'utf8'));
eval(fs.readFileSync(path.join(root, 'js/app.js'), 'utf8'));

const fail = (msg) => { console.error('FAIL:', msg); process.exit(1); };
const rerender = () => listeners.hashchange.forEach((f) => f());
const go = (hash) => { location.hash = hash; rerender(); return els.view.innerHTML; };
const list = (stepId, on) => { CCAF.storage.setListMode(stepId, on !== false); };

// ------------------------------- 0z) static footer guarantees (index.html)
// These live in index.html rather than being rendered by app.js, so the DOM
// harness can't see them — assert on the source instead. They are legal /
// trust-critical, so a silent removal should fail the build.
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const needle of [
  'Independent and unofficial',
  'Not affiliated with, endorsed by, or sponsored by Anthropic',
  'original writing, and this guide carries no',
  'trademarks of Anthropic, PBC',
  'mailto:sangameshgella@divingsbysangam.com',
  // shown as text too: a mailto: that no handler answers must still leave a
  // readable address behind, or the feedback route silently disappears
  '<span class="addr">sangameshgella@divingsbysangam.com</span>',
  'https://github.com/divingsbysangam/ccaf-interactive-guide/issues/new',
  'Raise an issue',
]) if (!indexHtml.includes(needle)) fail(`footer is missing required text: ${needle.replace(/\n\s+/g, ' ')}`);

// exam facts that readers act on — a silent edit here misinforms someone
const contentSrc = fs.readFileSync(path.join(root, 'js/content.js'), 'utf8');
if (!/720 is the pass mark/.test(contentSrc)) fail('pass mark (720) missing from the blueprint card');
if (!/valid for 12 months/.test(contentSrc)) fail('certification validity (12 months) missing from the blueprint card');
if (/multiple[- ]response/i.test(contentSrc)) fail('the exam is single-answer multiple choice: do not describe multiple-response items');
if (!/select all that apply/i.test(contentSrc)) fail('the single-answer note went missing from the blueprint card');

// -------------------------------------------------- 0a) footer socials
const soc = els['foot-social'].innerHTML;
for (const u of [
  'https://www.linkedin.com/in/gella-sangamesh-gupta-a35b5b1b8/',
  'https://x.com/sangamesh_gupta',
  'https://gellasangameshgupta.substack.com/',
  'https://www.youtube.com/@divingsbysangam',
]) if (!soc.includes(u)) fail(`footer social link missing: ${u}`);
if ((soc.match(/class="ico-brand"/g) || []).length !== 4) fail('each social link needs its brand mark');
if ((soc.match(/target="_blank" rel="noopener me"/g) || []).length !== 4) fail('socials must be new-tab, rel=noopener me');
if ((soc.match(/\(opens in new tab\)/g) || []).length !== 4) fail('socials must announce the new tab (DIV-52 B6)');
for (const n of ['LinkedIn', 'X', 'Substack', 'YouTube']) if (!soc.includes(`>${n}<`)) fail(`social needs a text label: ${n}`);

// ---------------------------------------------------------------- 0) hero
// story renders in full on a fresh visit; CTA starts as "Start with the Blueprint"
if (!els.story.innerHTML.includes('977/1000')) fail('hero story missing the score');
if (!els.story.innerHTML.includes('Salesforce consultant')) fail('hero story lead missing');
if (!els.story.innerHTML.includes('— Sangam')) fail('hero story signature missing');
if (els.story.innerHTML.includes('<details')) fail('fresh visit should show the whole story (DIV-42)');
if (!els['hero-cta'].innerHTML.includes('Start with the Blueprint')) fail('fresh CTA should be Start');

// ---------------------------------------------------- 1) journey map (DIV-45/49)
let html = els.view.innerHTML;
for (const t of ['Blueprint', 'Reading', 'Labs', 'Drills', 'Mock Exam']) {
  if (!html.includes(t)) fail(`map missing step ${t}`);
}
if ((html.match(/not started/g) || []).length < 5) fail('expected a "not started" label per step');
if (!html.includes('href="#/step/blueprint"')) fail('step link missing');
if ((html.match(/canvas class="orb"/g) || []).length !== 5) fail('expected one dot-lattice orb per step (DIV-49)');
if (!html.includes('data-state="current"')) fail('first unfinished step should carry the current orb');
if ((html.match(/data-state="ahead"/g) || []).length !== 4) fail('the other four orbs should be "ahead"');
if (!html.includes('progress just stays in this browser')) fail('first-visit hint missing (DIV-45)');
if (!html.includes('<h2 class="sr-only">Your journey</h2>')) fail('map H2 missing (DIV-52 B2)');

// ------------------------------------------------- 2) reading deck (DIV-50)
const READING = CCAF_CARDS.reading;
html = go('#/step/reading');
if (!html.includes('<h1 class="sr-only">')) fail('step page needs an H1 (DIV-52 B2)');
if (!html.includes('aria-roledescription="flashcard"')) fail('deck card missing flashcard semantics');
if (!html.includes('aria-live="polite"')) fail('deck stage must be a live region');
if ((html.match(/<article class="card/g) || []).length !== 1) fail('deck must show exactly one card at a time');
if (!html.includes(READING[0].title)) fail('deck should open on the first card');
if (!html.includes('role="tablist"')) fail('domain tabs missing');
if (!html.includes('class="dots"')) fail('dot strip missing');
if (!html.includes('data-deck="prev" disabled')) fail('Previous must be disabled on the first card');
if (!html.includes('as a list')) fail('list fallback link missing');
if (/<details class="lane[^>]*\sopen/.test(html)) fail('lanes must be collapsed by default (AE1)');
if (!html.includes('From zero')) fail('"from zero" lane missing');
if (!html.includes('How the exam twists this')) fail('exam-twist lane missing');
if (!html.includes('Mark as read')) fail('mark-as-read control missing');
if (!html.includes('27% of the exam')) fail('domain weight missing from the deck header');
if (!html.includes('class="waypoint"')) fail('reading waypoint missing');
if (!html.includes('mindset shift')) fail('reading waypoint should be blocker 1');
if (!html.includes('From Sangam')) fail('waypoint kicker missing');
if (!html.includes('aria-labelledby="wp-reading"')) fail('waypoint needs an accessible name (DIV-52 C6)');
if (document.title !== 'Reading · CCA-F Interactive Guide') fail(`route title not set, got "${document.title}"`);

// Next marks the card read AND advances (Sangam's decision)
CCAF.deckNext(CCAF.steps.find((s) => s.id === 'reading'));
if (!CCAF.storage.cardsRead('reading')[READING[0].id]) fail('Next should mark the current card read');
if (CCAF.storage.deckPos('reading') !== 1) fail('Next should advance one card');
html = els.view.innerHTML;
if (!html.includes('data-deck="prev" disabled')) { /* expected: prev now enabled */ } else fail('Previous should be enabled after advancing');

// Prev returns to re-read, without unmarking
CCAF.deckMove(CCAF.steps.find((s) => s.id === 'reading'), -1);
if (CCAF.storage.deckPos('reading') !== 0) fail('Previous should step back');
if (!CCAF.storage.cardsRead('reading')[READING[0].id]) fail('Previous must not unmark the card');

// position persists across a route change
go('#/');
html = go('#/step/reading');
if (CCAF.storage.deckPos('reading') !== 0) fail('deck position should persist');
if (!html.includes('✓ Read')) fail('a read card should show its read state on return');

// deep link jumps to a card
const target = READING[3];
html = go(`#/step/reading?card=${target.id}`);
if (!html.includes(target.title)) fail('deep link ?card=<id> should open that card');

// list fallback shows every card and shares state
list('reading');
html = go('#/step/reading');
for (const c of READING) if (!html.includes(c.title)) fail(`list view missing card: ${c.title}`);
if ((html.match(/<details class="lane/g) || []).length !== READING.length * 2) fail('expected 2 lanes per card in the list view');
if (!html.includes('Agentic Architecture &amp; Orchestration') && !html.includes('Agentic Architecture & Orchestration')) fail('domain header missing in list view');
list('reading', false);

// ---------------------------------------------- 2b) blueprint (DIV-26 + B6)
html = go('#/step/blueprint');
if (!html.includes('enough good sources')) fail('blueprint waypoint should be blocker 3');
list('blueprint');
html = go('#/step/blueprint');
for (const t of ['exam at a glance', 'five domains', 'Official material']) {
  if (!html.includes(t)) fail(`blueprint card missing: ${t}`);
}
if (!html.includes('27%')) fail('domain weights missing');
const extLinks = html.match(/href="https:\/\/[^"]+"/g) || [];
if (extLinks.length < 3) fail('expected at least 3 official links');
const newTabs = html.match(/target="_blank" rel="noopener"/g) || [];
if (newTabs.length !== extLinks.length) fail('every external link must open in a new tab with rel=noopener');
if ((html.match(/\(opens in new tab\)/g) || []).length !== newTabs.length) fail('every content link must announce the new tab (DIV-52 B6)');
list('blueprint', false);

// ------------------------------------------------------- 3) labs (DIV-28)
list('labs');
html = go('#/step/labs');
if ((html.match(/<article class="card/g) || []).length !== 5) fail('expected 5 mission cards in the list view');
if (!html.includes('Mission outline')) fail('mission outline lane missing');
if (!html.includes('Self-check')) fail('self-check lane missing');
if (!html.includes('Mark mission complete')) fail('mission mark label missing');
if (html.includes('From zero')) fail('labs should not use the reading lane labels');
list('labs', false);

// ------------------------------------------------------- 3b) mock (DIV-30)
html = go('#/step/mock');
if ((html.match(/<article class="card quiz/g) || []).length !== 1) fail('mock samples should also be a deck');
const extMocks = html.match(/class="ext-mock"/g) || [];
if (extMocks.length !== 4) fail('expected 4 external mock links');
const mockNewTabs = html.match(/target="_blank" rel="noopener"/g) || [];
if (mockNewTabs.length !== extMocks.length + 1) fail('every external mock link + booking CTA must be new-tab noopener');
if ((html.match(/\(opens in new tab\)/g) || []).length !== extMocks.length + 1) fail('external links must announce the new tab (DIV-52 B6)');
if (!html.includes('Book your exam')) fail('booking CTA missing');
if (!html.includes('anthropic-partners.skilljar.com')) fail('official registration link missing');

// mock samples score independently of drills
CCAF.storage.setAnswer('mock', CCAF_MOCK_SAMPLES[0].id, CCAF_MOCK_SAMPLES[0].correct);
let mp = CCAF.progressOf('mock');
if (mp.done !== 1 || mp.correct !== 1) fail('mock sample answer not scored');
if (CCAF.progressOf('drills').done !== 0) fail('mock answers must not bleed into drills');
CCAF.storage.resetAnswers('mock');
if (CCAF.progressOf('mock').done !== 0) fail('mock reset failed');

// ------------------------------------------- 3c) drills deck + a11y (DIV-51)
const QS = CCAF_DRILLS;
if (QS.length !== 11) fail(`expected 11 drill questions, got ${QS.length}`);
html = go('#/step/drills');
if ((html.match(/<article class="card quiz/g) || []).length !== 1) fail('drills must render one question at a time');
if (!html.includes('Question 1 of 11')) fail('per-question H3 missing (DIV-51 B4)');
if (!html.includes('role="group"')) fail('options need a group role (DIV-51 B4)');
if (!html.includes('aria-label="Option A:')) fail('options need letter-prefixed labels (DIV-51 B4)');
if (html.includes('class="explain"')) fail('explanations must be hidden before answering');
if ((html.match(/class="opt"/g) || []).length !== 4) fail('expected 4 options on the current question');

// answering: text badges, not colour alone; explanation is a live region
CCAF.storage.setAnswer('drills', QS[0].id, (QS[0].correct + 1) % 4);
html = go('#/step/drills');
if (!html.includes('✓ Correct')) fail('correct option needs a text badge (DIV-51 A1)');
if (!html.includes('✗ Your answer')) fail('the chosen wrong option needs a text badge (DIV-51 A1)');
if (!html.includes(', your answer, incorrect')) fail('wrong pick needs a spoken state (DIV-51 A1)');
if (!html.includes('aria-live="polite" aria-label="Why"')) fail('explanation must be announced (DIV-51 A2)');
if (!html.includes('class="explain"')) fail('explanations should show for answered questions');
if (!html.includes('chosen-wrong')) fail('wrong selection styling missing');

// two-step reset keeps the learner in place (DIV-51 B5)
if (!html.includes('data-reset-arm="drills"')) fail('reset should start as a single armed button');
if (html.includes('data-reset-confirm')) fail('reset must not confirm in one click');

// scoring
CCAF.storage.setAnswer('drills', QS[0].id, QS[0].correct);
CCAF.storage.setAnswer('drills', QS[1].id, (QS[1].correct + 1) % 4);
let dp = CCAF.progressOf('drills');
if (dp.done !== 2 || dp.correct !== 1) fail(`expected 2 answered 1 correct, got ${dp.done}/${dp.correct}`);
html = go('#/step/drills');
if (!html.includes('2 of 11 · 1 correct')) fail('drills chip should show answered + correct counts');

// map reflects drill progress; hero collapses and the CTA becomes Continue
html = go('#/');
if (!html.includes('2 of 11 · 1 correct')) fail('map should show drill score label');
if (!els['hero-cta'].innerHTML.includes('Continue →')) fail('CTA should switch to Continue after progress');
if (!els.story.innerHTML.includes('<details')) fail('hero story should collapse once progress exists (DIV-42)');
if (els.view.innerHTML.includes('progress just stays in this browser')) fail('first-visit hint should disappear once progress exists (DIV-45)');

// answer everything; step completes with score
for (const q of QS) CCAF.storage.setAnswer('drills', q.id, q.correct);
dp = CCAF.progressOf('drills');
if (dp.state !== 'done' || dp.correct !== 11) fail('expected done with 11 correct');
html = go('#/');
if (!html.includes('✓ complete · 11/11 correct')) fail('map should show completed drill score');
if (!html.includes('data-state="done"')) fail('a completed step should carry the gold "done" orb');

// hostile answer values are coerced away
store['ccaf.v1.progress'] = '{"steps":{"drills":{"answers":{"q-loan-pipeline":"<img src=x>","q-forty-contracts":9}}}}';
dp = CCAF.progressOf('drills');
if (dp.done !== 0) fail('invalid answer values must not count');
html = go('#/step/drills');
if (html.includes('<img src=x>')) fail('hostile answer leaked into DOM');

// reset restores a clean slate
for (const q of QS) CCAF.storage.setAnswer('drills', q.id, q.correct);
CCAF.storage.resetAnswers('drills');
if (CCAF.progressOf('drills').done !== 0) fail('reset should clear all answers');

// ------------------------------------------------------ 4) routing fallback
html = go('#/step/nonsense');
if (!html.includes('Journey map')) fail('unknown hash should render map');

// ------------------------------------------------- 5) card read state + map
const N = READING.length;
CCAF.toggleCard('reading', READING[0].id, null);
let p = CCAF.progressOf('reading');
if (p.state !== 'started' || p.done !== 1) fail(`after 1 card expected started 1/${N}, got ${p.state} ${p.done}/${p.total}`);
html = go('#/');
if (!html.includes(`1 of ${N}`)) fail(`map should show "1 of ${N}"`);

for (const c of READING.slice(1)) CCAF.toggleCard('reading', c.id, null);
p = CCAF.progressOf('reading');
if (p.state !== 'done') fail('after all cards expected done');
html = go('#/');
if (!html.includes('✓ complete')) fail('map should show ✓ complete');
if (!store['ccaf.v1.progress'].includes(READING[0].id)) fail('read state not persisted');

// 6) toggle off works (unread)
CCAF.toggleCard('reading', 'context-budget', null);
if (CCAF.progressOf('reading').state !== 'started') fail('untoggling should return to started');
CCAF.toggleCard('reading', 'context-budget', null); // back to done for the next check

// 7) corrupted/hostile localStorage must not break rendering or reach innerHTML
store['ccaf.v1.progress'] = '{"steps":{"reading":{"cards":{"<img src=x>":"<b>evil</b>","mcp-in-90s":"yes"}}}}';
html = go('#/');
if (html.includes('<img src=x>')) fail('hostile key leaked into DOM');
if (!html.includes('not started')) fail('non-true card values must not count as read');
store['ccaf.v1.progress'] = 'not even json {{{';
html = go('#/');
// corrupt JSON falls back to the in-memory session state (reading was completed above)
if (!html.includes('✓ complete')) fail('corrupt JSON should fall back to in-memory state');

console.log('PASS: all smoke checks (Field System theme + decks + accessibility)');
