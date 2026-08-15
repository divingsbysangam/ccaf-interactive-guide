// Regenerates demos/scaffold-preview.html: a single-file bundle of index.html
// with css/main.css and the js/ files inlined. Used for the in-app preview pane,
// which renders local files as static snapshots and cannot load external assets.
// Run from the repo root:  node scripts/build-preview.js
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

let html = read('index.html');
html = html.replace('<link rel="stylesheet" href="css/main.css">', () => `<style>\n${read('css/main.css')}\n</style>`);
for (const f of ['js/particles.js', 'js/content.js', 'js/app.js']) {
  html = html.replace(`<script src="${f}"></script>`, () => `<script>\n${read(f)}\n</script>`);
}
html = html.replace('<title>', '<!-- GENERATED preview bundle: do not edit; run `node scripts/build-preview.js` -->\n<title>[Preview] ');
fs.writeFileSync(path.join(root, 'demos/scaffold-preview.html'), html);
console.log(`built demos/scaffold-preview.html (${html.length} bytes)`);
