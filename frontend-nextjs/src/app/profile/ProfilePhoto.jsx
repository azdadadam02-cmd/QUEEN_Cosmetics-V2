'use client';
import Image from 'next/image';
import { useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import FormError from '@/components/ui/FormError';
import Modal from '@/components/ui/Modal';
import { api } from '@/lib/api';
import { useSubmit } from '@/lib/useSubmit';

/** En-tête du compte : photo (changer / supprimer), nom, email. onChange reçoit le profil renvoyé par l'API. */
export default function ProfilePhoto({ profile, onChange }) {
  const photo = useSubmit();
  const [ask, setAsk] = useState(false);
  const fileRef = useRef(null);

  function choose() {
    setAsk(false);
    fileRef.current?.click();
  }

  function onFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';   // permet de rechoisir le même fichier après une erreur
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    photo.run(() => api.post('/profile/image', fd), (data) => onChange(data.profile));
  }

  function remove() {
    setAsk(false);
    photo.run(() => api.delete('/profile/image'), (data) => onChange(data.profile));
  }

  return (
    <>
      <header className="pf-head pf-card">
        <button type="button" className="pf-avatar" onClick={() => setAsk(true)} disabled={photo.busy} aria-label="Changer la photo de profil">
          {profile.image_url ? (
            <Image src={profile.image_url} alt="" fill sizes="140px" />
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="3.6" /><path d="M5 20a7.2 7.2 0 0 1 14 0 9.6 9.6 0 0 1-14 0z" /></svg>
          )}
          <span className="pf-cam" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.2" /></svg></span>
        </button>
        <div>
          <h1 className="pf-title">{profile.name} <span className="pf-chip">Client</span></h1>
          <p className="pf-email">{profile.email}</p>
          <button type="button" className="pf-photo-link" onClick={() => setAsk(true)} disabled={photo.busy}>Changer la photo</button>
        </div>
      </header>
      <input ref={fileRef} type="file" hidden accept="image/jpeg,image/png,image/webp,image/gif" onChange={onFile} />
      <FormError message={photo.error || photo.errors.image} />

      <Modal open={ask} onClose={() => setAsk(false)} title="Photo de profil">
        <p>Voulez-vous changer votre photo ?</p>
        <div className="dialog-actions">
          {profile.image_url && <button type="button" className="btn-danger" onClick={remove}>Supprimer la photo</button>}
          <button type="button" className="btn-ghost" onClick={() => setAsk(false)}>Non</button>
          <Button size="sm" onClick={choose}>Oui</Button>
        </div>
      </Modal>
    </>
  );
}
