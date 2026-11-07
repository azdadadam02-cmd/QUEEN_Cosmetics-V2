'use client';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import StatusPill from '@/components/ui/StatusPill';
import Thumb from '@/components/ui/Thumb';
import VariantTag from '@/components/ui/VariantTag';
import { api, errorMessage } from '@/lib/api';
import { dateTime, money } from '@/lib/format';
import { toast } from '@/store/toastStore';

const STEPS = ['Reçue', 'Acceptée', 'Livrée'];
const stepIndex = { 'En attente': 0, Acceptee: 1, Livree: 2, Refusee: 1 };

/** My Orders : suivi des commandes, reçue → acceptée → livrée (ou refusée) */
export default function OrdersPage() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    api.get('/notifications').then(({ data }) => setOrders(data)).catch((e) => toast.error(errorMessage(e)));
  }, []);

  return (
    <>
      <h1 className="pf-title">My Orders</h1>

      {!orders && <p className="loading-line">Chargement…</p>}
      {orders?.length === 0 && (
        <div className="empty-state">
          <span className="empty-ico">✦</span>
          <h3>Aucune commande pour le moment</h3>
          <p>Vos commandes et leur suivi apparaîtront ici.</p>
          <Button href="/products">Découvrir la collection</Button>
        </div>
      )}

      <div className="notifs">
        {orders?.map((o) => {
          const refused = o.status === 'Refusee';
          const cur = stepIndex[o.status] ?? 0;
          return (
            <article key={o.id} className={`notif${o.is_new ? ' new' : ''}`}>
              <div className="notif-head">
                <div>
                  <h3>Commande n° {o.id}</h3>
                  <small>{dateTime(o.date)}</small>
                </div>
                <div className="notif-side">
                  {o.is_new && <span className="new-tag">Nouveau</span>}
                  <StatusPill status={o.status} />
                </div>
              </div>
              <p className="notif-msg">{o.status_message}</p>

              <ol className={`steps${refused ? ' refused' : ''}`}>
                {(refused ? ['Reçue', 'Refusée'] : STEPS).map((label, i) => (
                  <li key={label} className={i < cur ? 'done' : i === cur ? 'current' : ''}>
                    <i>{refused && i === 1 ? '✕' : i + 1}</i>
                    {label}
                  </li>
                ))}
              </ol>

              {o.delivery?.address && (
                <p className="notif-ship">Livraison : {o.delivery.name} · {o.delivery.phone} · {o.delivery.address}, {o.delivery.city}</p>
              )}
              <ul className="notif-items">
                {o.items.map((it) => (
                  <li key={it.id}>
                    <Thumb src={it.image_url} name={it.name} size="xs" />
                    <span className="ni-name">{it.name} <VariantTag color={it.variant_color} size={it.variant_size} /> {it.pack_name && <small className="pack-tag">{it.pack_name}</small>} <em>× {it.quantity}</em></span>
                    <span className="ni-price">{money(it.subtotal)}</span>
                  </li>
                ))}
              </ul>
              <div className="notif-foot">
                <span className={`pay-state${o.payment?.status === 'Paye' ? ' paid' : ''}`}>
                  {o.payment?.status === 'Paye' ? '✓ Payé à la livraison' : 'Paiement à la livraison'}
                </span>
                <span className="notif-total">{money(o.total)}</span>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
