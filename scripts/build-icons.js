// Regenerates the favicons and the Apple touch icon from assets/mark.svg, so
// the PNG fallbacks can never drift from the vector mark.
// Needs a local Chrome. Run from the repo root:  node scripts/build-icons.js
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const root = path.resolve(__dirname, '..');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
if (!fs.existsSync(CHROME)) {
  console.error(`Chrome not found at ${CHROME}. Set CHROME=/path/to/chrome and retry.`);
  process.exit(1);
}

const svg = fs.readFileSync(path.join(root, 'assets/mark.svg'), 'utf8');
const targets = [
  { file: 'favicon-16.png', size: 16 },
  { file: 'favicon-32.png', size: 32 },
  { file: 'apple-touch-icon.png', size: 180 },
];

for (const { file, size } of targets) {
  // the SVG is inlined so the page has no sub-resource to wait on
  const page = `<!doctype html><meta charset="utf-8">
<style>html,body{margin:0;width:${size}px;height:${size}px;overflow:hidden}
svg{display:block;width:${size}px;height:${size}px}</style>
${svg.replace(/width="64" height="64"/, `width="${size}" height="${size}"`)}`;
  const tmp = path.join(os.tmpdir(), `ccaf-icon-${size}.html`);
  fs.writeFileSync(tmp, page);
  execFileSync(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--virtual-time-budget=2000',
    `--window-size=${size},${size}`,
    `--screenshot=${path.join(root, 'assets', file)}`,
    `file://${tmp}`,
  ], { stdio: 'ignore' });
  fs.unlinkSync(tmp);
  console.log(`built assets/${file} (${size}×${size})`);
}
