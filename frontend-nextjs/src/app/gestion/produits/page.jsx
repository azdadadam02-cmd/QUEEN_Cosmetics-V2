'use client';
import { useState } from 'react';
import ImageInput from '@/components/layout/ImageInput';
import PageHead from '@/components/layout/PageHead';
import ProductsTable from '@/components/layout/ProductsTable';
import Button from '@/components/ui/Button';
import DialogActions from '@/components/ui/DialogActions';
import Field from '@/components/ui/Field';
import FormError from '@/components/ui/FormError';
import Modal from '@/components/ui/Modal';
import { api } from '@/lib/api';
import { EMPTY_PRODUCT, productToForm, rowsToVariants, variantsToRows, variantsTotal } from '@/lib/productForm';
import { useSubmit } from '@/lib/useSubmit';
import GalleryEditor from './GalleryEditor';
import VariantsEditor from './VariantsEditor';

export default function GestionProduitsPage() {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [file, setFile] = useState(null);
  const [variants, setVariants] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [removed, setRemoved] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const submit = useSubmit();
  const { errors } = submit;
  const [reloadKey, setReloadKey] = useState(0);
  const [categories, setCategories] = useState([]);

  function open(p = {}) {
    setEditing(p);
    setFile(null);
    submit.reset();
    setRemoved([]);
    setNewImages([]);
    setGallery(p.gallery || []);
    setVariants(variantsToRows(p));
    setForm(productToForm(p));
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function save(e) {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, k === 'stock' && variants.length ? '0' : v));   // avec variantes, Laravel calcule le total
    if (file) fd.append('image', file);
    fd.append('variants', JSON.stringify(rowsToVariants(variants)));
    newImages.forEach((f) => fd.append('gallery[]', f));
    removed.forEach((id) => fd.append('remove_images[]', id));
    submit.run(() => api.post(editing.id ? `/manage/products/${editing.id}` : '/manage/products', fd), () => {
      setEditing(null);
      setReloadKey((k) => k + 1);
    });
  }

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
              : <Field id="stock" label="Quantité" hint="(total des variantes, à modifier plus bas)" type="number" value={variantsTotal(variants)} readOnly />}
          </div>
          <Field id="promotion" label="Promotion %" hint="(0 à 90, vide = aucune)" type="number" min="0" max="90" value={form.promotion} onChange={set('promotion')} error={errors.promotion} />

          <VariantsEditor variants={variants} onChange={setVariants} errors={errors} currentStock={form.stock} />

          <ImageInput file={file} onChange={setFile} current={editing?.image_url} />
          {errors.image && <span className="error-text">{errors.image}</span>}

          <GalleryEditor gallery={gallery} removed={removed} onRemove={(id) => setRemoved((r) => [...r, id])} newImages={newImages} onAdd={setNewImages} errors={errors} />

          <FormError message={submit.error} />
          <DialogActions onCancel={() => setEditing(null)} busy={submit.busy} />
        </form>
      </Modal>
    </>
  );
}
