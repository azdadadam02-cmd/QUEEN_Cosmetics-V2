'use client';
import { useCallback, useEffect, useState } from 'react';
import ImageInput from '@/components/layout/ImageInput';
import PacksTable from '@/components/layout/PacksTable';
import PageHead from '@/components/layout/PageHead';
import Button from '@/components/ui/Button';
import DialogActions from '@/components/ui/DialogActions';
import Field from '@/components/ui/Field';
import FormError from '@/components/ui/FormError';
import Modal from '@/components/ui/Modal';
import { api, errorMessage } from '@/lib/api';
import { useSubmit } from '@/lib/useSubmit';
import PackLookFields from './packs-manager/PackLookFields';
import PackProductsPicker from './packs-manager/PackProductsPicker';

const EMPTY = { nom: '', description: '', prix_promo: '', couleur_fond: '#735A65', couleur_texte: '#FFFFFF', texte_bouton: 'Voir le pack', est_actif: true };

export default function PacksManager() {
  const [packs, setPacks] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [lines, setLines] = useState([]);
  const submit = useSubmit();
  const action = useSubmit();
  const { errors } = submit;
  const { setError: setLoadError } = action;

  const load = useCallback(() => {
    api.get('/manage/packs').then(({ data }) => setPacks(data.data ?? data)).catch((e) => setLoadError(errorMessage(e)));
  }, [setLoadError]);
  useEffect(() => {
    load();
    // Un pack ne peut pas contenir de produit à variantes : il ne saurait pas quelle couleur retirer du stock
    api.get('/manage/products').then(({ data }) => setCatalog(data.products.filter((p) => !p.deleted && !p.variants?.length))).catch((e) => setLoadError(errorMessage(e)));
  }, [load, setLoadError]);

  function open(p = {}) {
    setEditing(p);
    setFile(null);
    submit.reset();
    setLines((p.products || []).map((it) => ({ id: it.id, quantite: it.quantity })));
    setForm(p.id
      ? { nom: p.name, description: p.description || '', prix_promo: String(p.price), couleur_fond: p.background, couleur_texte: p.color, texte_bouton: p.button, est_actif: p.active }
      : EMPTY);
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const productOf = (id) => catalog.find((p) => p.id === id) || editing?.products?.find((p) => p.id === id);

  function save(e) {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, k === 'est_actif' ? (v ? '1' : '0') : v));
    fd.append('products', JSON.stringify(lines));
    if (file) fd.append('image', file);
    submit.run(() => api.post(editing.id ? `/manage/packs/${editing.id}` : '/manage/packs', fd), () => {
      setEditing(null);
      load();
    });
  }

  function destroy(p) {
    if (!window.confirm(`Supprimer le pack « ${p.name} » ?`)) return;
    action.run(() => api.delete(`/manage/packs/${p.id}`), load);
  }

  const lineError = Object.entries(errors).find(([k]) => k.startsWith('products'))?.[1];

  return (
    <>
      <PageHead title="Packs">
        <Button onClick={() => open()}>+ Ajouter un pack</Button>
      </PageHead>
      <FormError message={action.error} />

      <PacksTable packs={packs} onEdit={open} onDelete={destroy} />

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing?.id ? `Modifier « ${editing.name} »` : 'Nouveau pack'}>
        <form onSubmit={save} noValidate>
          <Field id="nom" label="Nom" type="text" value={form.nom} onChange={set('nom')} error={errors.nom} required />
          <Field id="description" label="Description" hint="(optionnel)" as="textarea" value={form.description} onChange={set('description')} error={errors.description} />
          <ImageInput file={file} onChange={setFile} current={editing?.image_url} />
          {errors.image && <span className="error-text">{errors.image}</span>}

          <PackProductsPicker catalog={catalog} lines={lines} onChange={setLines} productOf={productOf} error={lineError} />

          <Field id="prix_promo" label="Prix du pack (DH)" type="text" inputMode="decimal" value={form.prix_promo} onChange={set('prix_promo')} error={errors.prix_promo} required />

          <PackLookFields form={form} set={set} errors={errors} />

          <FormError message={submit.error} />
          <DialogActions onCancel={() => setEditing(null)} busy={submit.busy} />
        </form>
      </Modal>
    </>
  );
}
