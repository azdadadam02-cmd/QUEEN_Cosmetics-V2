'use client';
import { useEffect, useState } from 'react';
import PageHead from '@/components/layout/PageHead';
import Button from '@/components/ui/Button';
import ImageInput from '@/components/layout/ImageInput';
import Field from '@/components/ui/Field';
import FormError from '@/components/ui/FormError';
import { api, errorMessage } from '@/lib/api';
import { BANNER_HEIGHTS, BUTTON_STYLES, contrastRatio, FONTS, SHADOWS, WIDTHS } from '@/lib/theme';
import { useSubmit } from '@/lib/useSubmit';
import { refreshTheme } from './actions';
import ThemePreview from './ThemePreview';

function ColorField({ id, label, value, onChange, error }) {
  return (
    <Field id={id} label={label} error={error}>
      <span className="theme-color">
        <input id={id} type="color" value={value} onChange={onChange} />
        <code>{value}</code>
      </span>
    </Field>
  );
}

/** Couleur facultative : vide = couleur d'origine du site (qui n'est pas la même partout) */
function OptionalColorField({ id, label, value, onChange, onClear, error }) {
  return (
    <Field id={id} label={label} error={error}>
      <span className="theme-color">
        <input id={id} type="color" value={value || '#111111'} onChange={onChange} />
        <code>{value || "couleur d'origine"}</code>
        {value && <button type="button" className="btn-ghost" onClick={onClear}>Rétablir</button>}
      </span>
    </Field>
  );
}

const logoData = (file) => {
  const fd = new FormData();
  fd.append('logo', file);
  return fd;
};

const choices = (list) => Object.entries(list).map(([key, o]) => <option key={key} value={key}>{o.label}</option>);

function Readability({ fg, bg }) {
  const ratio = contrastRatio(fg, bg);
  if (ratio === null || ratio >= 4.5) return null;
  return <p className="error-text">{ratio < 3 ? 'Texte presque illisible' : 'Texte peu lisible'} sur ce fond (contraste {ratio.toFixed(1)} : 4,5 recommandé).</p>;
}

