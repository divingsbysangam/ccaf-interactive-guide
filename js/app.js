/* CCA-F Interactive Guide — app shell (DIV-23) + quick-bit card system (DIV-24)
   Single-page hash routing (#/ and #/step/<id>) so localStorage behaves
   identically on file:// and on Vercel.
   Progress is DERIVED from cards read (js/content.js is the registry) —
   nothing stores a step state that could drift from reality. */

(function () {
  'use strict';

  // ---------- step definitions ----------
  const STEPS = [
    {
      id: 'blueprint', n: 1, title: 'Blueprint',
      blurb: 'What the exam is, the five domains and weights, and the official material worth your time.',
      lede: 'Orient before you study: how the exam works, what it costs, what it covers, and where the official sources live.',
    },
    {
      id: 'reading', n: 2, title: 'Reading',
      blurb: 'Quick-bit concept cards — two minutes each, with a "from zero" lane if agent-native is new territory.',
      lede: 'Bite-sized concepts across all five domains. Each card is a two-minute read with optional depth when you need it.',
    },
    {
      id: 'labs', n: 3, title: 'Labs',
      blurb: 'Build small things in Claude Code yourself. The exam tests judgment — judgment comes from building.',
      lede: 'Guided missions you build yourself in Claude Code. The exam rewards implementation taste, and taste comes from reps.',
    },
    {
      id: 'drills', n: 4, title: 'Drills',
      blurb: 'Analogy-framed questions with four close options — recognition training for the real exam style.',
      lede: 'The questions never name the concept they test. These drills train you to recognize it anyway.',
    },
    {
      id: 'mock', n: 5, title: 'Mock Exam',
      blurb: 'Feel the format, then finish on full-length community mocks. Then book your seat.',
      lede: 'Sample the real feel here, then take full-length community mock exams — and book your seat.',
    },
  ];

  function cardsOf(stepId) {
    return (window.CCAF_CARDS && window.CCAF_CARDS[stepId]) || [];
  }

  // exam domains (weights from the official blueprint) — used to group Reading cards
  const DOMAINS = [
    { id: 'agentic', name: 'Agentic Architecture & Orchestration', weight: '27%' },
    { id: 'claude-code', name: 'Claude Code Configuration & Workflows', weight: '20%' },
    { id: 'prompting', name: 'Prompt Engineering & Structured Output', weight: '20%' },
    { id: 'tools-mcp', name: 'Tool Design & MCP Integration', weight: '18%' },
    { id: 'context', name: 'Context Management & Reliability', weight: '15%' },
  ];

  // ---------- progress storage (R13 foundation) ----------
  const KEY = 'ccaf.v1.progress';
  let mem = null; // in-memory fallback when localStorage is unavailable (sandboxed previews, strict private modes) — progress then lives for the session only
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

  function drillHTML(q, num, selected) {
    const answered = Number.isInteger(selected);
    const opts = q.options.map((o, i) => {
      let cls = 'opt';
      if (answered) {
        if (i === q.correct) cls += ' right';
        else if (i === selected) cls += ' chosen-wrong';
        else cls += ' faded';
      }
      return `<button type="button" class="${cls}" data-i="${i}" ${answered ? 'disabled' : ''}>
        <span class="letter">${'ABCD'[i]}</span><span class="opt-text">${o.text}</span>
      </button>`;
    }).join('');
    const explain = answered
      ? `<div class="explain">${q.options.map((o, i) => `
          <p class="${i === q.correct ? 'exp-right' : ''}"><b>${'ABCD'[i]}${i === q.correct ? ' ✓' : ''}.</b> ${o.explain}</p>`).join('')}
        </div>`
      : '';
    return `
    <article class="card quiz" data-q="${q.id}">
      <p class="scenario"><span class="qnum">Q${num}</span>${q.scenario}</p>
      <div class="opts">${opts}</div>
      ${explain}
    </article>`;
  }

  // ---------- rendering ----------
  const view = document.getElementById('view');
  const hero = document.getElementById('hero');
  const story = window.CCAF_STORY || { hero: null, waypoints: [] };

  function renderStory() {
    const el = document.getElementById('story');
    if (!el || !story.hero) return;
    el.innerHTML = `
      <p>${story.hero.lead}</p>
      <p>${story.hero.why}</p>
      <p>${story.hero.result}</p>
      <p class="story-sign">— Sangam</p>`;
  }

  /* first unread thing across the journey: for "Continue →" (R17) */
  function nextUp() {
    for (const s of STEPS) {
      const p = progressOf(s.id);
      if (p.state !== 'done') return s;
    }
    return null;
  }

  function renderHeroCTA() {
    const el = document.getElementById('hero-cta');
    if (!el) return;
    const anyProgress = STEPS.some((s) => progressOf(s.id).state !== 'new');
    const next = nextUp();
    if (!anyProgress) {
      el.innerHTML = `<a class="btn" href="#/step/blueprint">Start with the Blueprint</a>`;
    } else if (next) {
      el.innerHTML = `<a class="btn" href="#/step/${next.id}">Continue → ${next.title}</a>`;
    } else {
      el.innerHTML = `<a class="btn" href="#/step/mock">All five steps done — book your exam</a>`;
    }
  }

  function waypointHTML(stepId) {
    const w = story.waypoints.find((x) => x.stepId === stepId);
    if (!w) return '';
    return `
    <aside class="waypoint">
      <p class="wp-kicker">From Sangam's journey</p>
      <h3>${w.title}</h3>
      <p>${w.body}</p>
    </aside>`;
  }

  function renderMap() {
    hero.classList.remove('compact');
    renderHeroCTA();
    const items = STEPS.map((s) => {
      const p = progressOf(s.id);
      return `
      <a class="step${p.state === 'done' ? ' done' : ''}" href="#/step/${s.id}" aria-label="Step ${s.n}: ${s.title} — ${progressLabel(p)}">
        <span class="node">${s.n}</span>
        <span><h3>${s.title}</h3><p>${s.blurb}</p></span>
        <span class="prog">${progressLabel(p)}</span>
      </a>`;
    }).join('');
    view.innerHTML = `<nav class="map" aria-label="Journey map">${items}</nav>`;
    window.CCAF_FX && CCAF_FX.setPathElement(view.querySelector('.map'));
  }

  function cardHTML(c, read) {
    const zeroLabel = c.zeroLabel || 'From zero — plain language &amp; a familiar-platform analogy';
    const twistLabel = c.twistLabel || 'How the exam twists this';
    const markLabels = c.markLabels || ['Mark as read', '✓ Read'];
    return `
    <article class="card${read ? ' read' : ''}" data-card="${c.id}">
      <header class="card-head">
        <div><h3>${c.title}</h3><span class="mins">~${c.minutes} min</span></div>
        <button class="mark" type="button" data-labels="${markLabels.join('|')}" aria-pressed="${read}">${read ? markLabels[1] : markLabels[0]}</button>
      </header>
      <div class="quick">${c.quick}</div>
      <details class="lane"><summary>${zeroLabel}</summary><div class="lane-body">${c.fromZero}</div></details>
      <details class="lane twist"><summary>${twistLabel}</summary><div class="lane-body">${c.examTwist}</div></details>
    </article>`;
  }

  function renderStep(step) {
    hero.classList.add('compact');
    const prev = STEPS[step.n - 2], next = STEPS[step.n];
    const cards = cardsOf(step.id);
    const read = storage.cardsRead(step.id);
    const p = progressOf(step.id);

    const hasDomains = cards.some((c) => c.domain);
    let body;
    if (step.id === 'drills' && questionsFor('drills').length) {
      const answers = storage.answers('drills');
      let num = 0;
      body = DOMAINS.map((d) => {
        const qs = questionsFor('drills').filter((q) => q.domain === d.id);
        if (!qs.length) return '';
        const dAnswered = qs.filter((q) => q.id in answers);
        const dCorrect = dAnswered.filter((q) => answers[q.id] === q.correct).length;
        return `
        <section class="domain">
          <header class="domain-head">
            <h3>${d.name}</h3>
            <span class="domain-meta">${qs.length} question${qs.length > 1 ? 's' : ''} · ${dCorrect} of ${dAnswered.length} answered correct</span>
          </header>
          <div class="cards">${qs.map((q) => drillHTML(q, ++num, answers[q.id])).join('')}</div>
        </section>`;
      }).join('');
      body += `<div class="drill-foot"><button type="button" class="btn ghost" data-reset="drills">Reset all answers</button></div>`;
    } else if (step.id === 'mock' && questionsFor('mock').length) {
      const answers = storage.answers('mock');
      let num = 0;
      const samples = questionsFor('mock').map((q) => drillHTML(q, ++num, answers[q.id])).join('');
      const links = (window.CCAF_MOCK_LINKS || []).map((l) => `
        <a class="ext-mock" href="${l.url}" target="_blank" rel="noopener">
          <span class="ext-name">${l.name} <span class="ext-arrow">↗</span></span>
          <span class="ext-note">${l.note}</span>
        </a>`).join('');
      body = `
        <section class="cards">${samples}</section>
        <section class="domain">
          <header class="domain-head">
            <h3>Full-length mock exams (community)</h3>
            <span class="domain-meta">each opens in a new tab — your progress here is untouched</span>
          </header>
          <div class="ext-panel">${links}</div>
        </section>
        <div class="book-cta">
          <p>Scoring comfortably on the mocks? You're ready.</p>
          <a class="btn" href="https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification" target="_blank" rel="noopener">Book your exam — official page</a>
        </div>
        <div class="drill-foot"><button type="button" class="btn ghost" data-reset="mock">Reset sample answers</button></div>`;
    } else if (!cards.length) {
      body = `<div class="placeholder">
           <b>${step.title} content is being written.</b><br>
           Quick-bit cards land here — each a two-minute read with optional "from zero" and
           "how the exam twists this" layers.
         </div>`;
    } else if (hasDomains) {
      // group by exam domain, in blueprint order, with per-domain progress
      body = DOMAINS.map((d) => {
        const dc = cards.filter((c) => c.domain === d.id);
        if (!dc.length) return '';
        const dDone = dc.filter((c) => read[c.id]).length;
        return `
        <section class="domain">
          <header class="domain-head">
            <h3>${d.name}</h3>
            <span class="domain-meta">${d.weight} of the exam · ${dDone} of ${dc.length} read</span>
          </header>
          <div class="cards">${dc.map((c) => cardHTML(c, !!read[c.id])).join('')}</div>
        </section>`;
      }).join('');
      const orphans = cards.filter((c) => !DOMAINS.some((d) => d.id === c.domain));
      if (orphans.length) body += `<section class="cards">${orphans.map((c) => cardHTML(c, !!read[c.id])).join('')}</section>`;
    } else {
      body = `<section class="cards">${cards.map((c) => cardHTML(c, !!read[c.id])).join('')}</section>`;
    }

    view.innerHTML = `
      <article class="step-page">
        <p class="crumb"><a href="#/">← Journey map</a></p>
        <div class="step-head">
          <span class="node">${step.n}</span><h2>${step.title}</h2>
          <span class="step-prog" id="step-prog">${(cards.length || questionsFor(step.id).length) ? progressLabel(p) : ''}</span>
        </div>
        <p class="lede">${step.lede}</p>
        ${waypointHTML(step.id)}
        ${body}
        <div class="step-nav">
          ${prev ? `<a class="btn ghost" href="#/step/${prev.id}">← ${prev.title}</a>` : `<a class="btn ghost" href="#/">← Journey map</a>`}
          ${next ? `<a class="btn ghost" href="#/step/${next.id}">${next.title} →</a>` : ''}
        </div>
      </article>`;
    window.CCAF_FX && CCAF_FX.setPathElement(null);
    scrollTo({ top: 0, behavior: 'auto' });
  }

  /* Route state lives in a variable, mirrored to location.hash when the
     environment allows it. Clicking links renders directly (see delegation
     below), so navigation works even where hash URLs don't resolve —
     e.g. sandboxed previews served from data: URLs. */
  let routeHash = (typeof location !== 'undefined' && location.hash) || '';

  function currentStep() {
    const m = routeHash.match(/^#\/step\/([a-z]+)$/);
    return (m && STEPS.find((s) => s.id === m[1])) || null;
  }

  function render() {
    const step = currentStep();
    if (step) renderStep(step);
    else renderMap();
  }

  // ---------- card interaction (event delegation; survives re-renders) ----------
  function toggleCard(stepId, cardId, btn) {
    const wasDone = progressOf(stepId).state === 'done';
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
      if (!wasDone && p.state === 'done' && window.CCAF_FX && btn.getBoundingClientRect) {
        const r = btn.getBoundingClientRect();
        CCAF_FX.burst(r.left + r.width / 2, r.top + r.height / 2);
      }
    }
    return p;
  }

  view.addEventListener('click', (e) => {
    const t = e.target;
    const mark = t && t.closest && t.closest('.mark');
    if (mark) {
      const step = currentStep();
      const card = mark.closest('.card');
      if (step && card) toggleCard(step.id, card.dataset.card, mark);
      return;
    }
    const opt = t && t.closest && t.closest('.opt:not([disabled])');
    if (opt) {
      const step = currentStep();
      if (!step) return;
      const quiz = opt.closest('.quiz');
      const q = questionsFor(step.id).find((x) => x.id === quiz.dataset.q);
      if (!q) return;
      const idx = Number(opt.dataset.i);
      storage.setAnswer(step.id, q.id, idx);
      // gentle particle response on a correct pick (R16); wrong answers just settle
      if (idx === q.correct && window.CCAF_FX && opt.getBoundingClientRect) {
        const r = opt.getBoundingClientRect();
        CCAF_FX.burst(r.left + r.width / 2, r.top + r.height / 2);
      }
      render(); // re-render reveals per-option explanations and updates counts
      const again = document.querySelector && document.querySelector(`.quiz[data-q="${q.id}"]`);
      if (again && again.scrollIntoView) again.scrollIntoView({ block: 'center', behavior: 'auto' });
      return;
    }
    const reset = t && t.closest && t.closest('[data-reset]');
    if (reset) {
      storage.resetAnswers(reset.getAttribute('data-reset'));
      render();
    }
  });

  // internal navigation: render directly on click, mirror to the hash when possible
  function navigateTo(hash) {
    routeHash = hash === '#/' ? '' : hash;
    try { if (location.hash !== routeHash) location.hash = routeHash || '#/'; } catch { /* data:/sandbox */ }
    render();
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
     Also flags visibly when the date is stale (>4 months) — an honest nudge to
     both the maintainer and the reader. */
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

  addEventListener('hashchange', () => { routeHash = location.hash; render(); });
  renderStory();
  renderLastVerified();
  render();

  // small public surface for later tickets and tests
  window.CCAF = { steps: STEPS, storage, progressOf, toggleCard };
})();
