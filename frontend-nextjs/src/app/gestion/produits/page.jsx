'use client';
import Image from 'next/image';
import { useState } from 'react';
import ImageInput from '@/components/layout/ImageInput';
import PageHead from '@/components/layout/PageHead';
import ProductsTable from '@/components/layout/ProductsTable';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import Modal from '@/components/ui/Modal';
import { api, errorMessage, fieldErrors } from '@/lib/api';
import { toast } from '@/store/toastStore';

const EMPTY = { nom: '', marque: '', categorie: '', sous_categorie: '', tranche_age: '', details: '', prix: '', stock: '', promotion: '' };
const EMPTY_VARIANT = { id: null, hasColor: false, couleur: '#b5736a', taille: '', volume_ml: '', poids_g: '', quantite_pieces: '', stock: '' };
const num = (v) => (v === '' || v === null ? null : Number(v));

export default function GestionProduitsPage() {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [variants, setVariants] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [removed, setRemoved] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [categories, setCategories] = useState([]);

  function open(p = {}) {
    setEditing(p);
    setFile(null);
    setErrors({});
    setRemoved([]);
    setNewImages([]);
    setGallery(p.gallery || []);
    setVariants((p.variants || []).map((v) => ({
      id: v.id,
      hasColor: !!v.color,
      couleur: v.color || EMPTY_VARIANT.couleur,
      taille: v.taille || '',
      volume_ml: v.volume_ml ?? '',
      poids_g: v.poids_g ?? '',
      quantite_pieces: v.quantite_pieces ?? '',
      stock: String(v.stock),
    })));
    setForm(p.id
      ? { nom: p.name, marque: p.brand || '', categorie: p.category || '', sous_categorie: p.sub_category || '', tranche_age: p.age_range || '', details: p.details || '', prix: String(p.original_price), stock: String(p.stock), promotion: String(p.own_promotion || '') }
      : EMPTY);
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setVariant = (i, k, value) => setVariants((list) => list.map((v, j) => (j === i ? { ...v, [k]: value } : v)));

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, k === 'stock' && variants.length ? '0' : v));   // avec variantes, Laravel calcule le total
    if (file) fd.append('image', file);
    fd.append('variants', JSON.stringify(variants.map((v) => ({
      id: v.id,
      couleur: v.hasColor ? v.couleur : null,
      taille: v.taille.trim() || null,
      volume_ml: num(v.volume_ml),
      poids_g: num(v.poids_g),
      quantite_pieces: num(v.quantite_pieces),
      stock: num(v.stock),   // vide = erreur de Laravel, jamais un 0 silencieux
    }))));
    newImages.forEach((f) => fd.append('gallery[]', f));
    removed.forEach((id) => fd.append('remove_images[]', id));
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

  const variantError = Object.entries(errors).find(([k]) => k.startsWith('variants'))?.[1];
  const galleryError = Object.entries(errors).find(([k]) => k.startsWith('gallery'))?.[1];
  const visibleGallery = gallery.filter((g) => !removed.includes(g.id));

  return (
    <>
      <PageHead title="Produits">
        <Button onClick={() => open()}>+ Ajouter un produit</Button>
      </PageHead>

      <ProductsTable onEdit={open} reloadKey={reloadKey} onLoaded={(d) => setCategories(d.categories)} />

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing?.id ? `Modifier « ${editing.name} »` : 'Nouveau produit'}>
        <form onSubmit={save} noValidate>
          <Field id="nom" label="Nom" type="text" value={form.nom} onChange={set('nom')} error={errors.nom} required />
          <Field id="marque" label="Marque" hint="(optionnel)" type="text" value={form.marque} onChange={set('marque')} error={errors.marque} />
          <div className="row2">
            <Field id="categorie" label="Catégorie" hint="(Parfums, Soins…)" type="text" list="cats" value={form.categorie} onChange={set('categorie')} error={errors.categorie} />
            <Field id="sous_categorie" label="Sous-catégorie" hint="(optionnel)" type="text" value={form.sous_categorie} onChange={set('sous_categorie')} error={errors.sous_categorie} />
          </div>
          <datalist id="cats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
          <Field id="tranche_age" label="Tranche d'âge" hint="(optionnel : 18-35 ans…)" type="text" value={form.tranche_age} onChange={set('tranche_age')} error={errors.tranche_age} />
          <Field id="details" label="Description" hint="(optionnel)" as="textarea" value={form.details} onChange={set('details')} error={errors.details} />
          <div className="row2">
            <Field id="prix" label="Prix (DH)" type="text" inputMode="decimal" value={form.prix} onChange={set('prix')} error={errors.prix} required />
            {variants.length === 0
              ? <Field id="stock" label="Quantité" type="number" min="0" value={form.stock} onChange={set('stock')} error={errors.stock} required />
              : <Field id="stock" label="Quantité" hint="(total des variantes, à modifier plus bas)" type="number" value={variants.reduce((s, v) => s + (Number(v.stock) || 0), 0)} readOnly />}
          </div>
          <Field id="promotion" label="Promotion %" hint="(0 à 90, vide = aucune)" type="number" min="0" max="90" value={form.promotion} onChange={set('promotion')} error={errors.promotion} />

          <fieldset className="form-group">
            <legend>Variantes <small>(le stock du produit devient leur total)</small></legend>
            {variants.length > 0 && (
              <div className="variant-row variant-head" aria-hidden="true">
                <span>Couleur</span><span>Taille</span><span>ml</span><span>g</span><span>pcs</span><strong>Stock *</strong><span />
              </div>
            )}
            {variants.map((v, i) => (
              <div className="variant-row" key={v.id ?? `new-${i}`}>
                <label className="variant-color">
                  <input type="checkbox" checked={v.hasColor} onChange={(e) => setVariant(i, 'hasColor', e.target.checked)} aria-label="Avec couleur" />
                  <input type="color" value={v.couleur} disabled={!v.hasColor} onChange={(e) => setVariant(i, 'couleur', e.target.value)} aria-label="Couleur" />
                </label>
                <input type="text" maxLength={20} placeholder="Taille" aria-label="Taille (texte)" value={v.taille} onChange={(e) => setVariant(i, 'taille', e.target.value)} />
                <input type="number" min="1" placeholder="ml" aria-label="Volume en ml" value={v.volume_ml} onChange={(e) => setVariant(i, 'volume_ml', e.target.value)} />
                <input type="number" min="1" placeholder="g" aria-label="Poids en grammes" value={v.poids_g} onChange={(e) => setVariant(i, 'poids_g', e.target.value)} />
                <input type="number" min="1" placeholder="pcs" aria-label="Nombre de pièces" value={v.quantite_pieces} onChange={(e) => setVariant(i, 'quantite_pieces', e.target.value)} />
                <input type="number" min="0" required className={errors[`variants.${i}.stock`] ? 'invalid' : ''} placeholder="Stock" aria-label="Stock (obligatoire)" value={v.stock} onChange={(e) => setVariant(i, 'stock', e.target.value)} />
                <button type="button" className="btn-danger" onClick={() => setVariants((l) => l.filter((_, j) => j !== i))} aria-label="Retirer la variante">×</button>
              </div>
            ))}
            {variantError && <span className="error-text">{variantError}</span>}
            {/* La première variante reprend le stock déjà saisi : le champ Stock disparaît, la quantité ne doit pas se perdre */}
            <button type="button" className="btn-ghost" onClick={() => setVariants((l) => [...l, { ...EMPTY_VARIANT, stock: l.length === 0 ? form.stock : '' }])}>+ Ajouter une variante</button>
          </fieldset>

          <ImageInput file={file} onChange={setFile} current={editing?.image_url} />
          {errors.image && <span className="error-text">{errors.image}</span>}

          <fieldset className="form-group">
            <legend>Galerie <small>(10 images maximum)</small></legend>
            {visibleGallery.length > 0 && (
              <div className="gallery-edit">
                {visibleGallery.map((g) => (
                  <div key={g.id}>
                    <Image src={g.url} alt="" fill sizes="80px" />
                    <button type="button" onClick={() => setRemoved((r) => [...r, g.id])} aria-label="Retirer cette image">×</button>
                  </div>
                ))}
              </div>
            )}
            <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => setNewImages([...e.target.files])} aria-label="Ajouter des images à la galerie" />
            {newImages.length > 0 && <small>{newImages.length} image(s) à ajouter</small>}
            {galleryError && <span className="error-text">{galleryError}</span>}
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
