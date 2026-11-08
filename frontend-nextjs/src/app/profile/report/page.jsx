'use client';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { api, errorMessage, fieldErrors } from '@/lib/api';
import { toast } from '@/store/toastStore';

const EMPTY = { sujet: '', message: '' };

export default function ReportPage() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [asking, setAsking] = useState(false);
  const [sending, setSending] = useState(false);

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
    setSending(true);
    try {
      const { data } = await api.post('/reports', form);
      setForm(EMPTY);
      toast.success(data.message);
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(errorMessage(err));
    } finally {
      setSending(false);
      setAsking(false);
    }
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
