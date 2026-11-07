'use client';
import { Fragment, useEffect, useState } from 'react';
import Thumb from '@/components/ui/Thumb';
import VariantTag from '@/components/ui/VariantTag';
import StatusPill from '@/components/ui/StatusPill';
import { api, errorMessage } from '@/lib/api';
import { dateTime, money, STATUS } from '@/lib/format';
import { toast } from '@/store/toastStore';

const ACTIONS = {
  Acceptee: ['btn-ok', 'Accepter'],
  Livree: ['btn-ok', 'Marquer livrée'],
  Refusee: ['btn-danger', 'Refuser'],
};

/** Liste des commandes. readOnly = admin (consultation), sinon responsable commandes (actions) */
export default function OrdersTable({ readOnly = false }) {
  const [filter, setFilter] = useState('');
  const [data, setData] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [busy, setBusy] = useState(null);

  const [reloadKey, setReloadKey] = useState(0);

  // Recharge quand le filtre change ou après une action
  useEffect(() => {
    let alive = true;
    api
      .get('/manage/orders', { params: filter ? { status: filter } : {} })
      .then(({ data }) => alive && setData(data))
      .catch((e) => toast.error(errorMessage(e)));
    return () => {
      alive = false;
    };
  }, [filter, reloadKey]);

  async function changeStatus(order, status) {
    const cancel = order.status === 'Acceptee' && status === 'Refusee';
    if (status === 'Refusee' && !window.confirm(`${cancel ? 'Annuler' : 'Refuser'} la commande n° ${order.id} ? Le stock sera remis en rayon.`)) return;
    setBusy(order.id);
    try {
      const { data: res } = await api.patch(`/manage/orders/${order.id}/status`, { status });
      toast.success(res.message);
      setReloadKey((k) => k + 1);
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusy(null);
    }
  }

  const counters = data?.counters || {};
  const total = Object.values(counters).reduce((a, b) => a + Number(b), 0);

  return (
    <>
      <div className="chips" role="group" aria-label="Filtrer par statut">
        <button type="button" className={`chip${filter === '' ? ' active' : ''}`} onClick={() => setFilter('')}>
          Toutes <b>{total}</b>
        </button>
        {Object.entries(STATUS).map(([key, s]) => (
          <button key={key} type="button" className={`chip${filter === key ? ' active' : ''}`} onClick={() => setFilter(key)}>
            {s.label} <b>{counters[key] || 0}</b>
          </button>
        ))}
      </div>

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
                <tr>
                  <td><strong>#{o.id}</strong></td>
                  <td>{o.client?.name}<small>{o.client?.email}</small></td>
                  <td>{o.delivery.name || '—'}<small>{[o.delivery.phone, o.delivery.city].filter(Boolean).join(' · ')}</small></td>
                  <td>{dateTime(o.date)}</td>
                  <td className="num"><strong>{money(o.total)}</strong></td>
                  <td><StatusPill status={o.status} /></td>
                  <td><span className={`pay-state${o.payment?.status === 'Paye' ? ' paid' : ''}`}>{o.payment?.status === 'Paye' ? 'Payé' : 'À la livraison'}</span></td>
                  <td className="act right">
                    <button type="button" className="btn-ghost" onClick={() => setOpenId(openId === o.id ? null : o.id)}>
                      {openId === o.id ? 'Masquer' : 'Détails'}
                    </button>{' '}
                    {!readOnly &&
                      o.next_statuses.map((s) => (
                        <Fragment key={s}>
                          <button type="button" className={ACTIONS[s][0]} disabled={busy === o.id} onClick={() => changeStatus(o, s)}>
                            {o.status === 'Acceptee' && s === 'Refusee' ? 'Annuler' : ACTIONS[s][1]}
                          </button>{' '}
                        </Fragment>
                      ))}
                  </td>
                </tr>
                {openId === o.id && (
                  <tr className="o-detail">
                    <td colSpan={8}>
                      <div className="ship"><b>Adresse</b> {o.delivery.address} — {o.delivery.city} · {o.delivery.phone}</div>
                      <ul className="lines">
                        {o.items.map((it) => (
                          <li key={it.id}>
                            <Thumb src={it.image_url} name={it.name} size="xs" />
                            <span>{it.name} <VariantTag color={it.variant_color} size={it.variant_size} /> {it.pack_name && <small className="pack-tag">{it.pack_name}</small>} <em>× {it.quantity} · {money(it.unit_price)}</em></span>
                            <span>{money(it.subtotal)}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
