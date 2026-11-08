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

/** Suppression définitive du compte, après une case à cocher de confirmation */
export default function DeleteAccount() {
  const router = useRouter();
  const leave = useContext(LeaveContext);
  const account = useSubmit();
  const [ask, setAsk] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  function close() {
    setAsk(false);
    setConfirmed(false);
  }

  async function remove() {
    const done = await account.run(() => api.delete('/profile'), () => {
      leave();
      useAuthStore.getState().clear();
      router.replace('/');
    });
    if (!done) close();
  }

  return (
    <>
      <section className="pf-danger">
        <div>
          <strong>Supprimer mon compte</strong>
          <p>Vos informations, favoris et avis seront effacés définitivement.</p>
        </div>
        <FormError message={account.error} />
        <button type="button" className="pf-delete" onClick={() => setAsk(true)}>Supprimer mon compte</button>
      </section>

      <Modal open={ask} onClose={close} title="Supprimer mon compte">
        <p>Voulez-vous vraiment supprimer votre compte ? Cette action est définitive.</p>
        <button type="button" className={`pf-x${confirmed ? ' on' : ''}`} role="checkbox" aria-checked={confirmed} onClick={() => setConfirmed((c) => !c)}>
          <span aria-hidden="true">{confirmed ? '✕' : ''}</span>
          Je confirme la suppression de mon compte
        </button>
        <div className="dialog-actions">
          <button type="button" className="btn-ghost" onClick={close}>Annuler</button>
          <Button variant="danger" size="sm" disabled={!confirmed} loading={account.busy} onClick={remove}>Supprimer</Button>
        </div>
      </Modal>
    </>
  );
}
