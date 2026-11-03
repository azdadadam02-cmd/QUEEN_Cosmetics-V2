'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Thumb from '@/components/ui/Thumb';
import { api, errorMessage } from '@/lib/api';
import { money } from '@/lib/format';
import { useHydrated } from '@/lib/useHydrated';
import { useAuthStore } from '@/store/authStore';
import { MAX_QTE, useCartStore } from '@/store/cartStore';
import { toast } from '@/store/toastStore';

/** Panier : +, −, retirer, vider. Les prix et le stock sont relus depuis Laravel à l'ouverture. */
export default function CartPage() {
  const hydrated = useHydrated();
  const { items, setQuantity, remove, clear, syncFromServer, payload } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const [checked, setChecked] = useState(false);

  // Vérifie le panier auprès de l'API (prix réduits, stock, produits supprimés)
  useEffect(() => {
    if (!hydrated) return;
    const body = payload();
    if (!body.length) return;
    api
      .post('/cart/check', { items: body })
      .then(({ data }) => {
        syncFromServer(data.lines);
        data.warnings.forEach((w) => toast.info(w));
      })
      .catch((e) => toast.error(errorMessage(e)))
      .finally(() => setChecked(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  if (!hydrated) return <p className="loading-line">Chargement du panier…</p>;

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const checkoutHref = user ? '/checkout' : '/login?next=/checkout';

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Votre sélection</span>
        <h1 className="h-serif">Mon panier</h1>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <span className="empty-ico">✦</span>
          <h3>Votre panier est vide</h3>
          <p>Découvrez nos parfums, soins et maquillage.</p>
          <Button href="/products">Découvrir la collection</Button>
        </div>
      ) : (
        <div className="cart-layout">
          <div>
            <div className="cart-list">
              {items.map((i) => (
                <div className="cart-item" key={i.id}>
                  <Link href={`/products/${i.id}`}><Thumb src={i.image_url} name={i.name} /></Link>
                  <div className="ci-info">
                    <h3>{i.name}</h3>
                    <small>{money(i.price)} · {i.stock} en stock</small>
                  </div>
                  <div className="qty-form">
                    <div className="qty">
                      <button type="button" aria-label="Moins" onClick={() => setQuantity(i.id, i.quantity - 1)}>−</button>
                      <span>{i.quantity}</span>
                      <button
                        type="button"
                        aria-label="Plus"
                        disabled={i.quantity >= Math.min(i.stock, MAX_QTE)}
                        onClick={() => setQuantity(i.id, i.quantity + 1)}
                      >+</button>
                    </div>
                    <button type="button" className="link-remove" onClick={() => remove(i.id)}>Retirer</button>
                  </div>
                  <span className="ci-total">{money(i.price * i.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="clear-form">
              <button type="button" className="link-remove" onClick={() => window.confirm('Vider le panier ?') && clear()}>Vider le panier</button>
            </div>
          </div>

          <aside className="summary">
            <h3 className="h-serif">Récapitulatif</h3>
            <dl>
              <div><dt>Articles</dt><dd>{count}</dd></div>
              <div><dt>Livraison</dt><dd>Offerte</dd></div>
              <div><dt>Paiement</dt><dd>À la livraison</dd></div>
            </dl>
            <div className="total"><span>Total</span><strong>{money(total)}</strong></div>
            {user && user.role !== 'client' ? (
              <p className="sum-link">Connecté en tant que personnel : la commande est réservée aux comptes clients.</p>
            ) : (
              <Button href={checkoutHref} block aria-disabled={!checked}>Confirmer la commande</Button>
            )}
            <Link href="/products" className="sum-link">← Continuer mes achats</Link>
          </aside>
        </div>
      )}
    </>
  );
}
