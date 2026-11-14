'use client';
import { useCallback, useEffect, useState } from 'react';
import PageHead from '@/components/layout/PageHead';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import DialogActions from '@/components/ui/DialogActions';
import Field from '@/components/ui/Field';
import FormError from '@/components/ui/FormError';
import Modal from '@/components/ui/Modal';
import { api, errorMessage } from '@/lib/api';
import { ROLE_LABELS } from '@/lib/auth';
import { useSubmit } from '@/lib/useSubmit';

const ROLES = ['client', 'responsable_produits', 'responsable_commandes'];
const EMPTY = { nom: '', email: '', role: 'client', password: '' };

/** Gestion des utilisateurs (sauf comptes admin) */
export default function UtilisateursPage() {
  const [users, setUsers] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const submit = useSubmit();
  const action = useSubmit();
  const { errors } = submit;
  const { setError: setLoadError } = action;

  const load = useCallback(() => {
    api.get('/admin/users').then(({ data }) => setUsers(data)).catch((e) => setLoadError(errorMessage(e)));
  }, [setLoadError]);
  useEffect(() => {
    load();
  }, [load]);

  function open(u = {}) {
    setEditing(u);
    submit.reset();
    setForm(u.id ? { nom: u.name, email: u.email, role: u.role, password: '' } : EMPTY);
  }
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function save(e) {
    e.preventDefault();
    submit.run(() => (editing.id ? api.put(`/admin/users/${editing.id}`, form) : api.post('/admin/users', form)), () => {
      setEditing(null);
      load();
    });
  }

  function destroy(u) {
    if (!window.confirm(`Supprimer « ${u.name} » ?`)) return;
    action.run(() => api.delete(`/admin/users/${u.id}`), load);
  }

  return (
    <>
      <PageHead title="Utilisateurs" note="Les comptes administrateur ne sont pas modifiables ici">
        <Button onClick={() => open()}>+ Nouvel utilisateur</Button>
      </PageHead>
      <FormError message={action.error} />
      <div className="panel tablewrap">
        <table className="tbl">
          <thead><tr><th>Utilisateur</th><th>Rôle</th><th className="num">Commandes</th><th className="right">Actions</th></tr></thead>
          <tbody>
            {!users && <tr><td colSpan={4} className="empty-row">Chargement…</td></tr>}
            {users?.length === 0 && <tr><td colSpan={4} className="empty-row">Aucun utilisateur.</td></tr>}
            {users?.map((u) => (
              <tr key={u.id}>
                <td><span className="cell-prod"><Avatar src={u.image_url} name={u.name} className="avatar sm" /><span><strong>{u.name}</strong><small>{u.email}</small></span></span></td>
                <td><span className={`pill pill-${u.role}`}>{ROLE_LABELS[u.role]}</span></td>
                <td className="num">{u.orders_count}</td>
                <td className="act right">
                  <button type="button" className="btn-ghost" onClick={() => open(u)}>Modifier</button>{' '}
                  <button type="button" className="btn-danger" onClick={() => destroy(u)} disabled={u.orders_count > 0} title={u.orders_count > 0 ? 'A déjà passé des commandes' : ''}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing?.id ? `Modifier « ${editing.name} »` : 'Nouvel utilisateur'}>
        <form onSubmit={save} noValidate>
          <Field id="nom" label="Nom" type="text" value={form.nom} onChange={set('nom')} error={errors.nom} required />
          <Field id="email" label="Email" type="email" value={form.email} onChange={set('email')} error={errors.email} required />
          <Field id="role" label="Rôle" error={errors.role}>
            <select id="role" value={form.role} onChange={set('role')}>
              {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
            </select>
          </Field>
          <Field id="password" label="Mot de passe" hint={editing?.id ? '(vide = inchangé)' : '(8 caractères min., 1 majuscule)'} type="password" value={form.password} onChange={set('password')} error={errors.password} autoComplete="new-password" />
          <FormError message={submit.error} />
          <DialogActions onCancel={() => setEditing(null)} busy={submit.busy} />
        </form>
      </Modal>
    </>
  );
}
