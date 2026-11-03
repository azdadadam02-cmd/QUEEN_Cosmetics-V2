'use client';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { toast } from '@/store/toastStore';

/** Bouton « Ajouter au panier » (le panier vit dans Zustand, vérifié par Laravel plus tard) */
export default function AddToCartButton({ product, quantity = 1, block = true }) {
  const add = useCartStore((s) => s.add);
  const [done, setDone] = useState(false);
  const out = !product.in_stock;

  function onClick() {
    const { ok, message } = add(product, quantity);
    (ok ? toast.success : toast.error)(message);
    if (ok) {
      setDone(true);
      setTimeout(() => setDone(false), 1400);
    }
  }

  return (
    <button type="button" className={`btn btn-gold${block ? ' btn-block' : ''}${done ? ' done' : ''}`} disabled={out} onClick={onClick}>
      <span className="lbl">{out ? 'Indisponible' : done ? 'Ajouté ✓' : 'Ajouter au panier'}</span>
    </button>
  );
}
