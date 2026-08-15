// Link-rot check for the quarterly refresh (docs/QUARTERLY-REFRESH.md §3).
// Extracts every https:// URL from js/content.js and README.md, requests each,
// and reports anything that isn't 2xx/3xx or that times out.
// Run from the repo root:  node scripts/check-links.js
// Exit code 1 if any link fails, so it can gate a CI job later if wanted.
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const sources = ['js/content.js', 'README.md'];

// URLs that legitimately can't be fetched anonymously (private repo clone URL).
const SKIP = [/^https:\/\/github\.com\/divingsbysangam\/ccaf-interactive-guide(\.git)?$/];

const urls = new Set();
for (const f of sources) {
  const text = fs.readFileSync(path.join(root, f), 'utf8');
  for (const m of text.matchAll(/https:\/\/[^\s"'<>)\]`]+/g)) {
    const u = m[0].replace(/[.,;:]+$/, '');
    if (!SKIP.some((re) => re.test(u))) urls.add(u);
  }
}

async function check(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    // HEAD first (cheap); some hosts reject HEAD, so fall back to GET.
    let res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: ctrl.signal,
      headers: { 'user-agent': 'ccaf-guide-link-check/1.0' } });
    if (res.status === 405 || res.status === 403 || res.status === 404) {
      res = await fetch(url, { method: 'GET', redirect: 'follow', signal: ctrl.signal,
        headers: { 'user-agent': 'ccaf-guide-link-check/1.0' } });
    }
    return { url, status: res.status, ok: res.status < 400 };
  } catch (e) {
    return { url, status: e.name === 'AbortError' ? 'timeout' : String(e.message || e), ok: false };
  } finally {
    clearTimeout(t);
  }
}

(async () => {
  const list = [...urls].sort();
  console.log(`checking ${list.length} links…\n`);
  const results = await Promise.all(list.map(check));
  let bad = 0;
  for (const r of results) {
    const mark = r.ok ? ' ok ' : 'FAIL';
    if (!r.ok) bad++;
    console.log(`[${mark}] ${String(r.status).padEnd(7)} ${r.url}`);
  }
  console.log(`\n${list.length - bad} ok, ${bad} failing`);
  process.exit(bad ? 1 : 0);
})();
