'use client';
import { useCallback, useEffect, useState } from 'react';
import ImageInput from '@/components/layout/ImageInput';
import PackCard from '@/components/layout/PackCard';
import PacksTable from '@/components/layout/PacksTable';
import PageHead from '@/components/layout/PageHead';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import Modal from '@/components/ui/Modal';
import { api, errorMessage, fieldErrors } from '@/lib/api';
import { money } from '@/lib/format';
import { toast } from '@/store/toastStore';

const EMPTY = { nom: '', description: '', prix_promo: '', couleur_fond: '#735A65', couleur_texte: '#FFFFFF', texte_bouton: 'Voir le pack', est_actif: true };

/** Créer et personnaliser les packs (contenu, prix, image, couleurs, bouton) : responsable produits et admin */
export default function PacksManager() {
  const [packs, setPacks] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [lines, setLines] = useState([]);   // [{ id, quantite }]
  const [picked, setPicked] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    api.get('/manage/packs').then(({ data }) => setPacks(data.data ?? data)).catch((e) => toast.error(errorMessage(e)));
  }, []);
  useEffect(() => {
    load();
    // Un pack ne peut pas contenir de produit à variantes : il ne saurait pas quelle couleur retirer du stock
    api.get('/manage/products').then(({ data }) => setCatalog(data.products.filter((p) => !p.variants?.length))).catch((e) => toast.error(errorMessage(e)));
  }, [load]);

  function open(p = {}) {
    setEditing(p);
    setFile(null);
    setErrors({});
    setPicked('');
    setLines((p.products || []).map((it) => ({ id: it.id, quantite: it.quantity })));
    setForm(p.id
      ? { nom: p.name, description: p.description || '', prix_promo: String(p.price), couleur_fond: p.background, couleur_texte: p.color, texte_bouton: p.button, est_actif: p.active }
      : EMPTY);
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const productOf = (id) => catalog.find((p) => p.id === id) || editing?.products?.find((p) => p.id === id);

  function addLine() {
    const id = Number(picked);
    if (!id || lines.some((l) => l.id === id)) return;
    setLines((l) => [...l, { id, quantite: 1 }]);
    setPicked('');
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, k === 'est_actif' ? (v ? '1' : '0') : v));
    fd.append('products', JSON.stringify(lines));
    if (file) fd.append('image', file);
    try {
      const { data } = await api.post(editing.id ? `/manage/packs/${editing.id}` : '/manage/packs', fd);
      toast.success(data.message);
      setEditing(null);
      load();
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function destroy(p) {
    if (!window.confirm(`Supprimer le pack « ${p.name} » ?`)) return;
    try {
      const { data } = await api.delete(`/manage/packs/${p.id}`);
      toast.success(data.message);
      load();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }

  const value = lines.reduce((s, l) => s + (productOf(l.id)?.price || 0) * l.quantite, 0);
  const lineError = Object.entries(errors).find(([k]) => k.startsWith('products'))?.[1];

  return (
    <>
      <PageHead title="Packs">
        <Button onClick={() => open()}>+ Ajouter un pack</Button>
      </PageHead>

      <PacksTable packs={packs} onEdit={open} onDelete={destroy} />

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing?.id ? `Modifier « ${editing.name} »` : 'Nouveau pack'}>
        <form onSubmit={save} noValidate>
          <Field id="nom" label="Nom" type="text" value={form.nom} onChange={set('nom')} error={errors.nom} required />
          <Field id="description" label="Description" hint="(optionnel)" as="textarea" value={form.description} onChange={set('description')} error={errors.description} />
          <ImageInput file={file} onChange={setFile} current={editing?.image_url} />
          {errors.image && <span className="error-text">{errors.image}</span>}

          <fieldset className="form-group">
            <legend>Produits du pack</legend>
            <div className="pack-pick">
              <select value={picked} onChange={(e) => setPicked(e.target.value)} aria-label="Choisir un produit">
                <option value="">Choisir un produit…</option>
                {catalog.filter((p) => !lines.some((l) => l.id === p.id)).map((p) => <option key={p.id} value={p.id}>{p.name} — {p.category || 'Sans catégorie'} — {money(p.price)}</option>)}
              </select>
              <button type="button" className="btn-ghost" onClick={addLine}>Ajouter</button>
            </div>
            {lines.map((l) => (
              <div className="pack-line" key={l.id}>
                <span>{productOf(l.id)?.name}</span>
                <input type="number" min="1" max="20" value={l.quantite} aria-label="Quantité" onChange={(e) => setLines((all) => all.map((x) => (x.id === l.id ? { ...x, quantite: Number(e.target.value) } : x)))} />
                <button type="button" className="btn-danger" onClick={() => setLines((all) => all.filter((x) => x.id !== l.id))} aria-label="Retirer ce produit">×</button>
              </div>
            ))}
            {lineError && <span className="error-text">{lineError}</span>}
            {lines.length > 0 && <small className="muted">Valeur séparée : {money(value)}</small>}
          </fieldset>

          <Field id="prix_promo" label="Prix du pack (DH)" type="text" inputMode="decimal" value={form.prix_promo} onChange={set('prix_promo')} error={errors.prix_promo} required />

          <fieldset className="form-group">
            <legend>Personnalisation de la carte</legend>
            <div className="row2">
              <Field id="couleur_fond" label="Couleur du bandeau" type="color" value={form.couleur_fond} onChange={set('couleur_fond')} error={errors.couleur_fond} />
              <Field id="couleur_texte" label="Couleur du texte" type="color" value={form.couleur_texte} onChange={set('couleur_texte')} error={errors.couleur_texte} />
            </div>
            <Field id="texte_bouton" label="Texte du bouton" hint="(ex : Voir le pack)" type="text" maxLength={40} value={form.texte_bouton} onChange={set('texte_bouton')} error={errors.texte_bouton} />
            <Field id="est_actif" error={errors.est_actif}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input id="est_actif" type="checkbox" checked={!!form.est_actif} onChange={set('est_actif')} /> Afficher sur le site
              </label>
            </Field>
            <div className="pack-preview" inert>
              <PackCard pack={{ id: 0, name: form.nom || 'Nom du pack', description: form.description, image_url: null, background: form.couleur_fond, color: form.couleur_texte, button: form.texte_bouton || 'Voir le pack' }} />
            </div>
          </fieldset>

          <div className="dialog-actions">
            <button type="button" className="btn-ghost" onClick={() => setEditing(null)}>Annuler</button>
            <Button type="submit" size="sm" loading={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
