'use client';
import { useRef, useState } from 'react';
import FormError from '@/components/ui/FormError';
import Stars from '@/components/ui/Stars';
import { money } from '@/lib/format';
import { useEntrance } from '@/lib/useReveal';
import { MAX_QTE, useCartStore } from '@/store/cartStore';
import ProductGallery from './ProductGallery';
import VariantPicker from './VariantPicker';
import { useFavorite } from './useFavorite';

const unique = (values) => [...new Set(values.filter(Boolean))];

export default function ProductHero({ product: p, moreHref = '#description' }) {
  const heroRef = useRef(null);
  useEntrance(heroRef, '.pd-gallery, .pd-info, .pd-stats, .pd-actions');
  const add = useCartStore((s) => s.add);
  const [notice, setNotice] = useState(null);
  const { fav, loves, toggle } = useFavorite(p.id, p.loves, (message) => setNotice({ ok: false, message }));

  const images = unique([p.image_url, ...(p.gallery || []).map((g) => g.url)]);
  const variants = p.variants || [];
  const [selected, setSelected] = useState(() => variants.find((v) => v.stock > 0) || variants[0] || null);

  const stock = selected ? selected.stock : p.stock;
  const maxQty = Math.min(stock, MAX_QTE);
  const [qtyWanted, setQty] = useState(1);
  const qty = Math.min(qtyWanted, Math.max(maxQty, 1));

  return (
    <div className="pd-hero" ref={heroRef}>
      <ProductGallery images={images} name={p.name} brand={p.brand} promo={p.promo} />

      <div className="pd-info">
        <h1 className="pd-name">{p.name}</h1>
        <VariantPicker variants={variants} selected={selected} onSelect={setSelected} productName={p.name} />

        <div className="pd-buy-info">
          <div className="pd-price">
            {p.promo > 0 && <del>{money(p.original_price)}</del>}
            <strong>{money(p.price)}</strong>
          </div>
          <div className="pd-cod">
            Paiement à la livraison
            <svg viewBox="0 0 32 24" aria-hidden="true"><path d="M2 5h17v13H2zM19 9h6l5 5v4H19z" /><circle cx="8" cy="19" r="2.6" /><circle cx="24" cy="19" r="2.6" /></svg>
          </div>
        </div>
        {stock <= 0 && <span className="status out">Rupture de stock</span>}
        {stock > 0 && stock <= 5 && <span className="status low">Plus que {stock} en stock</span>}
      </div>

      <div className="pd-stats">
        <Stars value={p.rating} count={p.rating_count} />
        <span>{p.buyers || 0} {p.buyers > 1 ? 'personnes l’ont acheté' : 'personne l’a acheté'}</span>
        <span><span className="pd-heart" aria-hidden="true">♥</span> {loves} {loves > 1 ? 'favoris' : 'favori'}</span>
      </div>

      <div className="pd-actions">
        <div className="pd-add">
          <select value={qty} onChange={(e) => setQty(Number(e.target.value))} disabled={stock <= 0} aria-label="Quantité">
            {Array.from({ length: Math.max(maxQty, 1) }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
          </select>
          <button type="button" onClick={() => setNotice(add(p, qty, selected))} disabled={stock <= 0}>{stock > 0 ? 'Ajouter' : 'Indisponible'}</button>
        </div>
        <button type="button" className={`pd-fav${fav ? ' on' : ''}`} onClick={toggle} aria-pressed={fav}>
          <span aria-hidden="true">{fav ? '♥' : '♡'}</span> Favoris
        </button>
        <a href={moreHref} className="pd-more">voir plus &gt;</a>
        <FormError message={notice?.ok ? '' : notice?.message} success={notice?.ok ? notice.message : ''} />
      </div>
    </div>
  );
}
