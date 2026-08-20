/* CCA-F Interactive Guide — dot-lattice orbs (DIV-49)
   ---------------------------------------------------------------------------
   Ported VERBATIM from demos/wireframe-orbs.html (approved 2026-08-19). The
   lattice maths, the three state palettes, the rotation speed, the depth fade
   and the reduced-motion behaviour are unchanged — only the mounting API is
   new, so app.js can create orbs as it renders.

   In the spirit of Jakub Antalik's MIT "thinking orbs"; reimplemented from
   scratch in vanilla 2D canvas (no React, no deps). Credited in the README.

   These orbs are the site's ENTIRE motion budget: journey-map nodes, one tiny
   "you are here" in deck headers, one beside the brand in the hero.

   Palette note: grey / blue / gold are intentionally NOT Field System tokens.
   The orbs are a carried-over approved asset and stay exactly as designed.
   --------------------------------------------------------------------------- */
(function () {
  'use strict';

  const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DPR = Math.min((typeof devicePixelRatio === 'number' && devicePixelRatio) || 1, 2);

  /* Denser globe (closer to Antalik's dotted globe): points sit on latitude rings,
     so meridians and parallels read as structure rather than an even scatter.
     `rings` = number of latitude bands; dots per ring scale with the ring's radius. */
  const COLORS = {
    ahead:   { rgb: [125, 135, 148], rings: 13, perEq: 30, rot: 0,    dense: 1 },
    current: { rgb: [47, 111, 219],  rings: 15, perEq: 34, rot: 0.22, dense: 1.05 },
    done:    { rgb: [200, 144, 26],  rings: 15, perEq: 36, rot: 0,    dense: 1.15 },
  };

  function globe(rings, perEq) {
    const pts = [];
    for (let i = 0; i < rings; i++) {
      const lat = -Math.PI / 2 + (Math.PI * (i + 0.5)) / rings; // avoid exact poles
      const y = Math.sin(lat), r = Math.cos(lat);
      const n = Math.max(6, Math.round(perEq * r));
      const off = (i % 2) * (Math.PI / n);                      // stagger alternate rings
      for (let j = 0; j < n; j++) {
        const t = off + (j / n) * Math.PI * 2;
        pts.push([Math.cos(t) * r, y, Math.sin(t) * r]);
      }
    }
    return pts;
  }

  function draw(o, t) {
    const { ctx, size, cfg } = o, R = (size * DPR) / 2, rad = R * 0.86;
    const ang = o.a + t * cfg.rot, ca = Math.cos(ang), sa = Math.sin(ang);
    const tilt = -0.35, ct = Math.cos(tilt), st = Math.sin(tilt);
    ctx.clearRect(0, 0, size * DPR, size * DPR);
    const [r, g, b] = cfg.rgb;
    for (const [x0, y0, z0] of o.pts) {
      // rotate around Y, then tilt around X
      let x = x0 * ca + z0 * sa, z = -x0 * sa + z0 * ca, y = y0;
      const y2 = y * ct - z * st, z2 = y * st + z * ct;
      const depth = (z2 + 1) / 2;                 // 0 back … 1 front
      const alpha = 0.14 + depth * 0.78;          // back face fades further, front reads solid
      const dot = (0.5 + depth * 1.0) * (size / 56) * DPR * cfg.dense;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.arc(R + x * rad, R + y2 * rad, dot, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* Live orbs are held weakly-ish: mount() prunes canvases that left the DOM,
     so re-rendering a route never leaks animation work. */
  let live = [];
  let looping = false;

  function loop(ts) {
    const t = ts / 1000;
    live = live.filter((o) => o.c.isConnected !== false);
    for (const o of live) if (o.cfg.rot || !o.drawn) { draw(o, t); o.drawn = true; }
    if (live.length) requestAnimationFrame(loop);
    else looping = false;
  }

  const CCAF_ORB = {
    /* mount(canvas, state, size) — state: 'ahead' | 'current' | 'done' */
    mount(canvas, state, size) {
      if (!canvas || typeof canvas.getContext !== 'function') return null;
      const cfg = COLORS[state] || COLORS.ahead;
      canvas.width = size * DPR; canvas.height = size * DPR;
      canvas.style.width = size + 'px'; canvas.style.height = size + 'px';
      canvas.setAttribute('role', 'img');
      canvas.setAttribute('aria-hidden', 'true');   // the row's text carries the state
      const o = {
        c: canvas, ctx: canvas.getContext('2d'), size, cfg,
        pts: globe(cfg.rings, cfg.perEq), a: Math.random() * 6,   // same random start phase as the wireframe
      };
      if (reduced || !cfg.rot) { draw(o, 0); o.drawn = true; if (reduced) return o; }
      live.push(o);
      if (!looping && typeof requestAnimationFrame === 'function') { looping = true; requestAnimationFrame(loop); }
      return o;
    },
    /* mountAll(root) — picks up every <canvas class="orb" data-state data-size> */
    mountAll(root) {
      const scope = root || document;
      if (!scope.querySelectorAll) return;
      scope.querySelectorAll('canvas.orb').forEach((c) => {
        if (c.dataset.mounted === '1') return;
        c.dataset.mounted = '1';
        CCAF_ORB.mount(c, c.dataset.state, +c.dataset.size || 48);
      });
    },
    reduced,
  };

  if (typeof window !== 'undefined') window.CCAF_ORB = CCAF_ORB;
})();
