'use client';
import { useState } from 'react';
import ImageInput from '@/components/layout/ImageInput';
import PageHead from '@/components/layout/PageHead';
import ProductsTable from '@/components/layout/ProductsTable';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import Modal from '@/components/ui/Modal';
import { api, errorMessage, fieldErrors } from '@/lib/api';
import { toast } from '@/store/toastStore';

const EMPTY = { nom: '', categorie: '', prix: '', stock: '', promotion: '' };

/** Responsable produits : ajouter et modifier les produits (nom, catégorie, prix, stock, promo, image) */
export default function GestionProduitsPage() {
  const [editing, setEditing] = useState(null); // null = fermé, {} = nouveau, produit = modification
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [categories, setCategories] = useState([]);

  function open(p = {}) {
    setEditing(p);
    setFile(null);
    setErrors({});
    setForm(p.id ? { nom: p.name, categorie: p.category || '', prix: String(p.original_price), stock: String(p.stock), promotion: String(p.own_promotion || '') } : EMPTY);
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('image', file);
    try {
      const url = editing.id ? `/manage/products/${editing.id}` : '/manage/products';
      const { data } = await api.post(url, fd);
      toast.success(data.message);
      setEditing(null);
      setReloadKey((k) => k + 1);
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHead eyebrow="Responsable produits" title="Produits">
        <Button onClick={() => open()}>+ Ajouter un produit</Button>
      </PageHead>

      <ProductsTable onEdit={open} reloadKey={reloadKey} onLoaded={(d) => setCategories(d.categories)} />

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing?.id ? `Modifier « ${editing.name} »` : 'Nouveau produit'}>
        <form onSubmit={save} noValidate>
          <Field id="nom" label="Nom" type="text" value={form.nom} onChange={set('nom')} error={errors.nom} required />
          <Field id="categorie" label="Catégorie" hint="(Parfums, Soins…)" type="text" list="cats" value={form.categorie} onChange={set('categorie')} error={errors.categorie} />
          <datalist id="cats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
          <div className="row2">
            <Field id="prix" label="Prix (DH)" type="text" inputMode="decimal" value={form.prix} onChange={set('prix')} error={errors.prix} required />
            <Field id="stock" label="Stock" type="number" min="0" value={form.stock} onChange={set('stock')} error={errors.stock} required />
          </div>
          <Field id="promotion" label="Promotion %" hint="(0 à 90, vide = aucune)" type="number" min="0" max="90" value={form.promotion} onChange={set('promotion')} error={errors.promotion} />
          <ImageInput file={file} onChange={setFile} current={editing?.image_url} />
          {errors.image && <span className="error-text">{errors.image}</span>}
          <div className="dialog-actions">
            <button type="button" className="btn-ghost" onClick={() => setEditing(null)}>Annuler</button>
            <Button type="submit" size="sm" loading={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
