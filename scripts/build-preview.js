// Regenerates demos/scaffold-preview.html: a single-file bundle of index.html
// with css/main.css, the js/ files and the self-hosted fonts inlined. Used for
// the in-app preview pane, which renders local files as static snapshots and
// cannot load external assets — so the woff2 faces become data: URIs too,
// otherwise the Field System type would silently fall back to system fonts.
// Run from the repo root:  node scripts/build-preview.js
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

let css = read('css/main.css');
// inline every ../assets/fonts/*.woff2 referenced by an @font-face src
css = css.replace(/url\('\.\.\/assets\/fonts\/([\w.-]+)'\)/g, (m, file) => {
  const b64 = fs.readFileSync(path.join(root, 'assets/fonts', file)).toString('base64');
  return `url('data:font/woff2;base64,${b64}')`;
});

let html = read('index.html');
html = html.replace('<link rel="stylesheet" href="css/main.css">', () => `<style>\n${css}\n</style>`);
// the preload hints point at files the bundle no longer fetches
html = html.replace(/^\s*<link rel="preload"[^>]*>\s*$/gm, '');
for (const f of ['js/orb.js', 'js/icons.js', 'js/content.js', 'js/app.js']) {
  html = html.replace(`<script src="${f}"></script>`, () => `<script>\n${read(f)}\n</script>`);
}
html = html.replace('<title>', '<!-- GENERATED preview bundle: do not edit; run `node scripts/build-preview.js` -->\n<title>[Preview] ');
fs.writeFileSync(path.join(root, 'demos/scaffold-preview.html'), html);
console.log(`built demos/scaffold-preview.html (${html.length} bytes)`);