export default function ApparencePage() {
  const [form, setForm] = useState(null);
  const save = useSubmit();
  const reset = useSubmit();
  const logo = useSubmit();
  const [logoFile, setLogoFile] = useState(null);
  const { errors } = save;
  const { setError: setLoadError } = reset;

  useEffect(() => {
    api.get('/theme').then(({ data }) => setForm(data)).catch((e) => setLoadError(errorMessage(e)));
  }, [setLoadError]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : ['range', 'number'].includes(e.target.type) ? Number(e.target.value) : e.target.value }));
  // Le cache du site est vidé après chaque enregistrement : les visiteurs voient le changement tout de suite
  const applied = (data, logoOnly = false) => {
    setForm((f) => (logoOnly ? { ...f, logo_url: data.theme.logo_url } : data.theme));
    refreshTheme();
  };

  if (!form) return reset.error ? <FormError message={reset.error} /> : <p className="loading-line">Chargement…</p>;

  const fontOptions = Object.entries(FONTS).map(([key, f]) => <option key={key} value={key}>{f.label}</option>);

  return (
    <>
      <PageHead title="Apparence" note="Couleurs, polices et cartes produit du site client. Le personnel garde son interface." />
      <FormError message={reset.error} success={reset.success} />
      <div className="theme-admin">
        <form className="panel theme-form" noValidate onSubmit={(e) => { e.preventDefault(); save.run(() => api.put('/admin/theme', form), applied); }}>
          <fieldset className="form-group">
            <legend>Logo</legend>
            <ImageInput file={logoFile} onChange={setLogoFile} current={form.logo_url || '/images/logo.webp'} label="Logo du site" />
            <div className="theme-actions">
              <Button type="button" loading={logo.busy} disabled={!logoFile} onClick={() => logo.run(() => api.post('/admin/theme/logo', logoData(logoFile)), (d) => { setLogoFile(null); applied(d, true); })}>Envoyer le logo</Button>
              {form.logo_url && <button type="button" className="btn-ghost" disabled={logo.busy} onClick={() => logo.run(() => api.delete('/admin/theme/logo'), (d) => applied(d, true))}>Rétablir le logo d&apos;origine</button>}
            </div>
            <FormError message={logo.error} success={logo.success} />
            <small className="muted">Le logo remplace aussi l&apos;icône de l&apos;onglet. Image à fond transparent recommandée (PNG ou WEBP).</small>
          </fieldset>

          <fieldset className="form-group">
            <legend>Barre de navigation</legend>
            <div className="row2">
              <ColorField id="nav_bg" label="Fond" value={form.nav_bg} onChange={set('nav_bg')} error={errors.nav_bg} />
              <ColorField id="nav_text" label="Texte et icônes" value={form.nav_text} onChange={set('nav_text')} error={errors.nav_text} />
            </div>
            <Readability fg={form.nav_text} bg={form.nav_bg} />
          </fieldset>

          <fieldset className="form-group">
            <legend>Pied de page</legend>
            <div className="row2">
              <ColorField id="footer_bg" label="Fond" value={form.footer_bg} onChange={set('footer_bg')} error={errors.footer_bg} />
              <ColorField id="footer_text" label="Texte" value={form.footer_text} onChange={set('footer_text')} error={errors.footer_text} />
            </div>
            <Readability fg={form.footer_text} bg={form.footer_bg} />
          </fieldset>

          <fieldset className="form-group">
            <legend>Couleurs du site</legend>
            <div className="row2">
              <ColorField id="page_bg" label="Fond des pages" value={form.page_bg} onChange={set('page_bg')} error={errors.page_bg} />
              <ColorField id="accent" label="Couleur principale" value={form.accent} onChange={set('accent')} error={errors.accent} />
            </div>
            <small className="muted">La couleur principale colore les boutons « Ajouter », les sélections et les accents.</small>
          </fieldset>

          <fieldset className="form-group">
            <legend>Polices</legend>
            <div className="row2">
              <Field id="font_heading" label="Titres" error={errors.font_heading}><select id="font_heading" value={form.font_heading} onChange={set('font_heading')}>{fontOptions}</select></Field>
              <Field id="font_body" label="Texte" error={errors.font_body}><select id="font_body" value={form.font_body} onChange={set('font_body')}>{fontOptions}</select></Field>
            </div>
          </fieldset>

          <fieldset className="form-group">
            <legend>Cartes produit</legend>
            <div className="row2">
              <ColorField id="card_bg" label="Fond de la carte" value={form.card_bg} onChange={set('card_bg')} error={errors.card_bg} />
              <Field id="card_radius" label="Coins arrondis" hint={`(${form.card_radius} px)`} error={errors.card_radius}>
                <input id="card_radius" type="range" min="0" max="24" step="1" value={form.card_radius} onChange={set('card_radius')} />
              </Field>
            </div>
            <div className="row2">
              <Field id="card_shadow" label="Ombre" error={errors.card_shadow}>
                <select id="card_shadow" value={form.card_shadow} onChange={set('card_shadow')}>{Object.entries(SHADOWS).map(([key, s]) => <option key={key} value={key}>{s.label}</option>)}</select>
              </Field>
              <Field id="card_border" error={errors.card_border}>
                <label className="theme-check"><input id="card_border" type="checkbox" checked={form.card_border} onChange={set('card_border')} /> Afficher le cadre</label>
              </Field>
            </div>
          </fieldset>

          <fieldset className="form-group">
            <legend>Boutons, prix et badges</legend>
            <div className="row2">
              <Field id="button_style" label="Forme des boutons" error={errors.button_style}><select id="button_style" value={form.button_style} onChange={set('button_style')}>{choices(BUTTON_STYLES)}</select></Field>
              <OptionalColorField id="price_color" label="Couleur des prix" value={form.price_color} onChange={set('price_color')} onClear={() => setForm((f) => ({ ...f, price_color: null }))} error={errors.price_color} />
            </div>
            <div className="row2">
              <ColorField id="badge_promo" label="Badge promo" value={form.badge_promo} onChange={set('badge_promo')} error={errors.badge_promo} />
              <ColorField id="badge_out" label="Badge rupture de stock" value={form.badge_out} onChange={set('badge_out')} error={errors.badge_out} />
            </div>
          </fieldset>

          <fieldset className="form-group">
            <legend>Mise en page</legend>
            <div className="row2">
              <Field id="site_width" label="Largeur du contenu" error={errors.site_width}><select id="site_width" value={form.site_width} onChange={set('site_width')}>{choices(WIDTHS)}</select></Field>
              <Field id="banner_height" label="Hauteur du bandeau d'accueil" error={errors.banner_height}><select id="banner_height" value={form.banner_height} onChange={set('banner_height')}>{choices(BANNER_HEIGHTS)}</select></Field>
            </div>
            <small className="muted">Ces deux réglages ne sont pas dans l&apos;aperçu : ils se voient sur le site après l&apos;enregistrement.</small>
          </fieldset>

          <FormError message={save.error} success={save.success} />
          <div className="theme-actions">
            <Button type="submit" loading={save.busy}>Enregistrer l&apos;apparence</Button>
            <button type="button" className="btn-ghost" disabled={reset.busy} onClick={() => window.confirm("Rétablir l'apparence d'origine du site ?") && reset.run(() => api.delete('/admin/theme'), applied)}>Rétablir l&apos;apparence d&apos;origine</button>
          </div>
        </form>

        <aside className="theme-side">
          <h3 className="h-serif">Aperçu</h3>
          <ThemePreview theme={form} />
        </aside>
      </div>
    </>
  );
}
