import assert from 'node:assert/strict';
import { test } from 'node:test';
import { contrastRatio, FONTS, googleFontsHref, themeCss, themeVars } from '../src/lib/theme.js';

const T = { nav_bg: '#112233', nav_text: '#ffffff', footer_bg: '#000000', footer_text: '#ffffff', page_bg: '#f9f3f2', accent: '#b5736a', card_bg: '#ffffff', font_heading: 'playfair-display', font_body: 'inter', card_radius: 12, card_shadow: 'soft', card_border: false };

test('a valid theme becomes the expected CSS variables', () => {
  const v = themeVars(T);
  assert.equal(v['--nav-bg'], '#112233');
  assert.equal(v['--accent'], '#b5736a');
  assert.equal(v['--serif'], FONTS['playfair-display'].family);
  assert.equal(v['--sans'], FONTS.inter.family);
  assert.equal(v['--card-radius'], '12px');
  assert.equal(v['--card-shadow'], '0 4px 14px rgba(0,0,0,.14)');
  assert.equal(v['--card-border'], 'transparent');
});

test('anything that is not a plain #RRGGBB, a listed font or a small integer is dropped', () => {
  const css = themeCss({
    nav_bg: 'red;background:url(//evil.com)', nav_text: '#fff</style><script>alert(1)</script>', footer_bg: '#12345',
    accent: 'expression(alert(1))', font_heading: 'Comic Sans; } body{display:none', font_body: '__proto__',
    card_radius: '8px; x', card_shadow: '0 0 0 100vmax red', card_border: 'yes',
  });
  assert.equal(css, ':root{}');
});

test('buttons, price, badges, width and banner become variables', () => {
  const v = themeVars({ button_style: 'pill', price_color: '#aa3366', badge_promo: '#112233', badge_out: '#445566', site_width: 'wide', banner_height: 'compact' });
  assert.equal(v['--btn-radius'], '999px');
  assert.equal(v['--price-color'], '#aa3366');
  assert.equal(v['--badge-promo'], '#112233');
  assert.equal(v['--badge-out'], '#445566');
  assert.equal(v['--site-width'], '1440px');
  assert.equal(v['--shop-max'], '1576px');
  assert.equal(v['--ads-h'], 'clamp(160px,20vw,380px)');
  assert.equal(v['--ads-h-m'], '220px');
});

test('a null price colour writes nothing, so the original colours stay', () => {
  assert.equal(themeVars({ price_color: null })['--price-color'], undefined);
});

test('free-text width, banner height and button style are dropped', () => {
  assert.deepEqual(themeVars({ site_width: '100vw', banner_height: '0', button_style: '999px;x', price_color: 'red', badge_promo: 'url(//e)' }), {});
});

test('radius limits and the unknown-key attack', () => {
  assert.equal(themeVars({ card_radius: 25 })['--card-radius'], undefined);
  assert.equal(themeVars({ card_radius: -1 })['--card-radius'], undefined);
  assert.equal(themeVars({ card_radius: 0 })['--card-radius'], '0px');
  assert.deepEqual(themeVars({ custom_css: 'body{display:none}', constructor: 'x' }), {});
});

test('the generated CSS never contains characters that could close or open a tag', () => {
  assert.doesNotMatch(themeCss(T), /[<>"&]/);
});

test('Google Fonts link lists only the chosen fonts, and nothing for Lora alone', () => {
  assert.equal(googleFontsHref({ font_heading: 'lora', font_body: 'lora' }), null);
  assert.equal(googleFontsHref({ font_heading: 'poppins', font_body: 'poppins' }), 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
  assert.match(googleFontsHref({ font_heading: 'playfair-display', font_body: 'dm-sans' }), /family=Playfair\+Display.*&family=DM\+Sans/);
  assert.equal(googleFontsHref({ font_heading: 'evil.com/x', font_body: 'lora' }), null);
});

test('contrast: black on white is 21, same colour is 1, bad input is null', () => {
  assert.equal(Math.round(contrastRatio('#000000', '#ffffff')), 21);
  assert.equal(contrastRatio('#336699', '#336699'), 1);
  assert.ok(contrastRatio('#777777', '#888888') < 2);
  assert.equal(contrastRatio('#fff', '#000000'), null);
});
