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
  const [editing, setEditing] = useState(false);

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
    details.run(() => api.put('/profile', form), (data) => { apply(data.profile); setEditing(false); });
  }

  function cancel() {
    apply(profile);
    details.reset();
    setEditing(false);
  }

  if (!profile) return details.error ? <FormError message={details.error} /> : <p className="loading-line">Chargement…</p>;

  return (
    <>
      <ProfilePhoto profile={profile} onChange={photoChanged} />

      {!editing ? (
        <section className="pf-card">
          <div className="pf-card-head">
            <h2>Informations personnelles</h2>
            <button type="button" className="pf-edit" onClick={() => { details.reset(); setEditing(true); }}>
              Modifier
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="m13.5 6.5 4 4" /></svg>
            </button>
          </div>
          <dl className="pf-info">
            <Info label="Nom complet" value={profile.name} />
            <Info label="Email" value={profile.email} />
            <Info label="Téléphone" value={profile.phone} />
            <Info label="Date de naissance" value={profile.birth_date?.split('-').reverse().join('/')} />
            <Info label="Adresse" value={profile.address} />
          </dl>
          <FormError success={details.success} />
        </section>
      ) : (
      <form className="pf-form pf-card" onSubmit={save} noValidate>
        <div className="pf-card-head"><h2>Modifier mes informations</h2></div>
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
        <div className="pf-actions">
          <button type="submit" className="pf-save" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
          <button type="button" className="btn-ghost" onClick={cancel} disabled={saving}>Annuler</button>
        </div>
      </form>
      )}

      <DeleteAccount />
    </>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value || <span className="pf-empty">Non renseigné</span>}</dd>
    </div>
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
