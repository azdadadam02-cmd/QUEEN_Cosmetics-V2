'use client';
import { useState } from 'react';
import FormError from '@/components/ui/FormError';
import { MAX_QTE, useCartStore } from '@/store/cartStore';

export default function PackBuy({ pack }) {
  const addPack = useCartStore((s) => s.addPack);
  const max = Math.min(pack.stock, MAX_QTE);
  const [qty, setQty] = useState(1);
  const [notice, setNotice] = useState(null);

  function add() {
    setNotice(addPack(pack, qty));
  }

  return (
    <>
      {pack.stock <= 0 && <span className="status out">Pack indisponible pour le moment</span>}
      {pack.stock > 0 && pack.stock <= 5 && <span className="status low">Plus que {pack.stock} en stock</span>}
      <div className="pd-add">
        <select value={qty} onChange={(e) => setQty(Number(e.target.value))} disabled={max <= 0} aria-label="Quantité">
          {Array.from({ length: Math.max(max, 1) }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
        </select>
        <button type="button" onClick={add} disabled={max <= 0}>{max > 0 ? 'Ajouter' : 'Indisponible'}</button>
      </div>
      <FormError message={notice?.ok ? '' : notice?.message} success={notice?.ok ? notice.message : ''} />
    </>
  );
}
