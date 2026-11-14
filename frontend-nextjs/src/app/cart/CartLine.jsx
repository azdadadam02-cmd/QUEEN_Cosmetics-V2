'use client';
import Link from 'next/link';
import { useState } from 'react';
import Thumb from '@/components/ui/Thumb';
import VariantTag from '@/components/ui/VariantTag';
import { money } from '@/lib/format';
import { MAX_QTE } from '@/store/cartStore';

/** Une ligne du panier : produit ou pack (avec son détail dépliable), quantité, retrait */
export default function CartLine({ item: i, onQuantity, onRemove }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="cart-item">
      <Link href={i.pack_id ? `/packs/${i.pack_id}` : `/products/${i.id}`}><Thumb src={i.image_url} name={i.name} /></Link>
      <div className="ci-info">
        <h3>{i.name}</h3>
        <VariantTag color={i.variant_color} size={i.variant_size} />
        {i.pack_id && (
          <button type="button" className="link-remove pack-detail-btn" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            {open ? 'Masquer le détail' : 'Détail'}
          </button>
        )}
        <small>{money(i.price)} · {i.stock} en stock</small>
      </div>
      <div className="qty-form">
        <div className="qty">
          <button type="button" aria-label="Moins" onClick={() => onQuantity(i.quantity - 1)}>−</button>
          <span>{i.quantity}</span>
          <button type="button" aria-label="Plus" disabled={i.quantity >= Math.min(i.stock, MAX_QTE)} onClick={() => onQuantity(i.quantity + 1)}>+</button>
        </div>
        <button type="button" className="link-remove" onClick={onRemove}>Retirer</button>
      </div>
      <span className="ci-total">{money(i.price * i.quantity)}</span>
      {i.pack_id && open && (
        <ul className="pack-lines">
          {(i.products || []).map((it) => (
            <li key={it.id}>
              <Link href={`/products/${it.id}`}><Thumb src={it.image_url} name={it.name} size="xs" /><span>{it.name} × {it.quantity * i.quantity}</span></Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
