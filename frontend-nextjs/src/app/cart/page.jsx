'use client';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/layout/ProductCard';
import Button from '@/components/ui/Button';
import { api, errorMessage } from '@/lib/api';
import { useHydrated } from '@/lib/useHydrated';
import { useAuthStore } from '@/store/authStore';
import { lineKey, useCartStore } from '@/store/cartStore';
import CartLine from './CartLine';
import CartSummary from './CartSummary';

/** Panier : +, −, retirer, vider. Les prix et le stock sont relus depuis Laravel à l'ouverture. */
export default function CartPage() {
  const hydrated = useHydrated();
  const { items, setQuantity, remove, clear, syncFromServer, payload } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const [checked, setChecked] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    if (!hydrated) return;
    const body = payload();
    if (!body.length) return;
    api
      .post('/cart/check', { items: body })
      .then(({ data }) => {
        syncFromServer(data.lines);
        setNotices(data.warnings);
      })
      .catch((e) => setNotices([errorMessage(e)]))
      .finally(() => setChecked(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const cartIds = [...new Set(items.flatMap((i) => (i.pack_id ? (i.products || []).map((it) => it.id) : [i.id])))].sort((a, b) => a - b).join(',');
  useEffect(() => {
    if (!hydrated || !cartIds) return;
    api.get('/products/suggestions', { params: { ids: cartIds } }).then(({ data }) => setSuggestions(data.data ?? data)).catch(() => {});
  }, [hydrated, cartIds]);

  if (!hydrated) return <p className="loading-line">Chargement du panier…</p>;

  return (
    <>
      <div className="page-head">
        <h1 className="h-serif">Mon panier</h1>
      </div>
      {notices.map((n) => <p key={n} className="error-text form-error" role="status">{n}</p>)}

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
              {items.map((i) => <CartLine key={lineKey(i)} item={i} onQuantity={(n) => setQuantity(lineKey(i), n)} onRemove={() => remove(lineKey(i))} />)}
            </div>
            <div className="clear-form">
              <button type="button" className="link-remove" onClick={() => window.confirm('Vider le panier ?') && clear()}>Vider le panier</button>
            </div>
          </div>

          <CartSummary items={items} user={user} checked={checked} />
        </div>
      )}

      {items.length > 0 && suggestions.length > 0 && (
        <section className="cart-suggest">
          <h2 className="pc-row-title">Vous aimerez aussi</h2>
          <div className="pgrid">
            {suggestions.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </>
  );
}
