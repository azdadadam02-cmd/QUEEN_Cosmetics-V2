'use client';
import Button from '@/components/ui/Button';
import DialogActions from '@/components/ui/DialogActions';
import Field from '@/components/ui/Field';
import FormError from '@/components/ui/FormError';
import Modal from '@/components/ui/Modal';
import { BAR_ICONS, BarIcon } from '@/lib/barIcons';
import { ActiveField, StatePill, useBarEditor } from './parts';

const EMPTY = { icone: '', texte: '', lien: '', ordre_affichage: '', est_actif: true };
const toForm = (u) => ({ icone: u.icon || '', texte: u.text, lien: u.link || '', ordre_affichage: String(u.order), est_actif: u.active });

export default function UspSection({ usps, reload }) {
  const { editing, form, set, open, close, save, destroy, submit, action } = useBarEditor('/admin/usps', reload);
  const { errors } = submit;

  function onSubmit(e) {
    e.preventDefault();
    save(form);
  }

  return (
    <>
      <h2 className="h-serif" style={{ margin: '8px 0 14px' }}>Avantages (barre grise)</h2>
      <div style={{ marginBottom: 14 }}><Button onClick={() => open({}, EMPTY)}>+ Nouvel avantage</Button></div>
      <FormError message={action.error} />
      <div className="panel tablewrap">
        <table className="tbl">
          <thead><tr><th>Avantage</th><th className="num">Ordre</th><th>État</th><th className="right">Actions</th></tr></thead>
          <tbody>
            {!usps && <tr><td colSpan={4} className="empty-row">Chargement…</td></tr>}
            {usps?.length === 0 && <tr><td colSpan={4} className="empty-row">Aucun avantage : la barre grise n&apos;est pas affichée.</td></tr>}
            {usps?.map((u) => (
              <tr key={u.id}>
                <td><span className="cell-prod"><span style={{ width: 22, height: 22, display: 'inline-grid', color: 'var(--plum-2)' }} className="usp-item"><BarIcon name={u.icon} /></span><span><strong>{u.text}</strong><small>{u.link || 'Sans lien'}</small></span></span></td>
                <td className="num">{u.order}</td>
                <td><StatePill on={u.active} /></td>
                <td className="act right">
                  <button type="button" className="btn-ghost" onClick={() => open(u, toForm(u))}>Modifier</button>{' '}
                  <button type="button" className="btn-danger" onClick={() => destroy(u)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={editing !== null} onClose={close} title={editing?.id ? "Modifier l'avantage" : 'Nouvel avantage'}>
        <form onSubmit={onSubmit} noValidate>
          <Field id="icone" label="Icône" error={errors.icone}>
            <select id="icone" value={form.icone} onChange={set('icone')}>
              <option value="">— Aucune —</option>
              {Object.entries(BAR_ICONS).map(([key, { label }]) => <option key={key} value={key}>{label}</option>)}
            </select>
          </Field>
          <Field id="texte" label="Texte" type="text" value={form.texte} onChange={set('texte')} error={errors.texte} required />
          <Field id="lien" label="Lien" hint="(optionnel : /products ou https://…)" type="text" value={form.lien} onChange={set('lien')} error={errors.lien} />
          <Field id="ordre_affichage" label="Ordre" hint="(petit = à gauche)" type="number" min="0" max="999" value={form.ordre_affichage} onChange={set('ordre_affichage')} error={errors.ordre_affichage} />
          <ActiveField checked={form.est_actif} onChange={set('est_actif')} error={errors.est_actif} />
          <FormError message={submit.error} />
          <DialogActions onCancel={close} busy={submit.busy} />
        </form>
      </Modal>
    </>
  );
}
