'use client';
import { useCallback, useEffect, useState } from 'react';
import PageHead from '@/components/layout/PageHead';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import Modal from '@/components/ui/Modal';
import { api, errorMessage, fieldErrors } from '@/lib/api';
import { BAR_ICONS, BarIcon } from '@/lib/barIcons';
import { toast } from '@/store/toastStore';

const EMPTY_USP = { icone: '', texte: '', lien: '', ordre_affichage: '', est_actif: true };
const EMPTY_PROMO = { texte: '', lien: '', couleur_fond: '#725A65', couleur_texte: '#FFFFFF', date_debut: '', date_fin: '', est_actif: true };

// <input type="datetime-local"> ↔ ISO (le navigateur gère le fuseau, Laravel le convertit)
const pad = (n) => String(n).padStart(2, '0');
const toInput = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const toIso = (v) => (v ? new Date(v).toISOString() : null);
const fmt = (iso) => (iso ? new Date(iso).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }) : '—');

const StatePill = ({ on }) => <span className={`pill ${on ? 'pill-livree' : 'pill-role'}`}>{on ? 'Actif' : 'Inactif'}</span>;

export default function BarresPage() {
  const [data, setData] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [brand, setBrand] = useState(null);
  const [brandErrors, setBrandErrors] = useState({});

  const load = useCallback(() => {
    api.get('/admin/top-bars').then(({ data: d }) => {
      setData(d);
      setBrand((b) => b || { nom_marque: d.header.name, couleur_fond: d.header.background, couleur_texte: d.header.color, est_actif: d.header.active });
    }).catch((e) => toast.error(errorMessage(e)));
  }, []);

  async function saveBrand(e) {
    e.preventDefault();
    setBrandErrors({});
    try {
      const { data: res } = await api.put('/admin/header', brand);
      toast.success(res.message);
    } catch (err) {
      setBrandErrors(fieldErrors(err));
      toast.error(errorMessage(err));
    }
  }
  const [links, setLinks] = useState(null);
  const [linkErrors, setLinkErrors] = useState({});
  useEffect(() => {
    api.get('/service-links').then(({ data: d }) => setLinks({ whatsapp: d.whatsapp || '', facebook: d.facebook || '', instagram: d.instagram || '', twitter: d.twitter || '', gmail: d.gmail || '' })).catch((e) => toast.error(errorMessage(e)));
  }, []);
  const setL = (k) => (e) => setLinks((l) => ({ ...l, [k]: e.target.value }));
  async function saveLinks(e) {
    e.preventDefault();
    setLinkErrors({});
    try {
      const { data: res } = await api.put('/admin/service-links', Object.fromEntries(Object.entries(links).map(([k, v]) => [k, v.trim() || null])));
      toast.success(res.message);
    } catch (err) {
      setLinkErrors(fieldErrors(err));
      toast.error(errorMessage(err));
    }
  }

  const setB = (k) => (e) => setBrand((b) => ({ ...b, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  useEffect(() => {
    load();
  }, [load]);

  function open(kind, row = {}) {
    setEditing({ kind, row });
    setErrors({});
    if (kind === 'usp') {
      setForm(row.id ? { icone: row.icon || '', texte: row.text, lien: row.link || '', ordre_affichage: String(row.order), est_actif: row.active } : EMPTY_USP);
    } else {
      setForm(row.id
        ? { texte: row.text, lien: row.link || '', couleur_fond: row.background, couleur_texte: row.color, date_debut: toInput(row.starts_at), date_fin: toInput(row.ends_at), est_actif: row.active }
        : EMPTY_PROMO);
    }
  }
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    const { kind, row } = editing;
    const path = kind === 'usp' ? '/admin/usps' : '/admin/promos';
    const body = kind === 'promo' ? { ...form, date_debut: toIso(form.date_debut), date_fin: toIso(form.date_fin) } : form;
    try {
      const { data: res } = row.id ? await api.put(`${path}/${row.id}`, body) : await api.post(path, body);
      toast.success(res.message);
      setEditing(null);
      load();
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function destroy(kind, row) {
    if (!window.confirm(`Supprimer « ${row.text} » ?`)) return;
    try {
      const { data: res } = await api.delete(`${kind === 'usp' ? '/admin/usps' : '/admin/promos'}/${row.id}`);
      toast.success(res.message);
      load();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }

  const kind = editing?.kind;
  const checkbox = (
    <Field id="est_actif" error={errors.est_actif}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <input id="est_actif" type="checkbox" checked={!!form.est_actif} onChange={set('est_actif')} /> Afficher sur le site
      </label>
    </Field>
  );

  return (
    <>
      <PageHead title="Barres du haut" note="Au-dessus de la navbar, côté client. Elles défilent avec la page." />

      <h2 className="h-serif" style={{ margin: '8px 0 14px' }}>Avantages (barre grise)</h2>
      <div style={{ marginBottom: 14 }}><Button onClick={() => open('usp')}>+ Nouvel avantage</Button></div>
      <div className="panel tablewrap">
        <table className="tbl">
          <thead><tr><th>Avantage</th><th className="num">Ordre</th><th>État</th><th className="right">Actions</th></tr></thead>
          <tbody>
            {!data && <tr><td colSpan={4} className="empty-row">Chargement…</td></tr>}
            {data?.usps.length === 0 && <tr><td colSpan={4} className="empty-row">Aucun avantage : la barre grise n&apos;est pas affichée.</td></tr>}
            {data?.usps.map((u) => (
              <tr key={u.id}>
                <td><span className="cell-prod"><span style={{ width: 22, height: 22, display: 'inline-grid', color: 'var(--plum-2)' }} className="usp-item"><BarIcon name={u.icon} /></span><span><strong>{u.text}</strong><small>{u.link || 'Sans lien'}</small></span></span></td>
                <td className="num">{u.order}</td>
                <td><StatePill on={u.active} /></td>
                <td className="act right">
                  <button type="button" className="btn-ghost" onClick={() => open('usp', u)}>Modifier</button>{' '}
                  <button type="button" className="btn-danger" onClick={() => destroy('usp', u)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="h-serif" style={{ margin: '36px 0 14px' }}>Annonce promo (barre colorée)</h2>
      <p className="muted" style={{ marginBottom: 14 }}>Une seule annonce s&apos;affiche : la plus récente qui est active et dans ses dates. Avec une date de fin, un compte à rebours apparaît à droite du texte.</p>
      <div style={{ marginBottom: 14 }}><Button onClick={() => open('promo')}>+ Nouvelle annonce</Button></div>
      <div className="panel tablewrap">
        <table className="tbl">
          <thead><tr><th>Annonce</th><th>Début</th><th>Fin</th><th>État</th><th className="right">Actions</th></tr></thead>
          <tbody>
            {!data && <tr><td colSpan={5} className="empty-row">Chargement…</td></tr>}
            {data?.promos.length === 0 && <tr><td colSpan={5} className="empty-row">Aucune annonce : la barre promo n&apos;est pas affichée.</td></tr>}
            {data?.promos.map((p) => (
              <tr key={p.id}>
                <td><span className="cell-prod"><span style={{ width: 22, height: 22, borderRadius: 6, background: p.background, border: '1px solid var(--line)' }} /><span><strong>{p.text}</strong><small>{p.link || 'Sans lien'}</small></span></span></td>
                <td>{fmt(p.starts_at)}</td>
                <td>{fmt(p.ends_at)}</td>
                <td><StatePill on={p.active} /></td>
                <td className="act right">
                  <button type="button" className="btn-ghost" onClick={() => open('promo', p)}>Modifier</button>{' '}
                  <button type="button" className="btn-danger" onClick={() => destroy('promo', p)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="h-serif" style={{ margin: '36px 0 14px' }}>Barre de marque (sous les deux barres)</h2>
      {brand && (
        <form className="panel" onSubmit={saveBrand} noValidate style={{ padding: 22, maxWidth: 520 }}>
          <Field id="nom_marque" label="Nom de la marque" type="text" value={brand.nom_marque} onChange={setB('nom_marque')} error={brandErrors.nom_marque} required />
          <Field id="brand_fond" label="Couleur du fond" type="color" value={brand.couleur_fond} onChange={setB('couleur_fond')} error={brandErrors.couleur_fond} />
          <Field id="brand_texte" label="Couleur du texte" type="color" value={brand.couleur_texte} onChange={setB('couleur_texte')} error={brandErrors.couleur_texte} />
          <Field id="brand_actif">
            <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input id="brand_actif" type="checkbox" checked={!!brand.est_actif} onChange={setB('est_actif')} /> Afficher sur le site
            </label>
          </Field>
          <div className="brand-bar" style={{ background: brand.couleur_fond, color: brand.couleur_texte, borderRadius: 12, margin: '6px 0 14px' }}>{brand.nom_marque || 'Aperçu'}</div>
          <Button type="submit" size="sm">Enregistrer</Button>
        </form>
      )}

      <h2 className="h-serif" style={{ margin: '36px 0 14px' }}>Liens Service (profil client)</h2>
      <p className="muted" style={{ marginBottom: 14 }}>Un lien vide n&apos;est pas affiché dans le profil.</p>
      {links && (
        <form className="panel" onSubmit={saveLinks} noValidate style={{ padding: 22, maxWidth: 520 }}>
          <Field id="l_whatsapp" label="WhatsApp" hint="(https://wa.me/212612345678)" type="url" value={links.whatsapp} onChange={setL('whatsapp')} error={linkErrors.whatsapp} />
          <Field id="l_facebook" label="Facebook" hint="(https://facebook.com/…)" type="url" value={links.facebook} onChange={setL('facebook')} error={linkErrors.facebook} />
          <Field id="l_instagram" label="Instagram" hint="(https://instagram.com/…)" type="url" value={links.instagram} onChange={setL('instagram')} error={linkErrors.instagram} />
          <Field id="l_twitter" label="Twitter / X" hint="(https://x.com/…)" type="url" value={links.twitter} onChange={setL('twitter')} error={linkErrors.twitter} />
          <Field id="l_gmail" label="Gmail" hint="(adresse e-mail)" type="email" value={links.gmail} onChange={setL('gmail')} error={linkErrors.gmail} />
          <Button type="submit" size="sm">Enregistrer</Button>
        </form>
      )}

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={kind === 'usp' ? (editing?.row.id ? "Modifier l'avantage" : 'Nouvel avantage') : (editing?.row.id ? "Modifier l'annonce" : 'Nouvelle annonce')}>
        <form onSubmit={save} noValidate>
          {kind === 'usp' && (
            <>
              <Field id="icone" label="Icône" error={errors.icone}>
                <select id="icone" value={form.icone} onChange={set('icone')}>
                  <option value="">— Aucune —</option>
                  {Object.entries(BAR_ICONS).map(([key, { label }]) => <option key={key} value={key}>{label}</option>)}
                </select>
              </Field>
              <Field id="texte" label="Texte" type="text" value={form.texte} onChange={set('texte')} error={errors.texte} required />
              <Field id="lien" label="Lien" hint="(optionnel : /products ou https://…)" type="text" value={form.lien} onChange={set('lien')} error={errors.lien} />
              <Field id="ordre_affichage" label="Ordre" hint="(petit = à gauche)" type="number" min="0" max="999" value={form.ordre_affichage} onChange={set('ordre_affichage')} error={errors.ordre_affichage} />
              {checkbox}
            </>
          )}
          {kind === 'promo' && (
            <>
              <Field id="texte" label="Texte" type="text" value={form.texte} onChange={set('texte')} error={errors.texte} required />
              <Field id="lien" label="Lien" hint="(optionnel : /products ou https://…)" type="text" value={form.lien} onChange={set('lien')} error={errors.lien} />
              <Field id="couleur_fond" label="Couleur du fond" type="color" value={form.couleur_fond} onChange={set('couleur_fond')} error={errors.couleur_fond} />
              <Field id="couleur_texte" label="Couleur du texte" type="color" value={form.couleur_texte} onChange={set('couleur_texte')} error={errors.couleur_texte} />
              <Field id="date_debut" label="Début" hint="(optionnel)" type="datetime-local" value={form.date_debut} onChange={set('date_debut')} error={errors.date_debut} />
              <Field id="date_fin" label="Fin" hint="(optionnel : active le compte à rebours)" type="datetime-local" value={form.date_fin} onChange={set('date_fin')} error={errors.date_fin} />
              {checkbox}
              <div className="promo-bar" style={{ background: form.couleur_fond, color: form.couleur_texte, borderRadius: 12, margin: '6px 0 14px' }}>
                <span className="promo-text">{form.texte || 'Aperçu'}</span>
              </div>
            </>
          )}
          <div className="dialog-actions">
            <button type="button" className="btn-ghost" onClick={() => setEditing(null)}>Annuler</button>
            <Button type="submit" size="sm" loading={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
