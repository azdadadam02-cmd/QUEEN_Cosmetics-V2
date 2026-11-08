'use client';
import { useState } from 'react';
import Field from '@/components/ui/Field';
import { api } from '@/lib/api';
import { useSubmit } from '@/lib/useSubmit';

export const StatePill = ({ on }) => <span className={`pill ${on ? 'pill-livree' : 'pill-role'}`}>{on ? 'Actif' : 'Inactif'}</span>;

export function ActiveField({ id = 'est_actif', checked, onChange, error }) {
  return (
    <Field id={id} error={error}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <input id={id} type="checkbox" checked={!!checked} onChange={onChange} /> Afficher sur le site
      </label>
    </Field>
  );
}

/** Ajout / modification / suppression d'une ligne de barre (avantage ou annonce) : même logique, seule l'URL change */
export function useBarEditor(path, reload) {
  const submit = useSubmit();
  const action = useSubmit();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  function open(row, values) {
    setEditing(row);
    setForm(values);
    submit.reset();
  }
  const close = () => setEditing(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  function save(body) {
    submit.run(() => (editing.id ? api.put(`${path}/${editing.id}`, body) : api.post(path, body)), () => {
      close();
      reload();
    });
  }

  function destroy(row) {
    if (!window.confirm(`Supprimer « ${row.text} » ?`)) return;
    action.run(() => api.delete(`${path}/${row.id}`), reload);
  }

  return { editing, form, set, open, close, save, destroy, submit, action };
}
