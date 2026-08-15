// Smoke test for js/app.js + js/content.js. Run from the repo root:
//   node scripts/smoke-test.js "$PWD"
// It
// stub the DOM, load the scripts, drive the router and card APIs,
// and assert the rendered HTML matches the tickets' acceptance criteria.
const fs = require('fs');
const path = require('path');

const els = {};
function makeEl(id) {
  return {
    id, innerHTML: '',
    querySelector: () => null,
    addEventListener: () => {},
    classList: {
      _s: new Set(),
      add(c) { this._s.add(c); }, remove(c) { this._s.delete(c); },
      contains(c) { return this._s.has(c); },
    },
  };
}
els.view = makeEl('view');
els.hero = makeEl('hero');
els.story = makeEl('story');
els['hero-cta'] = makeEl('hero-cta');

const listeners = {};
global.window = global;
global.document = {
  getElementById: (id) => els[id] || null,
  querySelector: () => null,
  createElement: () => ({ getContext: () => null, width: 0, height: 0, style: {} }),
};
global.location = { hash: '' };
global.addEventListener = (ev, fn) => { (listeners[ev] = listeners[ev] || []).push(fn); };
global.scrollTo = () => {};
const store = {};
global.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
};
global.CCAF_FX = { setPathElement: () => {}, burst: () => {} };

const root = process.argv[2];
// eval is intentional and safe here: this harness executes our own local
// first-party files (no untrusted input) inside the stubbed globals.
eval(fs.readFileSync(path.join(root, 'js/content.js'), 'utf8'));
eval(fs.readFileSync(path.join(root, 'js/app.js'), 'utf8'));

const fail = (msg) => { console.error('FAIL:', msg); process.exit(1); };
const rerender = () => listeners.hashchange.forEach((f) => f());

// 0) hero story renders and CTA starts as "Start with the Blueprint" (DIV-25)
if (!els.story.innerHTML.includes('977/1000')) fail('hero story missing the score');
if (!els.story.innerHTML.includes('Salesforce consultant')) fail('hero story lead missing');
if (!els.story.innerHTML.includes('— Sangam')) fail('hero story signature missing');
if (!els['hero-cta'].innerHTML.includes('Start with the Blueprint')) fail('fresh CTA should be Start');

// 1) home renders five steps, all "not started"
let html = els.view.innerHTML;
for (const t of ['Blueprint', 'Reading', 'Labs', 'Drills', 'Mock Exam']) {
  if (!html.includes(t)) fail(`map missing step ${t}`);
}
if ((html.match(/not started/g) || []).length < 5) fail('expected a "not started" label per step');
if (!html.includes('href="#/step/blueprint"')) fail('step link missing');

