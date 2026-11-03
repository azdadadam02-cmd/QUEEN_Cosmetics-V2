'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ImageInput from '@/components/layout/ImageInput';
import PageHead from '@/components/layout/PageHead';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import Modal from '@/components/ui/Modal';
import { api, errorMessage, fieldErrors } from '@/lib/api';
import { toast } from '@/store/toastStore';

const EMPTY = { titre: '', reduction: '', produit_id: '' };

/** Publicités du carrousel de l'accueil (+ promo sur un produit lié) */
export default function PublicitesPage() {
  const [ads, setAds] = useState(null);
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [reloadKey, setReloadKey] = useState(0);
  const load = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    Promise.all([api.get('/advertisements'), api.get('/manage/products')])
      .then(([a, p]) => {
        setAds(a.data);
        setProducts(p.data.products);
      })
      .catch((e) => toast.error(errorMessage(e)));
  }, [reloadKey]);

  function open(ad = {}) {
    setEditing(ad);
    setFile(null);
    setErrors({});
    setForm(ad.id ? { titre: ad.title, reduction: String(ad.reduction || ''), produit_id: ad.product_id ? String(ad.product_id) : '' } : EMPTY);
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
      const { data } = await api.post(editing.id ? `/admin/advertisements/${editing.id}` : '/admin/advertisements', fd);
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

  async function destroy(ad) {
    if (!window.confirm(`Supprimer la publicité « ${ad.title} » ?`)) return;
    try {
      const { data } = await api.delete(`/admin/advertisements/${ad.id}`);
      toast.success(data.message);
      load();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }

  return (
    <>
      <PageHead eyebrow="Administration" title="Publicités">
        <Button onClick={() => open()}>+ Nouvelle publicité</Button>
      </PageHead>

      {!ads && <p className="loading-line">Chargement…</p>}
      {ads?.length === 0 && <p className="empty">Aucune publicité : l&apos;accueil affiche un bandeau par défaut.</p>}
      <div className="pub-grid">
        {ads?.map((ad) => (
          <article key={ad.id} className="pub-card">
            <div className="pub-visual">
              {ad.image_url && <Image src={ad.image_url} alt="" fill sizes="400px" style={{ zIndex: -2, objectFit: 'cover' }} />}
              <div className="pub-shade" />
              <h3>{ad.title}</h3>
              {ad.reduction > 0 && <span className="pub-badge">-{ad.reduction}%</span>}
            </div>
            <div className="pub-actions">
              <span className="muted">{ad.product_name ? <>Promo sur <strong>{ad.product_name}</strong></> : 'Bandeau seul'}</span>
              <span className="act">
                <button type="button" className="btn-ghost" onClick={() => open(ad)}>Modifier</button>
                <button type="button" className="btn-danger" onClick={() => destroy(ad)}>Supprimer</button>
              </span>
            </div>
          </article>
        ))}
      </div>

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing?.id ? 'Modifier la publicité' : 'Nouvelle publicité'}>
        <form onSubmit={save} noValidate>
          <Field id="titre" label="Titre" type="text" value={form.titre} onChange={set('titre')} error={errors.titre} required />
          <Field id="reduction" label="Réduction %" hint="(0 = pas de badge)" type="number" min="0" max="90" value={form.reduction} onChange={set('reduction')} error={errors.reduction} />
          <Field id="produit_id" label="Produit en promotion" hint="(optionnel)" error={errors.produit_id}>
            <select id="produit_id" value={form.produit_id} onChange={set('produit_id')}>
              <option value="">— Aucun —</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Field>
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
