/* CCA-F Interactive Guide — app shell + flashcard deck engine
   ---------------------------------------------------------------------------
   DIV-49  Divings Field System theme; dot-lattice orbs replace the particles
   DIV-50  Flashcard decks — one card / one question at a time in every step
   DIV-51  Accessible drill feedback + focus management (audit P1)
   DIV-52  Skip link, heading outline, route titles, announcements (audit P2)
   DIV-42  Hero story auto-collapses once the learner has progress
   DIV-45  First-visit hint on the Journey Map
   DIV-41  Lighter waypoint story blocks on small screens

   Single-page hash routing (#/ and #/step/<id>[?card=<id>]) so localStorage
   behaves identically on file:// and on Vercel. Progress is DERIVED from cards
   read / questions answered — nothing stores a step state that could drift.
   --------------------------------------------------------------------------- */

(function () {
  'use strict';

  const icon = (n, l) => (window.CCAF_ICONS ? window.CCAF_ICONS.icon(n, l) : '');
  const brand = (n) => (window.CCAF_ICONS ? window.CCAF_ICONS.brand(n) : '');
  const NEW_TAB = ' <span class="sr-only">(opens in new tab)</span>';

  /* DIV-52 B6: every new-tab link says so to a screen reader. Content in
     js/content.js is authored as plain HTML, so the hint is stitched in here
     rather than asking every author to remember it. Idempotent. */
  function newTabHints(html) {
    return String(html == null ? '' : html).replace(/<a\b[^>]*target="_blank"[^>]*>([\s\S]*?)<\/a>/g,
      (m) => (m.includes('opens in new tab') ? m : m.replace(/<\/a>$/, `${NEW_TAB}</a>`)));
  }

  /* Sangam elsewhere — rendered rather than hard-coded in index.html so the
     brand marks have one source (js/icons.js) and the new-tab hint is applied
     the same way it is everywhere else (DIV-52 B6). */
  const SOCIALS = [
    { id: 'linkedin', name: 'LinkedIn', url: 'https://www.linkedin.com/in/gella-sangamesh-gupta-a35b5b1b8/' },
    { id: 'x',        name: 'X',        url: 'https://x.com/sangamesh_gupta' },
    { id: 'substack', name: 'Substack', url: 'https://gellasangameshgupta.substack.com/' },
    { id: 'youtube',  name: 'YouTube',  url: 'https://www.youtube.com/@divingsbysangam' },
  ];

  function renderSocial() {
    const el = document.getElementById('foot-social');
    if (!el) return;
    el.innerHTML = SOCIALS.map((s) => `
      <a class="soc" href="${s.url}" target="_blank" rel="noopener me">${brand(s.id)}<span>${s.name}</span>${NEW_TAB}</a>`).join('');
  }

  // ---------- step definitions ----------
  const STEPS = [
    {
      id: 'blueprint', n: 1, title: 'Blueprint', ico: 'blueprint',
      blurb: 'What the exam is, the five domains and weights, and the official material worth your time.',
      lede: 'Orient before you study: how the exam works, what it costs, what it covers, and where the official sources live.',
    },
    {
      id: 'reading', n: 2, title: 'Reading', ico: 'reading',
      blurb: 'Quick-bit concept cards — two minutes each, with a "from zero" lane if agent-native is new territory.',
      lede: 'Bite-sized concepts across all five domains. Each card is a two-minute read with optional depth when you need it.',
    },
    {
      id: 'labs', n: 3, title: 'Labs', ico: 'labs',
      blurb: 'Build small things in Claude Code yourself. The exam tests judgment — judgment comes from building.',
      lede: 'Guided missions you build yourself in Claude Code. The exam rewards implementation taste, and taste comes from reps.',
    },
    {
      id: 'drills', n: 4, title: 'Drills', ico: 'drills',
      blurb: 'Analogy-framed questions with four close options — recognition training for the real exam style.',
      lede: 'The questions never name the concept they test. These drills train you to recognize it anyway.',
    },
    {
      id: 'mock', n: 5, title: 'Mock Exam', ico: 'mock',
      blurb: 'Feel the format, then finish on full-length community mocks. Then book your seat.',
      lede: 'Sample the real feel here, then take full-length community mock exams — and book your seat.',
    },
  ];

  function cardsOf(stepId) {
    return (window.CCAF_CARDS && window.CCAF_CARDS[stepId]) || [];
  }

  // exam domains (weights from the official blueprint) — used to group cards and drills
  const DOMAINS = [
    { id: 'agentic', name: 'Agentic Architecture & Orchestration', weight: '27%', short: 'Agentic' },
    { id: 'claude-code', name: 'Claude Code Configuration & Workflows', weight: '20%', short: 'Claude Code' },
    { id: 'prompting', name: 'Prompt Engineering & Structured Output', weight: '20%', short: 'Prompting' },
    { id: 'tools-mcp', name: 'Tool Design & MCP Integration', weight: '18%', short: 'Tools & MCP' },
    { id: 'context', name: 'Context Management & Reliability', weight: '15%', short: 'Context' },
  ];

  // ---------- progress storage ----------
  const KEY = 'ccaf.v1.progress';
  let mem = null; // in-memory fallback when localStorage is unavailable (sandboxed previews, strict private modes)
  const storage = {
    read() {
      try {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : (mem || { steps: {} });
      } catch { return mem || { steps: {} }; }
    },
    write(data) {
      mem = data;
      try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* keep mem only */ }
    },
    /* map of cardId -> true; only literal `true` survives, so corrupted or
       hostile values can never reach rendering */
    cardsRead(stepId) {
      const steps = this.read().steps;
      const cards = steps && steps[stepId] && steps[stepId].cards;
      const out = {};
      if (cards && typeof cards === 'object') {
        for (const k of Object.keys(cards)) if (cards[k] === true) out[k] = true;
      }
      return out;
    },
    setCardRead(stepId, cardId, isRead) {
      const data = this.read();
      data.steps = (data.steps && typeof data.steps === 'object') ? data.steps : {};
      const s = (data.steps[stepId] = data.steps[stepId] || {});
      s.cards = (s.cards && typeof s.cards === 'object') ? s.cards : {};
      if (isRead) s.cards[cardId] = true; else delete s.cards[cardId];
      this.write(data);
    },
  };

  // question sets per step (drills + mock samples share the quiz machinery)
  function questionsFor(stepId) {
    if (stepId === 'drills') return window.CCAF_DRILLS || [];
    if (stepId === 'mock') return window.CCAF_MOCK_SAMPLES || [];
    return [];
  }

  // answers: per-step map of questionId -> selected option index (validated integer)
  storage.answers = function (stepId) {
    const steps = this.read().steps;
    const raw = steps && steps[stepId] && steps[stepId].answers;
    const out = {};
    if (raw && typeof raw === 'object') {
      for (const k of Object.keys(raw)) {
        const v = Number(raw[k]);
        if (Number.isInteger(v) && v >= 0 && v <= 3) out[k] = v;
      }
    }
    return out;
  };
  storage.setAnswer = function (stepId, qid, idx) {
    const data = this.read();
    data.steps = (data.steps && typeof data.steps === 'object') ? data.steps : {};
    const s = (data.steps[stepId] = data.steps[stepId] || {});
    s.answers = (s.answers && typeof s.answers === 'object') ? s.answers : {};
    s.answers[qid] = idx;
    this.write(data);
  };
  storage.resetAnswers = function (stepId) {
    const data = this.read();
    if (data.steps && data.steps[stepId]) delete data.steps[stepId].answers;
    this.write(data);
  };

  /* deck position + view mode per step (DIV-50): returning to a step lands the
     learner where they left off, and the list/deck choice sticks. */
  storage.deckPos = function (stepId) {
    const steps = this.read().steps;
    const v = Number(steps && steps[stepId] && steps[stepId].pos);
    return Number.isInteger(v) && v >= 0 ? v : 0;
  };
  storage.setDeckPos = function (stepId, pos) {
    const data = this.read();
    data.steps = (data.steps && typeof data.steps === 'object') ? data.steps : {};
    const s = (data.steps[stepId] = data.steps[stepId] || {});
    s.pos = pos;
    this.write(data);
  };
  storage.listMode = function (stepId) {
    const steps = this.read().steps;
    return !!(steps && steps[stepId] && steps[stepId].list === true);
  };
  storage.setListMode = function (stepId, on) {
    const data = this.read();
    data.steps = (data.steps && typeof data.steps === 'object') ? data.steps : {};
    const s = (data.steps[stepId] = data.steps[stepId] || {});
    if (on) s.list = true; else delete s.list;
    this.write(data);
  };

  function scoreFor(stepId) {
    const answers = storage.answers(stepId);
    const qs = questionsFor(stepId);
    const answered = qs.filter((q) => q.id in answers);
    const correct = answered.filter((q) => answers[q.id] === q.correct);
    return { answered: answered.length, correct: correct.length, total: qs.length };
  }

  function progressOf(stepId) {
    if (questionsFor(stepId).length) {
      const s = scoreFor(stepId);
      const state = s.total > 0 && s.answered === s.total ? 'done' : s.answered > 0 ? 'started' : 'new';
      return { state, done: s.answered, total: s.total, correct: s.correct };
    }
    const cards = cardsOf(stepId);
    const read = storage.cardsRead(stepId);
    const done = cards.filter((c) => read[c.id]).length;
    const total = cards.length;
    const state = total > 0 && done === total ? 'done' : done > 0 ? 'started' : 'new';
    return { state, done, total };
  }

  function progressLabel(p) {
    if (typeof p.correct === 'number' && p.done > 0) {
      return p.state === 'done' ? `✓ complete · ${p.correct}/${p.total} correct` : `${p.done} of ${p.total} · ${p.correct} correct`;
    }
    if (p.state === 'done') return '✓ complete';
    if (p.state === 'started') return `${p.done} of ${p.total}`;
    return 'not started';
  }

  const anyProgress = () => STEPS.some((s) => progressOf(s.id).state !== 'new');

  /* first step that isn't finished — drives the map's "current" orb and the CTA */
  function nextUp() {
    for (const s of STEPS) if (progressOf(s.id).state !== 'done') return s;
    return null;
  }

  function stepState(stepId) {
    const p = progressOf(stepId);
    if (p.state === 'done') return 'done';
    const up = nextUp();
    return up && up.id === stepId ? 'current' : 'ahead';
  }

  // ---------- deck model (DIV-50) ----------
  /* One flat, domain-ordered list per step; the tabs and the dot strip are both
     views onto it, so "card 3 of 6 in this domain" and "12 of 24 overall" can
     never disagree. */
  function deckOf(stepId) {
    const qs = questionsFor(stepId);
    const kind = qs.length ? 'question' : 'card';
    const items = qs.length ? qs : cardsOf(stepId);
    const grouped = items.some((it) => it.domain);
    const groups = [];
    if (grouped) {
      for (const d of DOMAINS) {
        const list = items.filter((it) => it.domain === d.id);
        if (list.length) groups.push({ domain: d, items: list });
      }
      const orphans = items.filter((it) => !DOMAINS.some((d) => d.id === it.domain));
      if (orphans.length) groups.push({ domain: null, items: orphans });
    } else if (items.length) {
      groups.push({ domain: null, items });
    }
    const flat = [];
    groups.forEach((g, gi) => g.items.forEach((it, ii) => flat.push({ item: it, group: g, gi, ii })));
    return { kind, groups, flat, total: flat.length, grouped };
  }

  function deckStatus(stepId, kind, item) {
    if (kind === 'card') return storage.cardsRead(stepId)[item.id] ? 'read' : '';
    const a = storage.answers(stepId);
    if (!(item.id in a)) return '';
    return a[item.id] === item.correct ? 'right' : 'wrong';
  }

  // ---------- small helpers ----------
  const stripTags = (s) => String(s == null ? '' : s).replace(/<[^>]*>/g, '');
  const attr = (s) => stripTags(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

  // ---------- rendering ----------
  const view = document.getElementById('view');
  const hero = document.getElementById('hero');
  const announcer = document.getElementById('route-announce');
  const story = window.CCAF_STORY || { hero: null, waypoints: [] };

  function announce(msg) { if (announcer) announcer.textContent = msg; }

  function setTitle(suffix) {
    try { document.title = suffix ? `${suffix} — CCA-F Interactive Guide` : 'CCA-F Interactive Guide — Divings by Sangam'; } catch { /* stubbed DOM */ }
  }

  /* DIV-42: first visit shows the whole story; once any progress exists it
     collapses to the first paragraph behind a plain-language expander. */
  function renderStory() {
    const el = document.getElementById('story');
    if (!el || !story.hero) return;
    const rest = `<p>${story.hero.why}</p><p>${story.hero.result}</p><p class="story-sign">— Sangam</p>`;
    if (!anyProgress()) {
      el.innerHTML = `<p>${story.hero.lead}</p>${rest}`;
    } else {
      el.innerHTML = `<p>${story.hero.lead}</p>
        <details class="story-rest"><summary class="story-more">Read the rest of the story</summary>${rest}</details>`;
    }
  }

  function renderHeroCTA() {
    const el = document.getElementById('hero-cta');
    if (!el) return;
    const next = nextUp();
    if (!anyProgress()) {
      el.innerHTML = `<a class="btn" href="#/step/blueprint">Start with the Blueprint ${icon('next')}</a>`;
    } else if (next) {
      el.innerHTML = `<a class="btn" href="#/step/${next.id}">Continue → ${next.title} ${icon('next')}</a>`;
    } else {
      el.innerHTML = `<a class="btn" href="#/step/mock">All five steps done — book your exam ${icon('next')}</a>`;
    }
  }

  /* DIV-41: on a phone the waypoint shows kicker + title + first sentence with
     the rest behind an expander; on a wide screen it opens by default. */
  function waypointHTML(stepId) {
    const w = story.waypoints.find((x) => x.stepId === stepId);
    if (!w) return '';
    const wide = typeof innerWidth !== 'number' || innerWidth > 640;
    const m = String(w.body).match(/^([\s\S]*?[.!?])(\s+)([\s\S]+)$/);
    const first = m ? m[1] : w.body;
    const rest = m ? m[3] : '';
    const id = `wp-${stepId}`;
    const body = !rest ? `<p>${first}</p>`
      : wide ? `<p>${first}</p><p>${rest}</p>`
      : `<p>${first}</p><details class="wp-more"><summary class="story-more">Read more</summary><p>${rest}</p></details>`;
    return `
    <aside class="waypoint" aria-labelledby="${id}">
      <p class="wp-kicker">${icon('sangam')} From Sangam's journey</p>
      <h3 id="${id}">${w.title}</h3>
      ${body}
    </aside>`;
  }

  function renderMap() {
    hero.classList.remove('compact');
    renderStory();
    renderHeroCTA();
    setTitle('');
    const up = nextUp();
    const items = STEPS.map((s) => {
      const p = progressOf(s.id);
      const st = stepState(s.id);
      return `
      <a class="step ${st}" href="#/step/${s.id}" aria-label="Step ${s.n}: ${s.title} — ${progressLabel(p)}">
        <span class="node"><canvas class="orb" data-state="${st}" data-size="48"></canvas></span>
        <span class="step-body">
          <span class="step-title-row"><span class="step-n">${String(s.n).padStart(2, '0')}</span><h3>${s.title}</h3></span>
          <p>${s.blurb}</p>
        </span>
        <span class="prog">${progressLabel(p)}</span>
      </a>`;
    }).join('');
    /* DIV-45: one quiet line, only while there is nothing to lose */
    const hint = anyProgress() ? '' :
      `<p class="map-hint">Work through the five steps in order. Reading a card or answering a drill fills this map in — nothing is sent anywhere, your progress just stays in this browser.</p>`;
    view.innerHTML = `
      <h2 class="sr-only">Your journey</h2>
      <div class="map-head"><p class="coord">05 steps · blueprint → booked exam</p>${up ? `<p class="coord">You are here · ${up.title}</p>` : `<p class="coord">Complete</p>`}</div>
      ${hint}
      <nav class="map" aria-label="Journey map">${items}</nav>`;
    if (window.CCAF_ORB) CCAF_ORB.mountAll(view);
  }

  // ---------- card + question markup ----------
  function cardHTML(c, read, opts) {
    const o = opts || {};
    const zeroLabel = c.zeroLabel || 'From zero — plain language &amp; a familiar-platform analogy';
    const twistLabel = c.twistLabel || 'How the exam twists this';
    const markLabels = c.markLabels || ['Mark as read', '✓ Read'];
    const flashAttrs = o.flash
      ? ` aria-roledescription="flashcard" aria-label="Card ${o.pos} of ${o.of}: ${attr(c.title)}"`
      : '';
    return `
    <article class="card${read ? ' read' : ''}" data-card="${c.id}"${flashAttrs}>
      <header class="card-head">
        <div class="title-row"><h3 tabindex="-1" class="card-title">${c.title}</h3><span class="mins">~${c.minutes} min</span></div>
        <button class="mark" type="button" data-labels="${markLabels.join('|')}" aria-pressed="${read}">${read ? markLabels[1] : markLabels[0]}</button>
      </header>
      <div class="quick">${newTabHints(c.quick)}</div>
      <details class="lane"><summary><h4 class="sr-only">${stripTags(zeroLabel)}</h4>${zeroLabel}</summary><div class="lane-body">${newTabHints(c.fromZero)}</div></details>
      <details class="lane twist"><summary><h4 class="sr-only">${stripTags(twistLabel)}</h4>${twistLabel}</summary><div class="lane-body">${newTabHints(c.examTwist)}</div></details>
    </article>`;
  }

  /* DIV-51: feedback is never colour-only — every option carries a text badge
     and an aria-label saying what it is, and the explanation is announced. */
  function drillHTML(q, num, selected, opts) {
    const o = opts || {};
    const answered = Number.isInteger(selected);
    const sid = `sc-${q.id}`;
    const opts_ = q.options.map((o2, i) => {
      let cls = 'opt', badge = '', state = '';
      if (answered) {
        if (i === q.correct) { cls += ' right'; badge = '✓ Correct'; state = ', correct'; }
        else if (i === selected) { cls += ' chosen-wrong'; badge = '✗ Your answer'; state = ', your answer, incorrect'; }
        else { cls += ' faded'; state = ', not selected'; }
      }
      return `<button type="button" class="${cls}" data-i="${i}" ${answered ? 'disabled' : ''}
        aria-label="Option ${'ABCD'[i]}: ${attr(o2.text)}${state}">
        <span class="letter" aria-hidden="true">${'ABCD'[i]}</span><span class="opt-text">${o2.text}</span>${badge ? `<span class="badge" aria-hidden="true">${badge}</span>` : ''}
      </button>`;
    }).join('');
    const explain = answered
      ? `<div class="explain" role="region" aria-live="polite" aria-label="Why">
          <h4 tabindex="-1" class="explain-head">Why</h4>
          ${q.options.map((o2, i) => `
          <p class="${i === q.correct ? 'exp-right' : ''}"><b>${'ABCD'[i]}${i === q.correct ? ' ✓' : ''}.</b> ${o2.explain}</p>`).join('')}
        </div>`
      : '';
    const flashAttrs = o.flash
      ? ` aria-roledescription="flashcard" aria-label="Question ${o.pos} of ${o.of}"`
      : '';
    return `
    <article class="card quiz" data-q="${q.id}"${flashAttrs}>
      <h3 class="sr-only card-title" tabindex="-1">Question ${num}${o.of ? ` of ${o.of}` : ''}</h3>
      <p class="scenario" id="${sid}"><span class="qnum">Q${num}</span>${q.scenario}</p>
      <div class="opts" role="group" aria-labelledby="${sid}">${opts_}</div>
      ${explain}
    </article>`;
  }

  // ---------- deck rendering (DIV-50) ----------
  function deckHTML(step, deck, pos) {
    const entry = deck.flat[pos];
    const g = entry.group;
    const domainName = g.domain ? g.domain.name : step.title;
    const inDomain = g.items.length;
    const isCard = deck.kind === 'card';
    const status = deckStatus(step.id, deck.kind, entry.item);

    const tabs = deck.grouped ? `
      <div class="tabs" role="tablist" aria-label="Exam domains">
        ${deck.groups.map((gr, gi) => {
          const done = gr.items.filter((it) => deckStatus(step.id, deck.kind, it)).length;
          const first = deck.flat.findIndex((f) => f.gi === gi);
          const complete = done === gr.items.length;
          return `<button type="button" role="tab" class="tab${complete ? ' complete' : ''}" data-goto="${first}"
            aria-selected="${gi === entry.gi}">${gr.domain ? gr.domain.short : 'More'} <span class="tab-count">${done}/${gr.items.length}</span></button>`;
        }).join('')}
      </div>` : '';

    const dots = g.items.map((it, i) => {
      const s = deckStatus(step.id, deck.kind, it);
      const cur = i === entry.ii ? ' current' : '';
      return `<span class="dot-i ${s}${cur}"></span>`;
    }).join('');

    const body = isCard
      ? cardHTML(entry.item, !!storage.cardsRead(step.id)[entry.item.id], { flash: true, pos: entry.ii + 1, of: inDomain })
      : drillHTML(entry.item, pos + 1, storage.answers(step.id)[entry.item.id], { flash: true, pos: pos + 1, of: deck.total });

    const atStart = pos === 0;
    const atEnd = pos === deck.total - 1;
    const nextDone = atEnd && !!status;
    const nextLabel = isCard
      ? (atEnd ? 'Mark read · finish' : 'Next')
      : (atEnd ? 'Last question' : 'Next question');

    const complete = progressOf(step.id).state === 'done';
    const nextStep = STEPS[step.n];
    const completePanel = complete ? `
      <p class="deck-done coord">${icon('done')} ${step.title} complete${nextStep ? ` — <a href="#/step/${nextStep.id}">on to ${nextStep.title}</a>` : ' — you have finished the journey'}.</p>` : '';

    return `
      <section class="deck" data-step="${step.id}">
        <div class="deck-head">
          <div class="deck-meta">
            <span>${g.domain ? `${g.domain.weight} of the exam` : `${step.title}`}</span>
            <span>${entry.ii + 1} / ${inDomain} in this ${g.domain ? 'domain' : 'step'} · ${pos + 1} of ${deck.total} overall</span>
          </div>
          <h3 class="deck-domain">${domainName}</h3>
          ${tabs}
          <div class="dots" aria-hidden="true">${dots}</div>
        </div>
        <div class="stage${atEnd ? ' last' : ''}" aria-live="polite">${body}</div>
        <div class="deck-controls">
          <button type="button" class="btn ghost" data-deck="prev" ${atStart ? 'disabled' : ''}>${icon('prev')} Previous</button>
          <span class="spacer"></span>
          <button type="button" class="btn" data-deck="next" ${nextDone ? 'disabled' : ''}>${nextLabel} ${icon('next')}</button>
        </div>
        ${completePanel}
        <p class="kbd-hint">${icon('keyboard')} Keyboard: ← → move · Space marks read · A–D answer · N next</p>
        <button type="button" class="deck-list-link" data-list="on">Show all ${isCard ? 'cards' : 'questions'} in this ${g.domain ? 'domain' : 'step'} as a list</button>
      </section>`;
  }

  function listHTML(step, deck) {
    const isCard = deck.kind === 'card';
    const read = storage.cardsRead(step.id);
    const answers = storage.answers(step.id);
    let num = 0;
    const sections = deck.groups.map((g) => {
      const done = g.items.filter((it) => deckStatus(step.id, deck.kind, it)).length;
      const head = g.domain ? `
        <header class="domain-head deck-meta">
          <h3 class="deck-domain">${g.domain.name}</h3>
          <span>${g.domain.weight} of the exam · ${done} of ${g.items.length} ${isCard ? 'read' : 'answered'}</span>
        </header>` : '';
      const body = g.items.map((it) => isCard
        ? cardHTML(it, !!read[it.id])
        : drillHTML(it, ++num, answers[it.id], { of: deck.total })).join('');
      return `<section class="domain">${head}<div class="cards">${body}</div></section>`;
    }).join('');
    return `
      <section class="deck list-mode" data-step="${step.id}">
        <button type="button" class="deck-list-link" data-list="off">Back to one ${isCard ? 'card' : 'question'} at a time</button>
        ${sections}
      </section>`;
  }

  function mockExtraHTML() {
    const links = (window.CCAF_MOCK_LINKS || []).map((l) => `
      <a class="ext-mock" href="${l.url}" target="_blank" rel="noopener">
        <span class="ext-name">${l.name}${NEW_TAB}</span>
        <span class="ext-note">${l.note}</span>
        <span class="ext-arrow">${icon('external')} Open</span>
      </a>`).join('');
    return `
      <section class="domain">
        <header class="domain-head deck-meta">
          <h3 class="deck-domain">Full-length mock exams (community)</h3>
          <span>each opens in a new tab — your progress here is untouched</span>
        </header>
        <div class="ext-panel">${links}</div>
      </section>
      <div class="book-cta">
        <p>Scoring comfortably on the mocks? You're ready.</p>
        <a class="btn signal" href="https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification" target="_blank" rel="noopener">Book your exam — official page${NEW_TAB} ${icon('external')}</a>
      </div>`;
  }

  /* DIV-51 (B5): reset is two-step and keeps focus on the control. */
  function resetHTML(stepId, label, armed) {
    return armed
      ? `<div class="drill-foot" data-reset-zone="${stepId}">
           <button type="button" class="btn" data-reset-confirm="${stepId}">Confirm reset</button>
           <button type="button" class="btn ghost" data-reset-cancel="${stepId}">Cancel</button>
         </div>`
      : `<div class="drill-foot" data-reset-zone="${stepId}">
           <button type="button" class="btn ghost" data-reset-arm="${stepId}">${label}</button>
         </div>`;
  }

  let resetArmed = null;

  function renderStep(step, focusTarget) {
    hero.classList.add('compact');
    setTitle(step.title);
    const prev = STEPS[step.n - 2], next = STEPS[step.n];
    const deck = deckOf(step.id);
    const p = progressOf(step.id);

    let body;
    if (!deck.total) {
      body = `<div class="placeholder">
           <b>${step.title} content is being written.</b><br>
           Quick-bit cards land here — each a two-minute read with optional "from zero" and
           "how the exam twists this" layers.
         </div>`;
    } else if (storage.listMode(step.id)) {
      body = listHTML(step, deck);
    } else {
      body = deckHTML(step, deck, clamp(storage.deckPos(step.id), 0, deck.total - 1));
    }

    if (step.id === 'mock') body += mockExtraHTML();
    if (deck.kind === 'question' && deck.total) {
      body += resetHTML(step.id, step.id === 'mock' ? 'Reset sample answers' : 'Reset all answers', resetArmed === step.id);
    }

    view.innerHTML = `
      <article class="step-page">
        <h1 class="sr-only">CCA-F Interactive Guide</h1>
        <p class="crumb"><a href="#/">${icon('prev')} Journey map</a></p>
        <div class="step-head">
          <span class="node"><canvas class="orb" data-state="${stepState(step.id)}" data-size="22"></canvas></span>
          <h2 tabindex="-1" id="step-title">${String(step.n).padStart(2, '0')} ${step.title}</h2>
          <span class="step-prog" id="step-prog" role="status" aria-live="polite">${deck.total ? progressLabel(p) : ''}</span>
        </div>
        <p class="lede">${step.lede}</p>
        ${waypointHTML(step.id)}
        ${body}
        <div class="step-nav">
          ${prev ? `<a class="btn ghost" href="#/step/${prev.id}">${icon('prev')} ${prev.title}</a>` : `<a class="btn ghost" href="#/">${icon('prev')} Journey map</a>`}
          ${next ? `<a class="btn ghost" href="#/step/${next.id}">${next.title} ${icon('next')}</a>` : ''}
        </div>
      </article>`;
    if (window.CCAF_ORB) CCAF_ORB.mountAll(view);

    /* DIV-52 B3 / DIV-50: focus never falls back to <body>. On a route change we
       land on the step heading; on a deck move we land on the new card's title. */
    const target = focusTarget === 'card'
      ? view.querySelector('.stage .card-title')
      : view.querySelector('#step-title');
    if (target && target.focus) { try { target.focus({ preventScroll: focusTarget === 'card' }); } catch { target.focus(); } }
    if (focusTarget !== 'card') scrollTo({ top: 0, behavior: 'auto' });
  }

  /* Route state lives in a variable, mirrored to location.hash when the
     environment allows it, so navigation works in sandboxed previews too. */
  let routeHash = (typeof location !== 'undefined' && location.hash) || '';

  function currentStep() {
    const m = routeHash.match(/^#\/step\/([a-z]+)(?:\?card=([\w-]+))?$/);
    if (!m) return null;
    const step = STEPS.find((s) => s.id === m[1]);
    if (step && m[2]) {
      const deck = deckOf(step.id);
      const i = deck.flat.findIndex((f) => f.item.id === m[2]);
      if (i >= 0) storage.setDeckPos(step.id, i);
    }
    return step || null;
  }

  function render(focusTarget) {
    const step = currentStep();
    if (step) renderStep(step, focusTarget);
    else renderMap();
  }

  // ---------- deck navigation ----------
  function deckMove(step, delta) {
    const deck = deckOf(step.id);
    if (!deck.total) return;
    const pos = clamp(storage.deckPos(step.id), 0, deck.total - 1);
    const nextPos = clamp(pos + delta, 0, deck.total - 1);
    if (nextPos === pos) return;
    storage.setDeckPos(step.id, nextPos);
    render('card');
    const e = deck.flat[nextPos];
    announce(`${deck.kind === 'card' ? 'Card' : 'Question'} ${nextPos + 1} of ${deck.total}. ${deck.kind === 'card' ? stripTags(e.item.title) : ''}`);
  }

  function deckGoto(step, pos) {
    const deck = deckOf(step.id);
    storage.setDeckPos(step.id, clamp(pos, 0, Math.max(0, deck.total - 1)));
    render('card');
  }

  /* Decision (Sangam, DIV-50): "Next" marks the current card read AND advances. */
  function deckNext(step) {
    const deck = deckOf(step.id);
    if (!deck.total) return;
    const pos = clamp(storage.deckPos(step.id), 0, deck.total - 1);
    const entry = deck.flat[pos];
    if (deck.kind === 'card' && !storage.cardsRead(step.id)[entry.item.id]) {
      storage.setCardRead(step.id, entry.item.id, true);
      announce(`Marked read. ${progressLabel(progressOf(step.id))}`);
    }
    if (pos === deck.total - 1) { renderStory(); render('card'); return; }
    deckMove(step, 1);
  }

  function toggleCard(stepId, cardId, btn) {
    const nowRead = !storage.cardsRead(stepId)[cardId];
    storage.setCardRead(stepId, cardId, nowRead);
    const p = progressOf(stepId);

    // update in place so open expanders stay open
    if (btn) {
      const card = btn.closest && btn.closest('.card');
      const labels = (btn.getAttribute('data-labels') || 'Mark as read|✓ Read').split('|');
      btn.setAttribute('aria-pressed', String(nowRead));
      btn.textContent = nowRead ? labels[1] : labels[0];
      if (card) card.classList.toggle('read', nowRead);
      const chip = document.getElementById('step-prog');
      if (chip) chip.textContent = progressLabel(p);
      const dots = document.querySelector('.deck .dots');
      if (dots) {
        const deck = deckOf(stepId);
        const pos = clamp(storage.deckPos(stepId), 0, Math.max(0, deck.total - 1));
        const entry = deck.flat[pos];
        if (entry && entry.item.id === cardId) {
          const dot = dots.children[entry.ii];
          if (dot) dot.classList.toggle('read', nowRead);
        }
      }
      announce(nowRead ? `Marked read. ${progressLabel(p)}` : `Marked unread. ${progressLabel(p)}`);
    }
    return p;
  }

  function answer(step, q, idx) {
    storage.setAnswer(step.id, q.id, idx);
    render('card');
    const exp = view.querySelector('.explain-head');
    if (exp && exp.focus) { try { exp.focus({ preventScroll: true }); } catch { exp.focus(); } }
    announce(idx === q.correct ? 'Correct.' : 'Incorrect. The correct answer is now marked.');
  }

  // ---------- interaction (delegated; survives re-renders) ----------
  view.addEventListener('click', (e) => {
    const t = e.target;
    const closest = (sel) => t && t.closest && t.closest(sel);
    const step = currentStep();

    const list = closest('[data-list]');
    if (list && step) {
      storage.setListMode(step.id, list.getAttribute('data-list') === 'on');
      render();
      return;
    }
    const deckBtn = closest('[data-deck]');
    if (deckBtn && step) {
      if (deckBtn.getAttribute('data-deck') === 'next') deckNext(step);
      else deckMove(step, -1);
      return;
    }
    const tab = closest('[data-goto]');
    if (tab && step) { deckGoto(step, Number(tab.getAttribute('data-goto'))); return; }

    const mark = closest('.mark');
    if (mark) {
      const card = mark.closest('.card');
      if (step && card) toggleCard(step.id, card.dataset.card, mark);
      return;
    }
    const opt = closest('.opt:not([disabled])');
    if (opt && step) {
      const quiz = opt.closest('.quiz');
      const q = questionsFor(step.id).find((x) => x.id === quiz.dataset.q);
      if (!q) return;
      answer(step, q, Number(opt.dataset.i));
      return;
    }
    const arm = closest('[data-reset-arm]');
    if (arm) { resetArmed = arm.getAttribute('data-reset-arm'); render(); focusReset(); return; }
    const cancel = closest('[data-reset-cancel]');
    if (cancel) { resetArmed = null; render(); focusReset(); return; }
    const confirm = closest('[data-reset-confirm]');
    if (confirm) {
      const id = confirm.getAttribute('data-reset-confirm');
      storage.resetAnswers(id);
      storage.setDeckPos(id, 0);
      resetArmed = null;
      render();
      focusReset();
      announce('Answers reset.');
    }
  });

  function focusReset() {
    const b = view.querySelector('[data-reset-zone] button');
    if (b && b.focus) { try { b.focus({ preventScroll: true }); } catch { b.focus(); } }
  }

  /* Keyboard (DIV-50 / absorbed DIV-48). Ignored while focus is in a form field. */
  function inField(el) {
    if (!el || !el.tagName) return false;
    const tag = el.tagName.toUpperCase();
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable === true;
  }
  if (document.addEventListener) {
    document.addEventListener('keydown', (e) => {
      const step = currentStep();
      if (!step || e.metaKey || e.ctrlKey || e.altKey) return;
      if (inField(document.activeElement)) return;
      if (storage.listMode(step.id)) return;
      const deck = deckOf(step.id);
      if (!deck.total) return;
      const key = e.key;
      if (key === 'ArrowRight') { e.preventDefault(); deckMove(step, 1); return; }
      if (key === 'ArrowLeft') { e.preventDefault(); deckMove(step, -1); return; }
      if (key === 'n' || key === 'N') { e.preventDefault(); deckNext(step); return; }
      const pos = clamp(storage.deckPos(step.id), 0, deck.total - 1);
      const entry = deck.flat[pos];
      if (deck.kind === 'card') {
        if (key === ' ' || key === 'Spacebar') {
          e.preventDefault();
          toggleCard(step.id, entry.item.id, view.querySelector('.stage .mark'));
          return;
        }
        if (key === '1' || key === '2') {
          e.preventDefault();
          const lane = view.querySelectorAll('.stage .lane')[Number(key) - 1];
          if (lane) lane.open = !lane.open;
        }
        return;
      }
      const letter = 'ABCD'.indexOf(String(key).toUpperCase());
      if (letter >= 0 && !(entry.item.id in storage.answers(step.id))) {
        e.preventDefault();
        answer(step, entry.item, letter);
      }
    });
  }

  /* Touch: swipe left / right on the stage. Pointer events, ~40px threshold, no library. */
  let swipeX = null;
  view.addEventListener('pointerdown', (e) => {
    const stage = e.target && e.target.closest && e.target.closest('.stage');
    swipeX = stage ? e.clientX : null;
  });
  view.addEventListener('pointerup', (e) => {
    if (swipeX == null) return;
    const dx = e.clientX - swipeX;
    swipeX = null;
    const step = currentStep();
    if (!step || Math.abs(dx) < 40) return;
    deckMove(step, dx < 0 ? 1 : -1);
  });

  // internal navigation: render directly on click, mirror to the hash when possible
  function navigateTo(hash) {
    routeHash = hash === '#/' ? '' : hash;
    try { if (location.hash !== routeHash) location.hash = routeHash || '#/'; } catch { /* data:/sandbox */ }
    resetArmed = null;
    render();
    const step = currentStep();
    announce(step ? `${step.title}. ${progressLabel(progressOf(step.id))}` : 'Journey map.');
  }
  if (document.addEventListener) {
    document.addEventListener('click', (e) => {
      const a = e.target && e.target.closest && e.target.closest('a[href^="#/"]');
      if (!a) return;
      e.preventDefault();
      navigateTo(a.getAttribute('href'));
    });
  }

  /* "last verified" footer date, from the single source in js/content.js (R15).
     Flags visibly when the date is stale (>4 months). */
  function renderLastVerified() {
    const el = document.getElementById('last-verified');
    const iso = window.CCAF_LAST_VERIFIED;
    if (!el || !/^\d{4}-\d{2}-\d{2}$/.test(iso || '')) return;
    const d = new Date(iso + 'T00:00:00Z');
    el.setAttribute('datetime', iso);
    el.textContent = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
    const ageDays = (Date.now() - d.getTime()) / 86400000;
    if (ageDays > 120) {
      el.classList.add('stale');
      el.title = 'This guide is overdue for its quarterly check against the official blueprint — verify facts against the official exam guide.';
    }
  }

  addEventListener('hashchange', () => { routeHash = location.hash; resetArmed = null; render(); });
  renderStory();
  renderSocial();
  renderLastVerified();
  if (window.CCAF_ORB) CCAF_ORB.mountAll(document);
  render();

  // public surface for later tickets and the smoke harness
  window.CCAF = {
    steps: STEPS, storage, progressOf, progressLabel, toggleCard,
    deckOf, deckNext, deckMove, deckGoto, stepState,
  };
})();
