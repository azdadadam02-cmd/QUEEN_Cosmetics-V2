/** Polices proposées : les mêmes clés que ThemeSetting::FONTS (Laravel). google = nom dans l'URL de Google Fonts. */
export const FONTS = {
  lora: { label: 'Lora (actuelle)', family: 'Lora, Georgia, Times New Roman, serif', google: 'Lora:wght@400;500;600;700' },
  'playfair-display': { label: 'Playfair Display', family: 'Playfair Display, Georgia, serif', google: 'Playfair+Display:wght@400;500;600;700' },
  'cormorant-garamond': { label: 'Cormorant Garamond', family: 'Cormorant Garamond, Georgia, serif', google: 'Cormorant+Garamond:wght@400;500;600;700' },
  poppins: { label: 'Poppins', family: 'Poppins, Arial, sans-serif', google: 'Poppins:wght@400;500;600;700' },
  montserrat: { label: 'Montserrat', family: 'Montserrat, Arial, sans-serif', google: 'Montserrat:wght@400;500;600;700' },
  inter: { label: 'Inter', family: 'Inter, Arial, sans-serif', google: 'Inter:wght@400;500;600;700' },
  raleway: { label: 'Raleway', family: 'Raleway, Arial, sans-serif', google: 'Raleway:wght@400;500;600;700' },
  'dm-sans': { label: 'DM Sans', family: 'DM Sans, Arial, sans-serif', google: 'DM+Sans:wght@400;500;600;700' },
};

export const SHADOWS = {
  none: { label: 'Aucune', css: 'none' },
  soft: { label: 'Légère', css: '0 4px 14px rgba(0,0,0,.14)' },
  strong: { label: 'Marquée', css: '0 10px 28px rgba(0,0,0,.28)' },
};

export const BUTTON_STYLES = {
  round: { label: 'Arrondi (actuel)', css: '8px' },
  square: { label: 'Carré', css: '0px' },
  pill: { label: 'Capsule', css: '999px' },
};

/** Largeur du contenu : site = pages, shop = catalogue (un peu plus large) */
export const WIDTHS = {
  narrow: { label: 'Étroite', site: '1080px', shop: '1216px' },
  normal: { label: 'Normale (actuelle)', site: '1240px', shop: '1376px' },
  wide: { label: 'Large', site: '1440px', shop: '1576px' },
};

/** Hauteur du bandeau d'accueil : css = ordinateur (suit la largeur de l'écran), mobile = téléphone */
export const BANNER_HEIGHTS = {
  compact: { label: 'Compact', css: 'clamp(160px,20vw,380px)', mobile: '220px' },
  normal: { label: 'Normal (actuel)', css: 'clamp(224px,28vw,544px)', mobile: '300px' },
  tall: { label: 'Haut', css: 'clamp(280px,36vw,700px)', mobile: '400px' },
};

const HEX = /^#[0-9a-fA-F]{6}$/;
const COLORS = {
  nav_bg: '--nav-bg', nav_text: '--nav-text', footer_bg: '--footer-bg', footer_text: '--footer-text', page_bg: '--page-bg', accent: '--accent', card_bg: '--card-bg',
  price_color: '--price-color', badge_promo: '--badge-promo', badge_out: '--badge-out',   // price_color null = couleur d'origine : rien à écrire
};

/**
 * Variables CSS d'un thème. Chaque valeur est revérifiée ici (hex, police de la liste, nombre) : une valeur
 * inattendue est simplement ignorée, donc rien d'autre qu'une valeur sûre ne peut entrer dans le CSS.
 */
export function themeVars(t = {}) {
  const v = {};
  for (const [key, name] of Object.entries(COLORS)) if (HEX.test(t[key])) v[name] = t[key];
  if (Object.hasOwn(FONTS, t.font_heading)) v['--serif'] = FONTS[t.font_heading].family;
  if (Object.hasOwn(FONTS, t.font_body)) v['--sans'] = FONTS[t.font_body].family;
  if (Number.isInteger(t.card_radius) && t.card_radius >= 0 && t.card_radius <= 24) v['--card-radius'] = `${t.card_radius}px`;
  if (Object.hasOwn(SHADOWS, t.card_shadow)) v['--card-shadow'] = SHADOWS[t.card_shadow].css;
  if (typeof t.card_border === 'boolean') v['--card-border'] = t.card_border ? 'var(--line)' : 'transparent';
  if (Object.hasOwn(BUTTON_STYLES, t.button_style)) v['--btn-radius'] = BUTTON_STYLES[t.button_style].css;
  if (Object.hasOwn(WIDTHS, t.site_width)) {
    v['--site-width'] = WIDTHS[t.site_width].site;
    v['--shop-max'] = WIDTHS[t.site_width].shop;
  }
  if (Object.hasOwn(BANNER_HEIGHTS, t.banner_height)) {
    v['--ads-h'] = BANNER_HEIGHTS[t.banner_height].css;
    v['--ads-h-m'] = BANNER_HEIGHTS[t.banner_height].mobile;
  }
  return v;
}

export const themeCss = (t) => `:root{${Object.entries(themeVars(t)).map(([k, val]) => `${k}:${val}`).join(';')}}`;

/** Lien Google Fonts des polices choisies ; Lora est déjà chargée par le layout */
export function googleFontsHref(t = {}) {
  const wanted = [...new Set([t.font_heading, t.font_body])].filter((k) => Object.hasOwn(FONTS, k) && k !== 'lora');
  return wanted.length ? `https://fonts.googleapis.com/css2?${wanted.map((k) => `family=${FONTS[k].google}`).join('&')}&display=swap` : null;
}

const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** Rapport de contraste WCAG entre deux couleurs #RRGGBB : 1 (identiques) à 21 (noir sur blanc) ; 4,5 minimum pour un texte lisible */
export function contrastRatio(a, b) {
  if (!HEX.test(a) || !HEX.test(b)) return null;
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
