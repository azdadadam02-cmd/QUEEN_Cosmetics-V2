'use client';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import FormError from '@/components/ui/FormError';
import Modal from '@/components/ui/Modal';
import { api } from '@/lib/api';
import { useSubmit } from '@/lib/useSubmit';

const EMPTY = { sujet: '', message: '' };

export default function ReportPage() {
  const [form, setForm] = useState(EMPTY);
  const req = useSubmit();
  const { errors, setErrors, busy: sending } = req;
  const [asking, setAsking] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function cancel() {
    setForm(EMPTY);
    setErrors({});
  }

  function ask(e) {
    e.preventDefault();
    const missing = {};
    if (!form.sujet.trim()) missing.sujet = 'Indiquez le sujet.';
    if (!form.message.trim()) missing.message = 'Écrivez votre message.';
    setErrors(missing);
    if (Object.keys(missing).length === 0) setAsking(true);
  }

  async function send() {
    await req.run(() => api.post('/reports', form), () => setForm(EMPTY));
    setAsking(false);
  }

  return (
    <>
      <h1 className="pf-title">Report</h1>
      <form className="pf-form" onSubmit={ask} noValidate>
        <div className="pf-field">
          <label htmlFor="sujet">Sujet</label>
          <input id="sujet" type="text" maxLength={150} value={form.sujet} onChange={set('sujet')} required />
          {errors.sujet && <span className="error-text">{errors.sujet}</span>}
        </div>
        <div className="pf-field">
          <label htmlFor="message">Message</label>
          <textarea id="message" rows={7} maxLength={2000} value={form.message} onChange={set('message')} required />
          {errors.message && <span className="error-text">{errors.message}</span>}
        </div>
        <FormError message={req.error} success={req.success} />
        <div className="pf-actions">
          <button type="submit" className="pf-save">Envoyer</button>
          <button type="button" className="btn-ghost" onClick={cancel}>Annuler</button>
        </div>
      </form>

      <Modal open={asking} onClose={() => !sending && setAsking(false)} title="Envoyer le report">
        <p>Voulez-vous vraiment envoyer ce report ?</p>
        <div className="dialog-actions">
          <button type="button" className="btn-ghost" disabled={sending} onClick={() => setAsking(false)}>Non</button>
          <Button size="sm" loading={sending} onClick={send}>Oui</Button>
        </div>
      </Modal>
    </>
  );
}
