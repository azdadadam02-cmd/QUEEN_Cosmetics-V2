'use client';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import Button from '@/components/ui/Button';
import FormError from '@/components/ui/FormError';
import Modal from '@/components/ui/Modal';
import { api } from '@/lib/api';
import { useSubmit } from '@/lib/useSubmit';
import { useAuthStore } from '@/store/authStore';
import { LeaveContext } from './ProfileShell';

/** Suppression définitive du compte : case à cocher + mot de passe (un token volé ne suffit pas) */
export default function DeleteAccount() {
  const router = useRouter();
  const leave = useContext(LeaveContext);
  const account = useSubmit();
  const [ask, setAsk] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [password, setPassword] = useState('');

  function close() {
    setAsk(false);
    setConfirmed(false);
    setPassword('');
    account.reset();
  }

  // En cas d'échec la fenêtre reste ouverte : le message s'affiche à côté du mot de passe
  function remove(e) {
    e.preventDefault();
    account.run(() => api.delete('/profile', { data: { password } }), () => {
      leave();
      useAuthStore.getState().clear();
      router.replace('/');
    });
  }

  return (
    <>
      <section className="pf-danger">
        <div>
          <strong>Supprimer mon compte</strong>
          <p>Vos informations, favoris et avis seront effacés définitivement.</p>
        </div>
        <button type="button" className="pf-delete" onClick={() => setAsk(true)}>Supprimer mon compte</button>
      </section>

      <Modal open={ask} onClose={close} title="Supprimer mon compte">
        <p>Voulez-vous vraiment supprimer votre compte ? Cette action est définitive.</p>
        <button type="button" className={`pf-x${confirmed ? ' on' : ''}`} role="checkbox" aria-checked={confirmed} onClick={() => setConfirmed((c) => !c)}>
          <span aria-hidden="true">{confirmed ? '✕' : ''}</span>
          Je confirme la suppression de mon compte
        </button>
        <form onSubmit={remove}>
          <div className="pf-field">
            <label htmlFor="delete-password">Mot de passe</label>
            <input id="delete-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <FormError message={account.errors.password || account.error} />
          <div className="dialog-actions">
            <button type="button" className="btn-ghost" onClick={close}>Annuler</button>
            <Button type="submit" variant="danger" size="sm" disabled={!confirmed || !password} loading={account.busy}>Supprimer</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
