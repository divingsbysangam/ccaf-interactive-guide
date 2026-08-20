/* CCA-F Interactive Guide — hairline icon set (DIV-49)
   ---------------------------------------------------------------------------
   The twelve icons approved in demos/wireframe-components.html, carried over
   UNCHANGED: same path data, 1.5px stroke, rounded caps and joins, 24-unit
   box, drawn inline (no icon font, no library). Colour comes from
   `currentColor`, so an icon is ink by default and only takes the hot signal
   when the icon *is* a state.
   --------------------------------------------------------------------------- */
(function () {
  'use strict';

  const PATHS = {
    blueprint: '<path d="M4 19V5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2zm0 0a2 2 0 0 1 2-2h12"/>',
    reading:   '<path d="M4 6h16M4 12h16M4 18h10"/>',
    labs:      '<path d="M9 3h6l1 4h3v4l-2 1v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-6l-2-1V7h3z"/>',
    drills:    '<circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/>',
    mock:      '<path d="M6 4h12v16l-6-3-6 3z"/>',
    next:      '<path d="M5 12h14M13 6l6 6-6 6"/>',
    prev:      '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    done:      '<path d="M5 12l5 5L20 7"/>',
    external:  '<path d="M7 17L17 7M9 7h8v8"/>',
    expand:    '<path d="M12 5v14M5 12h14"/>',
    verified:  '<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 3v4M16 3v4M4 11h16"/>',
    sangam:    '<path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z"/>',
    keyboard:  '<rect x="3" y="7" width="18" height="12" rx="2"/><path d="M7 11h.01M11 11h.01M15 11h.01M7 15h10"/>',
  };

  /* icon(name) — decorative by default; pass a label only when the glyph is
     the sole carrier of meaning (it never is on this site). */
  function icon(name, label) {
    const d = PATHS[name];
    if (!d) return '';
    const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true" focusable="false"';
    return `<svg class="ico" viewBox="0 0 24 24" ${a11y}>${d}</svg>`;
  }

  const CCAF_ICONS = { icon, names: Object.keys(PATHS) };
  if (typeof window !== 'undefined') window.CCAF_ICONS = CCAF_ICONS;
})();
