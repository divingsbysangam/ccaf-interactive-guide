// WCAG 2.2 contrast audit for the Divings Field System tokens as this site uses
// them (DIV-49 acceptance, docs/ACCESSIBILITY-AUDIT-2026-08.md item A3).
// Reads the real values out of css/main.css so the check can never drift from
// the stylesheet. Run from the repo root:  node scripts/check-contrast.js
const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'main.css'), 'utf8');
const T = {};
for (const [, name, value] of css.matchAll(/(--color-[\w-]+):\s*(#[0-9A-Fa-f]{6});/g)) T[name] = value;

const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
function L(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => lin(v / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const ratio = (a, b) => {
  const [x, y] = [L(a), L(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

// [role, foreground token, background token, minimum]
// 4.5 = body / small text · 3.0 = large text (>=24px, or >=19px bold) and UI borders
const PAIRS = [
  ['body text on paper',            'foreground',           'background', 4.5],
  ['muted text on paper',           'muted',                'background', 4.5],
  ['muted text on chalk',           'muted',                'surface',    4.5],
  ['body text on chalk',            'foreground',           'surface',    4.5],
  ['hot-signal small text on chalk','primary-ink',          'surface',    4.5],
  ['hot-signal small text on paper','primary-ink',          'background', 4.5],
  ['hot-signal display on paper',   'primary',              'background', 3.0],
  ['solid hot-signal button',       'primary-foreground',   'primary-ink', 4.5],
  ['hot-signal fill as a graphic',  'primary',              'background', 3.0],
  ['inverse body on steel',         'inverse-foreground',   'inverse',    4.5],
  ['inverse muted on steel',        'inverse-muted',        'inverse',    4.5],
  ['hot signal on steel',           'primary-on-inverse',   'inverse',    4.5],
  ['correct badge on paper',        'success',              'background', 4.5],
  ['correct badge on its tint',     'success',              'success-soft', 4.5],
  ['wrong badge on paper',          'danger',               'background', 4.5],
  ['wrong badge on its tint',       'danger',               'danger-soft',  4.5],
  ['stale-date warning as text',    'warning-ink',          'background', 4.5],
  ['hairline rule on paper',        'border',               'background', 1.0],
];

let worst = Infinity, failed = 0;
for (const [role, fg, bg, min] of PAIRS) {
  const a = T['--color-' + fg], b = T['--color-' + bg];
  if (!a || !b) { console.error(`FAIL: missing token --color-${fg} or --color-${bg}`); failed++; continue; }
  const r = ratio(a, b);
  const ok = r + 1e-9 >= min;
  if (!ok) failed++;
  if (min >= 3) worst = Math.min(worst, r);
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${r.toFixed(2)}:1  (min ${min.toFixed(1)})  ${role}  ${a} on ${b}`);
}

// --color-warning is a fill/rule colour only; assert nobody has started using it as text
if (/color:\s*var\(--color-warning\)/.test(css.replace(/site-foot time\.stale[\s\S]*?\}/g, ''))) {
  console.error('FAIL: --color-warning used as a text colour (2.42:1 on white) — use --color-warning-ink');
  failed++;
}

console.log(failed ? `\n${failed} contrast failure(s)` : `\nPASS: every pairing meets WCAG 2.2 AA (worst graded pair ${worst.toFixed(2)}:1)`);
process.exit(failed ? 1 : 0);
