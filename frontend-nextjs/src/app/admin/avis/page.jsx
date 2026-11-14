'use client';
import { useCallback, useEffect, useState } from 'react';
import PageHead from '@/components/layout/PageHead';
import FormError from '@/components/ui/FormError';
import Stars from '@/components/ui/Stars';
import { api, errorMessage } from '@/lib/api';
import { dateTime } from '@/lib/format';
import { useSubmit } from '@/lib/useSubmit';

/** Modération des avis : un avis n'apparaît sur le site qu'une fois approuvé */
export default function AvisPage() {
  const [rows, setRows] = useState(null);
  const req = useSubmit();
  const { setError: setLoadError } = req;

  const load = useCallback(() => {
    api.get('/admin/reviews').then(({ data }) => setRows(data)).catch((e) => setLoadError(errorMessage(e)));
  }, [setLoadError]);
  useEffect(() => {
    load();
  }, [load]);

  const setApproved = (r, approved) => req.run(() => api.patch(`/admin/reviews/${r.id}`, { approved }), load);
  const destroy = (r) => window.confirm('Supprimer cet avis ?') && req.run(() => api.delete(`/admin/reviews/${r.id}`), load);

  const pending = rows?.filter((r) => !r.approved).length ?? 0;
  return (
    <>
      <PageHead title="Avis clients" note={rows ? `${pending} en attente de validation` : ''} />
      <FormError message={req.error} />
      <div className="panel tablewrap">
        <table className="tbl">
          <thead><tr><th>Produit</th><th>Client</th><th>Avis</th><th>État</th><th className="right">Actions</th></tr></thead>
          <tbody>
            {!rows && <tr><td colSpan={5} className="empty-row">Chargement…</td></tr>}
            {rows?.length === 0 && <tr><td colSpan={5} className="empty-row">Aucun avis pour le moment.</td></tr>}
            {rows?.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.product}</strong></td>
                <td>{r.author}<small style={{ display: 'block' }}>{r.email}</small></td>
                <td style={{ maxWidth: 360 }}><Stars value={r.rating} count={1} className="stars-sm" /><div>{r.comment || <em className="muted">Sans commentaire</em>}</div>{r.date && <small className="muted">{dateTime(r.date)}</small>}</td>
                <td><span className={`pill ${r.approved ? 'pill-livree' : 'pill-role'}`}>{r.approved ? 'Approuvé' : 'En attente'}</span></td>
                <td className="act right">
                  {r.approved
                    ? <button type="button" className="btn-ghost" onClick={() => setApproved(r, false)}>Retirer</button>
                    : <button type="button" className="btn-ok" onClick={() => setApproved(r, true)}>Approuver</button>}{' '}
                  <button type="button" className="btn-danger" onClick={() => destroy(r)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
