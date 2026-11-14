'use client';
import Button from '@/components/ui/Button';
import DialogActions from '@/components/ui/DialogActions';
import Field from '@/components/ui/Field';
import FormError from '@/components/ui/FormError';
import Modal from '@/components/ui/Modal';
import { ActiveField, StatePill, useBarEditor } from './parts';

const EMPTY = { texte: '', lien: '', couleur_fond: '#725A65', couleur_texte: '#FFFFFF', date_debut: '', date_fin: '', est_actif: true };

// <input type="datetime-local"> ↔ ISO (le navigateur gère le fuseau, Laravel le convertit)
const pad = (n) => String(n).padStart(2, '0');
const toInput = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const toIso = (v) => (v ? new Date(v).toISOString() : null);
const fmt = (iso) => (iso ? new Date(iso).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }) : '—');

const toForm = (p) => ({ texte: p.text, lien: p.link || '', couleur_fond: p.background, couleur_texte: p.color, date_debut: toInput(p.starts_at), date_fin: toInput(p.ends_at), est_actif: p.active });

export default function PromoSection({ promos, reload }) {
  const { editing, form, set, open, close, save, destroy, submit, action } = useBarEditor('/admin/promos', reload);
  const { errors } = submit;

  function onSubmit(e) {
    e.preventDefault();
    save({ ...form, date_debut: toIso(form.date_debut), date_fin: toIso(form.date_fin) });
  }

  return (
    <>
      <h2 className="h-serif" style={{ margin: '36px 0 14px' }}>Annonce promo (barre colorée)</h2>
      <p className="muted" style={{ marginBottom: 14 }}>Une seule annonce s&apos;affiche : la plus récente qui est active et dans ses dates. Avec une date de fin, un compte à rebours apparaît à droite du texte.</p>
      <div style={{ marginBottom: 14 }}><Button onClick={() => open({}, EMPTY)}>+ Nouvelle annonce</Button></div>
      <FormError message={action.error} />
      <div className="panel tablewrap">
        <table className="tbl">
          <thead><tr><th>Annonce</th><th>Début</th><th>Fin</th><th>État</th><th className="right">Actions</th></tr></thead>
          <tbody>
            {!promos && <tr><td colSpan={5} className="empty-row">Chargement…</td></tr>}
            {promos?.length === 0 && <tr><td colSpan={5} className="empty-row">Aucune annonce : la barre promo n&apos;est pas affichée.</td></tr>}
            {promos?.map((p) => (
              <tr key={p.id}>
                <td><span className="cell-prod"><span style={{ width: 22, height: 22, borderRadius: 6, background: p.background, border: '1px solid var(--line)' }} /><span><strong>{p.text}</strong><small>{p.link || 'Sans lien'}</small></span></span></td>
                <td>{fmt(p.starts_at)}</td>
                <td>{fmt(p.ends_at)}</td>
                <td><StatePill on={p.active} /></td>
                <td className="act right">
                  <button type="button" className="btn-ghost" onClick={() => open(p, toForm(p))}>Modifier</button>{' '}
                  <button type="button" className="btn-danger" onClick={() => destroy(p)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={editing !== null} onClose={close} title={editing?.id ? "Modifier l'annonce" : 'Nouvelle annonce'}>
        <form onSubmit={onSubmit} noValidate>
          <Field id="texte" label="Texte" type="text" value={form.texte} onChange={set('texte')} error={errors.texte} required />
          <Field id="lien" label="Lien" hint="(optionnel : /products ou https://…)" type="text" value={form.lien} onChange={set('lien')} error={errors.lien} />
          <Field id="couleur_fond" label="Couleur du fond" type="color" value={form.couleur_fond} onChange={set('couleur_fond')} error={errors.couleur_fond} />
          <Field id="couleur_texte" label="Couleur du texte" type="color" value={form.couleur_texte} onChange={set('couleur_texte')} error={errors.couleur_texte} />
          <Field id="date_debut" label="Début" hint="(optionnel)" type="datetime-local" value={form.date_debut} onChange={set('date_debut')} error={errors.date_debut} />
          <Field id="date_fin" label="Fin" hint="(optionnel : active le compte à rebours)" type="datetime-local" value={form.date_fin} onChange={set('date_fin')} error={errors.date_fin} />
          <ActiveField checked={form.est_actif} onChange={set('est_actif')} error={errors.est_actif} />
          <div className="promo-bar" style={{ background: form.couleur_fond, color: form.couleur_texte, borderRadius: 12, margin: '6px 0 14px' }}>
            <span className="promo-text">{form.texte || 'Aperçu'}</span>
          </div>
          <FormError message={submit.error} />
          <DialogActions onCancel={close} busy={submit.busy} />
        </form>
      </Modal>
    </>
  );
}
