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

  /* Brand marks. These are the one exception to the 1.5px hairline language:
     a logo is a fixed shape, and outlining it makes it unrecognisable at 16px.
     They are drawn filled from currentColor, kept small, and always paired with
     a mono text label — so the glyph never carries the meaning on its own. */
  const BRANDS = {
    linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
    x: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932zM17.61 20.644h2.039L6.486 3.24H4.298z',
    substack: 'M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z',
    youtube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  };

  /* brand(name) — always decorative; the link's own text label is the name. */
  function brand(name) {
    const d = BRANDS[name];
    return d ? `<svg class="ico-brand" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${d}"/></svg>` : '';
  }

  /* icon(name) — decorative by default; pass a label only when the glyph is
     the sole carrier of meaning (it never is on this site). */
  function icon(name, label) {
    const d = PATHS[name];
    if (!d) return '';
    const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true" focusable="false"';
    return `<svg class="ico" viewBox="0 0 24 24" ${a11y}>${d}</svg>`;
  }

  const CCAF_ICONS = { icon, brand, names: Object.keys(PATHS), brands: Object.keys(BRANDS) };
  if (typeof window !== 'undefined') window.CCAF_ICONS = CCAF_ICONS;
})();
