'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';
import { LeaveContext } from './ProfileShell';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { api, errorMessage, fieldErrors } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/toastStore';

/** Account Details : photo, nom, téléphone, adresse, date de naissance, suppression du compte */
export default function AccountPage() {
  const router = useRouter();
  const leave = useContext(LeaveContext);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ nom: '', telephone: '', adresse: '', date_naissance: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [askPhoto, setAskPhoto] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [askDelete, setAskDelete] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileRef = useRef(null);

  function apply(p) {
    setProfile(p);
    setForm({ nom: p.name, telephone: p.phone, adresse: p.address, date_naissance: p.birth_date });
    const store = useAuthStore.getState();
    store.setUser({ ...store.user, name: p.name, image_url: p.image_url });   // navbar à jour tout de suite
  }

  useEffect(() => {
    api.get('/profile').then(({ data }) => apply(data)).catch((e) => toast.error(errorMessage(e)));
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const { data } = await api.put('/profile', form);
      apply(data.profile);
      toast.success(data.message);
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  function choosePhoto() {
    setAskPhoto(false);
    fileRef.current?.click();
  }

  async function onPhoto(e) {
    const file = e.target.files?.[0];
    e.target.value = '';   // permet de rechoisir le même fichier après une erreur
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const { data } = await api.post('/profile/image', fd);
      keepTyping(data.profile);
      toast.success(data.message);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setUploading(false);
    }
  }

  // Change seulement la photo : ne perd pas la saisie en cours dans le formulaire
  function keepTyping(p) {
    setProfile(p);
    const store = useAuthStore.getState();
    store.setUser({ ...store.user, image_url: p.image_url });
  }

  async function removePhoto() {
    setAskPhoto(false);
    setUploading(true);
    try {
      const { data } = await api.delete('/profile/image');
      keepTyping(data.profile);
      toast.success(data.message);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setUploading(false);
    }
  }

  function closeDelete() {
    setAskDelete(false);
    setConfirmed(false);
  }

  async function removeAccount() {
    setDeleting(true);
    try {
      const { data } = await api.delete('/profile');
      leave();
      useAuthStore.getState().clear();
      toast.success(data.message);
      router.replace('/');
    } catch (err) {
      closeDelete();   // sinon le message reste caché derrière la fenêtre
      toast.error(errorMessage(err));
      setDeleting(false);
    }
  }

  if (!profile) return <p className="loading-line">Chargement…</p>;

  return (
    <>
      <button type="button" className="pf-avatar" onClick={() => setAskPhoto(true)} disabled={uploading} aria-label="Changer la photo de profil">
        {profile.image_url ? (
          <Image src={profile.image_url} alt="" fill sizes="140px" />
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="3.6" /><path d="M5 20a7.2 7.2 0 0 1 14 0 9.6 9.6 0 0 1-14 0z" /></svg>
        )}
      </button>
      <input ref={fileRef} type="file" hidden accept="image/jpeg,image/png,image/webp,image/gif" onChange={onPhoto} />

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
            <input id="date_naissance" type="date" autoComplete="bday" value={form.date_naissance} onChange={set('date_naissance')} />
          </PfField>
        </div>
        <button type="submit" className="pf-save" disabled={saving}>{saving ? 'Enregistrement…' : 'Save'}</button>
      </form>

      <button type="button" className="pf-delete" onClick={() => setAskDelete(true)}>Supprimer mon compte</button>

      <Modal open={askPhoto} onClose={() => setAskPhoto(false)} title="Photo de profil">
        <p>Voulez-vous changer votre photo ?</p>
        <div className="dialog-actions">
          {profile.image_url && <button type="button" className="btn-danger" onClick={removePhoto}>Supprimer la photo</button>}
          <button type="button" className="btn-ghost" onClick={() => setAskPhoto(false)}>Non</button>
          <Button size="sm" onClick={choosePhoto}>Oui</Button>
        </div>
      </Modal>

      <Modal open={askDelete} onClose={closeDelete} title="Supprimer mon compte">
        <p>Voulez-vous vraiment supprimer votre compte ? Cette action est définitive.</p>
        <button type="button" className={`pf-x${confirmed ? ' on' : ''}`} role="checkbox" aria-checked={confirmed} onClick={() => setConfirmed((c) => !c)}>
          <span aria-hidden="true">{confirmed ? '✕' : ''}</span>
          Je confirme la suppression de mon compte
        </button>
        <div className="dialog-actions">
          <button type="button" className="btn-ghost" onClick={closeDelete}>Annuler</button>
          <Button variant="danger" size="sm" disabled={!confirmed} loading={deleting} onClick={removeAccount}>Supprimer</Button>
        </div>
      </Modal>
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
