'use client';
import { useMemo, useState } from 'react';
import ProductCard from './ProductCard';

/** Recherche + filtre par catégorie, instantanés (côté navigateur) */
export default function ProductsBrowser({ products, categories, title = 'Nos produits', eyebrow = 'Notre collection' }) {
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return products.filter((p) => (cat === 'all' || p.category === cat) && (!s || p.name.toLowerCase().includes(s)));
  }, [products, cat, q]);

  return (
    <section className="shop" id="produits">
      <div className="section-head">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="h-serif">{title}</h2>
        </div>
        <label className="search">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4-4" /></svg>
          <input type="search" placeholder="Rechercher un produit…" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
        </label>
      </div>

      {categories.length > 0 && (
        <div className="chips" role="group" aria-label="Catégories">
          {['all', ...categories].map((c) => (
            <button key={c} type="button" className={`chip${cat === c ? ' active' : ''}`} onClick={() => setCat(c)}>
              {c === 'all' ? 'Tous' : c}
            </button>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <p className="empty">Aucun produit pour le moment. Revenez très bientôt ✦</p>
      ) : list.length === 0 ? (
        <p className="empty">Aucun produit ne correspond à votre recherche.</p>
      ) : (
        <div className="grid">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
