'use client';
import { useState } from 'react';
import { MAX_QTE, useCartStore } from '@/store/cartStore';
import { toast } from '@/store/toastStore';

export default function PackBuy({ pack }) {
  const addPack = useCartStore((s) => s.addPack);
  const max = Math.min(pack.stock, MAX_QTE);
  const [qty, setQty] = useState(1);

  function add() {
    const { ok, message } = addPack(pack, qty);
    (ok ? toast.success : toast.error)(message);
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
    </>
  );
}
