'use client';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import FormError from '@/components/ui/FormError';
import { api } from '@/lib/api';
import { useSubmit } from '@/lib/useSubmit';
import { ActiveField } from './parts';

/** Barre de marque : initialisée une fois, un rechargement de la page ne doit pas écraser la saisie en cours */
export default function BrandForm({ header }) {
  const submit = useSubmit();
  const { errors } = submit;
  const [brand, setBrand] = useState(() => ({ nom_marque: header.name, couleur_fond: header.background, couleur_texte: header.color, est_actif: header.active }));
  const set = (k) => (e) => setBrand((b) => ({ ...b, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  function onSubmit(e) {
    e.preventDefault();
    submit.run(() => api.put('/admin/header', brand));
  }

  return (
    <>
      <h2 className="h-serif" style={{ margin: '36px 0 14px' }}>Barre de marque (sous les deux barres)</h2>
      <form className="panel" onSubmit={onSubmit} noValidate style={{ padding: 22, maxWidth: 520 }}>
        <Field id="nom_marque" label="Nom de la marque" type="text" value={brand.nom_marque} onChange={set('nom_marque')} error={errors.nom_marque} required />
        <Field id="brand_fond" label="Couleur du fond" type="color" value={brand.couleur_fond} onChange={set('couleur_fond')} error={errors.couleur_fond} />
        <Field id="brand_texte" label="Couleur du texte" type="color" value={brand.couleur_texte} onChange={set('couleur_texte')} error={errors.couleur_texte} />
        <ActiveField id="brand_actif" checked={brand.est_actif} onChange={set('est_actif')} error={errors.est_actif} />
        <div className="brand-bar" style={{ background: brand.couleur_fond, color: brand.couleur_texte, borderRadius: 12, margin: '6px 0 14px' }}>{brand.nom_marque || 'Aperçu'}</div>
        <FormError message={submit.error} success={submit.success} />
        <Button type="submit" size="sm" loading={submit.busy}>Enregistrer</Button>
      </form>
    </>
  );
}
