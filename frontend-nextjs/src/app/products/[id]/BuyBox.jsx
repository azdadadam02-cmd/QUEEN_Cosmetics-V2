'use client';
import { useState } from 'react';
import AddToCartButton from '@/components/layout/AddToCartButton';
import Button from '@/components/ui/Button';
import { MAX_QTE } from '@/store/cartStore';

/** Choix de la quantité + ajout au panier (partie interactive de la fiche produit) */
export default function BuyBox({ product }) {
  const [qty, setQty] = useState(1);
  const max = Math.min(product.stock, MAX_QTE);

  if (!product.in_stock) return <AddToCartButton product={product} block={false} />;

  return (
    <div className="buy-row">
      <div className="qty">
        <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Moins">−</button>
        <span>{qty}</span>
        <button type="button" onClick={() => setQty((q) => Math.min(max, q + 1))} disabled={qty >= max} aria-label="Plus">+</button>
      </div>
      <AddToCartButton product={product} quantity={qty} block={false} />
      <Button variant="light" href="/cart">Voir le panier</Button>
    </div>
  );
}
