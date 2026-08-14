/* Ambient particle layer (plan R16) — adapted from the approved reference
   demos/guide-particles-preview.html.
   Exposes window.CCAF_FX = { burst(x, y), setPathElement(el|null) }.
   prefers-reduced-motion: ambient animation fully disabled — static faint dots only. */

(function () {
  const cv = document.getElementById('ambient');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DPR = Math.min(devicePixelRatio || 1, 2);

  let W, H;
  function resize() {
    W = cv.width = innerWidth * DPR;
    H = cv.height = innerHeight * DPR;
    cv.style.width = innerWidth + 'px';
    cv.style.height = innerHeight + 'px';
  }
  resize();
  addEventListener('resize', resize);

  // three depth layers of slow drifting particles
  const layers = [
    { n: 90, speed: 0.02, size: 1.0, alpha: 0.35 },
    { n: 60, speed: 0.045, size: 1.6, alpha: 0.5 },
    { n: 30, speed: 0.08, size: 2.2, alpha: 0.7 },
  ];
  const dots = [];
  for (const L of layers) {
    for (let i = 0; i < L.n; i++) {
      dots.push({
        x: Math.random(), y: Math.random(),
        a: Math.random() * Math.PI * 2,
        tw: Math.random() * Math.PI * 2,
        burst: 0, // >0 while flying out of a completion burst
        L,
      });
    }
  }

  // sparks travelling down the journey path (only while a path element is registered)
  let pathEl = null;
  const sparks = [];
  function spawnSpark() {
    if (!pathEl || reduced) return;
    const r = pathEl.getBoundingClientRect();
    if (r.height < 10) return;
    sparks.push({ frac: 0, v: 0.0015 + Math.random() * 0.002 });
    if (sparks.length > 14) sparks.shift();
  }
  setInterval(spawnSpark, 700);

  const mouse = { x: -1e5, y: -1e5 };
  addEventListener('mousemove', (e) => { mouse.x = e.clientX * DPR; mouse.y = e.clientY * DPR; });

  function drawStatic() {
    // reduced-motion: one calm, motionless render
    ctx.clearRect(0, 0, W, H);
    for (const d of dots) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(140,195,255,${d.L.alpha * 0.35})`;
      ctx.arc(d.x * W, d.y * H, d.L.size * DPR, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function draw(t) {
    requestAnimationFrame(draw);
    const time = t / 1000;
    ctx.clearRect(0, 0, W, H);

    for (const d of dots) {
      const boost = d.burst > 0 ? 40 : 1; // burst particles fly fast, then settle
      d.x += Math.cos(d.a) * d.L.speed * boost / 1000;
      d.y += Math.sin(d.a) * d.L.speed * boost / 1000;
      d.a += Math.sin(time * 0.1 + d.tw) * 0.002;
      if (d.burst > 0) d.burst -= 0.02;
      if (d.x < 0) d.x = 1; if (d.x > 1) d.x = 0;
      if (d.y < 0) d.y = 1; if (d.y > 1) d.y = 0;

      let px = d.x * W, py = d.y * H;
      // particles lean gently away from the cursor
      const dx = px - mouse.x, dy = py - mouse.y;
      const dist2 = dx * dx + dy * dy, R = 120 * DPR;
      if (dist2 < R * R) {
        const dist = Math.sqrt(dist2) + 1;
        const f = (1 - dist / R) * 14 * DPR;
        px += (dx / dist) * f; py += (dy / dist) * f;
      }

      const tw = 0.6 + 0.4 * Math.sin(time * 0.8 + d.tw);
      const warm = d.burst > 0;
      ctx.beginPath();
      ctx.fillStyle = warm
        ? `rgba(255,205,120,${0.5 + d.burst * 0.4})`
        : `rgba(140,195,255,${d.L.alpha * tw * 0.5})`;
      ctx.arc(px, py, d.L.size * DPR * tw, 0, Math.PI * 2);
      ctx.fill();
    }

    // journey-path line + sparks
    if (pathEl) {
      const r = pathEl.getBoundingClientRect();
      if (r.height > 10) {
        const px = (r.left + 46) * DPR; // through the node centers
        const yTop = r.top * DPR, yBot = r.bottom * DPR;
        const grad = ctx.createLinearGradient(0, yTop, 0, yBot);
        grad.addColorStop(0, 'rgba(120,190,255,0.10)');
        grad.addColorStop(1, 'rgba(120,190,255,0.03)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1 * DPR;
        ctx.beginPath(); ctx.moveTo(px, yTop); ctx.lineTo(px, yBot); ctx.stroke();

        for (let i = sparks.length - 1; i >= 0; i--) {
          const s = sparks[i];
          s.frac += s.v;
          if (s.frac >= 1) { sparks.splice(i, 1); continue; }
          const yv = yTop + (yBot - yTop) * s.frac;
          const tail = 26 * DPR;
          const g = ctx.createLinearGradient(px, yv - tail, px, yv);
          g.addColorStop(0, 'rgba(120,200,255,0)');
          g.addColorStop(1, 'rgba(160,215,255,0.8)');
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.6 * DPR;
          ctx.beginPath(); ctx.moveTo(px, yv - tail); ctx.lineTo(px, yv); ctx.stroke();
          ctx.beginPath();
          ctx.fillStyle = 'rgba(200,235,255,0.9)';
          ctx.arc(px, yv, 1.8 * DPR, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  window.CCAF_FX = {
    /* gentle completion burst at viewport coords (CSS px) */
    burst(x, y) {
      if (reduced) return;
      for (let i = 0; i < 26; i++) {
        const d = dots[(Math.random() * dots.length) | 0];
        d.x = (x * DPR) / W; d.y = (y * DPR) / H;
        d.a = Math.random() * Math.PI * 2;
        d.burst = 1;
      }
    },
    /* element the path sparks should follow (the .map), or null on step pages */
    setPathElement(el) { pathEl = el; sparks.length = 0; },
  };

  if (reduced) { drawStatic(); addEventListener('resize', drawStatic); }
  else requestAnimationFrame(draw);
})();
