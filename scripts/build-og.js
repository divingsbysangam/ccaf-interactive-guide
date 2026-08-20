// Regenerates assets/og-image.png (1200×630) from scripts/og/og-source.html —
// the social preview card, drawn in the Divings Field System with the same
// stylesheet, the same self-hosted fonts and the same orb the site uses.
// Needs a local Chrome. Run from the repo root:  node scripts/build-og.js
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const src = path.join(root, 'scripts/og/og-source.html');
const out = path.join(root, 'assets/og-image.png');

if (!fs.existsSync(CHROME)) {
  console.error(`Chrome not found at ${CHROME}. Set CHROME=/path/to/chrome and retry.`);
  process.exit(1);
}

execFileSync(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars',
  '--allow-file-access-from-files',
  '--virtual-time-budget=4000',
  '--window-size=1200,630',
  `--screenshot=${out}`,
  `file://${src}`,
], { stdio: 'ignore' });

const { size } = fs.statSync(out);
console.log(`built assets/og-image.png (${(size / 1024).toFixed(1)} KB)`);
