'use client';
import { useEffect, useState } from 'react';
import FormError from '@/components/ui/FormError';
import { latestAdultBirthDate } from '@/lib/adultDate';
import { api, errorMessage } from '@/lib/api';
import { useSubmit } from '@/lib/useSubmit';
import { useAuthStore } from '@/store/authStore';
import DeleteAccount from './DeleteAccount';
import ProfilePhoto from './ProfilePhoto';

const syncNavbar = (patch) => {
  const store = useAuthStore.getState();
  store.setUser({ ...store.user, ...patch });
};

export default function AccountPage() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ nom: '', telephone: '', adresse: '', date_naissance: '' });
  const details = useSubmit();
  const { errors, busy: saving, setError: setLoadError } = details;

  function apply(p) {
    setProfile(p);
    setForm({ nom: p.name, telephone: p.phone, adresse: p.address, date_naissance: p.birth_date });
    syncNavbar({ name: p.name, image_url: p.image_url });
  }

  // Change seulement la photo : ne perd pas la saisie en cours dans le formulaire
  function photoChanged(p) {
    setProfile(p);
    syncNavbar({ image_url: p.image_url });
  }

  useEffect(() => {
    api.get('/profile').then(({ data }) => apply(data)).catch((e) => setLoadError(errorMessage(e)));
  }, [setLoadError]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function save(e) {
    e.preventDefault();
    details.run(() => api.put('/profile', form), (data) => apply(data.profile));
  }

  if (!profile) return details.error ? <FormError message={details.error} /> : <p className="loading-line">Chargement…</p>;

  return (
    <>
      <ProfilePhoto profile={profile} onChange={photoChanged} />

      <form className="pf-form" onSubmit={save} noValidate>
        <PfField id="nom" label="Nom complet" error={errors.nom}>
          <input id="nom" type="text" autoComplete="name" value={form.nom} onChange={set('nom')} required />
        </PfField>
        <PfField id="telephone" label="Téléphone" error={errors.telephone}>
          <input id="telephone" type="tel" autoComplete="tel" value={form.telephone} onChange={set('telephone')} />
        </PfField>
        <div className="pf-row">
          <PfField id="adresse" label="Adresse" error={errors.adresse}>
            <input id="adresse" type="text" autoComplete="street-address" value={form.adresse} onChange={set('adresse')} />
          </PfField>
          <PfField id="date_naissance" label="Date de naissance" error={errors.date_naissance}>
            <input id="date_naissance" type="date" autoComplete="bday" min="1900-01-01" max={latestAdultBirthDate()} value={form.date_naissance} onChange={set('date_naissance')} />
          </PfField>
        </div>
        <FormError message={details.error} success={details.success} />
        <button type="submit" className="pf-save" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
      </form>

      <DeleteAccount />
    </>
  );
}

function PfField({ id, label, error, children }) {
  return (
    <div className="pf-field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}
