'use client';
import { Fragment, useEffect, useState } from 'react';
import FormError from '@/components/ui/FormError';
import { api, errorMessage } from '@/lib/api';
import { useSubmit } from '@/lib/useSubmit';
import OrderRow from './orders-table/OrderRow';
import StatusChips from './orders-table/StatusChips';

/** Liste des commandes. readOnly = admin (consultation), sinon responsable commandes (actions) */
export default function OrdersTable({ readOnly = false }) {
  const [filter, setFilter] = useState('');
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const req = useSubmit();
  const { setError: setLoadError } = req;

  // Recharge quand le filtre change ou après une action
  useEffect(() => {
    let alive = true;
    api
      .get('/manage/orders', { params: filter ? { status: filter } : {} })
      .then(({ data }) => alive && setData(data))
      .catch((e) => setLoadError(errorMessage(e)));
    return () => {
      alive = false;
    };
  }, [filter, reloadKey, setLoadError]);

  async function changeStatus(order, status) {
    const cancel = order.status === 'Acceptee' && status === 'Refusee';
    if (status === 'Refusee' && !window.confirm(`${cancel ? 'Annuler' : 'Refuser'} la commande n° ${order.id} ? Le stock sera remis en rayon.`)) return;
    setBusy(order.id);
    await req.run(() => api.patch(`/manage/orders/${order.id}/status`, { status }), () => setReloadKey((k) => k + 1));
    setBusy(null);
  }

  return (
    <>
      <FormError message={req.error} />
      <StatusChips value={filter} onChange={setFilter} counters={data?.counters} />

      <div className="panel tablewrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>N°</th><th>Client</th><th>Livraison</th><th>Date</th><th className="num">Total</th><th>Statut</th><th>Paiement</th>
              <th className="right">{readOnly ? 'Détails' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {!data && <tr><td colSpan={8} className="empty-row">Chargement…</td></tr>}
            {data?.orders.length === 0 && <tr><td colSpan={8} className="empty-row">Aucune commande.</td></tr>}
            {data?.orders.map((o) => (
              <Fragment key={o.id}>
                <OrderRow order={o} onStatus={readOnly ? null : changeStatus} busy={busy === o.id} />
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