// 2) reading step renders all cards grouped by domain, expanders collapsed (AE1)
const READING = CCAF_CARDS.reading;
location.hash = '#/step/reading';
rerender();
html = els.view.innerHTML;
for (const c of READING) if (!html.includes(c.title.replace(/'/g, '&#39;')) && !html.includes(c.title)) fail(`card missing: ${c.title}`);
if ((html.match(/<details/g) || []).length !== READING.length * 2) fail('expected 2 expanders per card');
if (/<details[^>]*\sopen/.test(html)) fail('expanders must be collapsed by default (AE1)');
if (!html.includes('From zero')) fail('"from zero" lane missing');
if (!html.includes('How the exam twists this')) fail('exam-twist lane missing');
if (!html.includes('Mark as read')) fail('mark-as-read control missing');
if (!html.includes('Agentic Architecture &amp; Orchestration') && !html.includes('Agentic Architecture & Orchestration')) fail('domain header missing');
if (!html.includes('27% of the exam')) fail('domain weight missing');

// 2a) waypoints appear inside their steps: reading has blocker 1 (DIV-25)
if (!html.includes('class="waypoint"')) fail('reading waypoint missing');
if (!html.includes('mindset shift')) fail('reading waypoint should be blocker 1');
if (!html.includes('From Sangam')) fail('waypoint kicker missing');

// 2b) blueprint step renders 3 cards with new-tab official links (DIV-26)
location.hash = '#/step/blueprint';
rerender();
html = els.view.innerHTML;
if (!html.includes('enough good sources')) fail('blueprint waypoint should be blocker 3');
for (const t of ['exam at a glance', 'five domains', 'Official material']) {
  if (!html.includes(t)) fail(`blueprint card missing: ${t}`);
}
if (!html.includes('27%')) fail('domain weights missing');
const extLinks = html.match(/href="https:\/\/[^"]+"/g) || [];
if (extLinks.length < 3) fail('expected at least 3 official links');
const newTabs = html.match(/target="_blank" rel="noopener"/g) || [];
if (newTabs.length !== extLinks.length) fail('every external link must open in a new tab with rel=noopener');
if (/<details[^>]*\sopen/.test(html)) fail('blueprint expanders must be collapsed by default');

// 3) labs renders 5 missions with mission-specific lane labels (DIV-28)
location.hash = '#/step/labs';
rerender();
html = els.view.innerHTML;
if ((html.match(/<article class="card/g) || []).length !== 5) fail('expected 5 mission cards');
if (!html.includes('Mission outline')) fail('mission outline lane missing');
if (!html.includes('Self-check')) fail('self-check lane missing');
if (!html.includes('Mark mission complete')) fail('mission mark label missing');
if (html.includes('From zero')) fail('labs should not use the reading lane labels');

// 3b) mock renders 3 samples, the external panel (new tabs), and the booking CTA (DIV-30)
location.hash = '#/step/mock';
rerender();
html = els.view.innerHTML;
if ((html.match(/<article class="card quiz/g) || []).length !== 3) fail('expected 3 mock sample questions');
const extMocks = html.match(/class="ext-mock"/g) || [];
if (extMocks.length !== 4) fail('expected 4 external mock links');
const mockNewTabs = html.match(/target="_blank" rel="noopener"/g) || [];
if (mockNewTabs.length !== extMocks.length + 1) fail('every external mock link + booking CTA must be new-tab noopener');
if (!html.includes('Book your exam')) fail('booking CTA missing');
if (!html.includes('anthropic-partners.skilljar.com')) fail('official registration link missing');

// mock samples score independently of drills
CCAF.storage.setAnswer('mock', CCAF_MOCK_SAMPLES[0].id, CCAF_MOCK_SAMPLES[0].correct);
let mp = CCAF.progressOf('mock');
if (mp.done !== 1 || mp.correct !== 1) fail('mock sample answer not scored');
if (CCAF.progressOf('drills').done !== 0) fail('mock answers must not bleed into drills');
CCAF.storage.resetAnswers('mock');
if (CCAF.progressOf('mock').done !== 0) fail('mock reset failed');

// 3c) drills render grouped questions; answering scores and persists (DIV-29)
const QS = CCAF_DRILLS;
if (QS.length !== 11) fail(`expected 11 drill questions, got ${QS.length}`);
location.hash = '#/step/drills';
rerender();
html = els.view.innerHTML;
if ((html.match(/<article class="card quiz/g) || []).length !== 11) fail('expected 11 quiz cards rendered');
if (!html.includes('Q1')) fail('question numbering missing');
if (html.includes('class="explain"')) fail('explanations must be hidden before answering');
if ((html.match(/class="opt"/g) || []).length !== 44) fail('expected 4 options per question');

// answer one correctly, one wrong
CCAF.storage.setAnswer('drills', QS[0].id, QS[0].correct);
CCAF.storage.setAnswer('drills', QS[1].id, (QS[1].correct + 1) % 4);
let dp = CCAF.progressOf('drills');
if (dp.done !== 2 || dp.correct !== 1) fail(`expected 2 answered 1 correct, got ${dp.done}/${dp.correct}`);
rerender();
html = els.view.innerHTML;
if (!html.includes('class="explain"')) fail('explanations should show for answered questions');
if (!html.includes('chosen-wrong')) fail('wrong selection styling missing');
if (!html.includes('2 of 11 · 1 correct')) fail('drills chip should show answered + correct counts');

// map reflects drill progress; hero CTA switches to Continue once progress exists (R17)
location.hash = '';
rerender();
if (!els.view.innerHTML.includes('2 of 11 · 1 correct')) fail('map should show drill score label');
if (!els['hero-cta'].innerHTML.includes('Continue →')) fail('CTA should switch to Continue after progress');

// answer everything; step completes with score
for (const q of QS) CCAF.storage.setAnswer('drills', q.id, q.correct);
dp = CCAF.progressOf('drills');
if (dp.state !== 'done' || dp.correct !== 11) fail('expected done with 11 correct');
rerender();
if (!els.view.innerHTML.includes('✓ complete · 11/11 correct')) fail('map should show completed drill score');

// hostile answer values are coerced away
store['ccaf.v1.progress'] = '{"steps":{"drills":{"answers":{"q-loan-pipeline":"<img src=x>","q-forty-contracts":9}}}}';
dp = CCAF.progressOf('drills');
if (dp.done !== 0) fail('invalid answer values must not count');
location.hash = '#/step/drills';
rerender();
if (els.view.innerHTML.includes('<img src=x>')) fail('hostile answer leaked into DOM');

// reset restores a clean slate
for (const q of QS) CCAF.storage.setAnswer('drills', q.id, q.correct);
CCAF.storage.resetAnswers('drills');
if (CCAF.progressOf('drills').done !== 0) fail('reset should clear all answers');

// 4) unknown hash falls back to the map
location.hash = '#/step/nonsense';
rerender();
if (!els.view.innerHTML.includes('Journey map')) fail('unknown hash should render map');

// 5) marking cards read: started -> done, persisted, reflected on the map
const N = READING.length;
CCAF.toggleCard('reading', READING[0].id, null);
let p = CCAF.progressOf('reading');
if (p.state !== 'started' || p.done !== 1) fail(`after 1 card expected started 1/${N}, got ${p.state} ${p.done}/${p.total}`);
location.hash = '';
rerender();
if (!els.view.innerHTML.includes(`1 of ${N}`)) fail(`map should show "1 of ${N}"`);

for (const c of READING.slice(1)) CCAF.toggleCard('reading', c.id, null);
p = CCAF.progressOf('reading');
if (p.state !== 'done') fail('after all cards expected done');
rerender();
if (!els.view.innerHTML.includes('✓ complete')) fail('map should show ✓ complete');
if (!store['ccaf.v1.progress'].includes(READING[0].id)) fail('read state not persisted');

// 6) toggle off works (unread)
CCAF.toggleCard('reading', 'context-budget', null);
if (CCAF.progressOf('reading').state !== 'started') fail('untoggling should return to started');
CCAF.toggleCard('reading', 'context-budget', null); // back to done for next check

// 7) corrupted/hostile localStorage must not break rendering or reach innerHTML
store['ccaf.v1.progress'] = '{"steps":{"reading":{"cards":{"<img src=x>":"<b>evil</b>","mcp-in-90s":"yes"}}}}';
location.hash = '';
rerender();
html = els.view.innerHTML;
if (html.includes('<img src=x>')) fail('hostile key leaked into DOM');
if (!html.includes('not started')) fail('non-true card values must not count as read');
store['ccaf.v1.progress'] = 'not even json {{{';
rerender();
// corrupt JSON falls back to the in-memory session state (reading was completed above)
if (!els.view.innerHTML.includes('✓ complete')) fail('corrupt JSON should fall back to in-memory state');

console.log('PASS: all smoke checks (scaffold + cards)');
