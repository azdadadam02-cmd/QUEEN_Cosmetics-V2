'use client';
import { useCallback, useEffect, useState } from 'react';
import PageHead from '@/components/layout/PageHead';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import Modal from '@/components/ui/Modal';
import { api, errorMessage, fieldErrors } from '@/lib/api';
import { ROLE_LABELS } from '@/lib/auth';
import { toast } from '@/store/toastStore';

const ROLES = ['client', 'responsable_produits', 'responsable_commandes'];
const EMPTY = { nom: '', email: '', role: 'client', password: '' };

export default function UtilisateursPage() {
  const [users, setUsers] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    api.get('/admin/users').then(({ data }) => setUsers(data)).catch((e) => toast.error(errorMessage(e)));
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  function open(u = {}) {
    setEditing(u);
    setErrors({});
    setForm(u.id ? { nom: u.name, email: u.email, role: u.role, password: '' } : EMPTY);
  }
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const { data } = editing.id ? await api.put(`/admin/users/${editing.id}`, form) : await api.post('/admin/users', form);
      toast.success(data.message);
      setEditing(null);
      load();
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function destroy(u) {
    if (!window.confirm(`Supprimer « ${u.name} » ?`)) return;
    try {
      const { data } = await api.delete(`/admin/users/${u.id}`);
      toast.success(data.message);
      load();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }

  return (
    <>
      <PageHead title="Utilisateurs" note="Les comptes administrateur ne sont pas modifiables ici">
        <Button onClick={() => open()}>+ Nouvel utilisateur</Button>
      </PageHead>
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
          <div className="dialog-actions">
            <button type="button" className="btn-ghost" onClick={() => setEditing(null)}>Annuler</button>
            <Button type="submit" size="sm" loading={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
