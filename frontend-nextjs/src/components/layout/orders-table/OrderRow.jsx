'use client';
import { Fragment, useState } from 'react';
import StatusPill from '@/components/ui/StatusPill';
import Thumb from '@/components/ui/Thumb';
import VariantTag from '@/components/ui/VariantTag';
import { dateTime, money } from '@/lib/format';

const ACTIONS = {
  Acceptee: ['btn-ok', 'Accepter'],
  Livree: ['btn-ok', 'Marquer livrée'],
  Refusee: ['btn-danger', 'Refuser'],
};

/** Une commande + son détail dépliable. onStatus absent = lecture seule (admin) ; Refusee depuis Acceptee s'affiche « Annuler » */
export default function OrderRow({ order: o, onStatus, busy }) {
  const [open, setOpen] = useState(false);
  const paid = o.payment?.status === 'Paye';

  return (
    <>
      <tr>
        <td><strong>#{o.id}</strong></td>
        <td>{o.client?.name}<small>{o.client?.email}</small></td>
        <td>{o.delivery.name || '—'}<small>{[o.delivery.phone, o.delivery.city].filter(Boolean).join(' · ')}</small></td>
        <td>{dateTime(o.date)}</td>
        <td className="num"><strong>{money(o.total)}</strong></td>
        <td><StatusPill status={o.status} /></td>
        <td><span className={`pay-state${paid ? ' paid' : ''}`}>{paid ? 'Payé' : 'À la livraison'}</span></td>
        <td className="act right">
          <button type="button" className="btn-ghost" onClick={() => setOpen((v) => !v)}>{open ? 'Masquer' : 'Détails'}</button>{' '}
          {onStatus && o.next_statuses.map((s) => (
            <Fragment key={s}>
              <button type="button" className={ACTIONS[s][0]} disabled={busy} onClick={() => onStatus(o, s)}>
                {o.status === 'Acceptee' && s === 'Refusee' ? 'Annuler' : ACTIONS[s][1]}
              </button>{' '}
            </Fragment>
          ))}
        </td>
      </tr>
      {open && (
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
    </>
  );
}
