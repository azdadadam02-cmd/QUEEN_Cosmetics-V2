'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Stars from '@/components/ui/Stars';
import VariantTag from '@/components/ui/VariantTag';
import { api, errorMessage } from '@/lib/api';
import { initial, money } from '@/lib/format';
import { useHydrated } from '@/lib/useHydrated';
import { useEntrance } from '@/lib/useReveal';
import { useAuthStore } from '@/store/authStore';
import { MAX_QTE, useCartStore } from '@/store/cartStore';
import { toast } from '@/store/toastStore';

const unique = (values) => [...new Set(values.filter(Boolean))];

/** Haut de la fiche produit : galerie, couleurs, tailles, prix, quantité, panier, favoris */
export default function ProductHero({ product: p, moreHref = '#description' }) {
  const router = useRouter();
  const heroRef = useRef(null);
  useEntrance(heroRef, '.pd-gallery, .pd-info, .pd-stats, .pd-actions');
  const hydrated = useHydrated();
  const user = useAuthStore((s) => s.user);
  const add = useCartStore((s) => s.add);

  const images = unique([p.image_url, ...(p.gallery || []).map((g) => g.url)]);
  const [imgIndex, setImgIndex] = useState(0);
  const moveImg = (step) => setImgIndex((i) => (i + step + images.length) % images.length);

  const variants = p.variants || [];
  const colors = unique(variants.map((v) => v.color));
  const sizes = unique(variants.map((v) => v.size));
  const [selected, setSelected] = useState(() => variants.find((v) => v.stock > 0) || variants[0] || null);

  // Garde l'autre choix si la combinaison existe, sinon prend la première variante de cette option
  const pick = (key, value) => {
    const same = variants.filter((v) => v[key] === value);
    const other = key === 'color' ? 'size' : 'color';
    setSelected(same.find((v) => v[other] === selected?.[other] && v.stock > 0) || same.find((v) => v.stock > 0) || same[0]);
  };

  const stock = selected ? selected.stock : p.stock;
  const maxQty = Math.min(stock, MAX_QTE);
  const [qtyWanted, setQty] = useState(1);
  const qty = Math.min(qtyWanted, Math.max(maxQty, 1));

  const [fav, setFav] = useState(false);
  const [loves, setLoves] = useState(p.loves || 0);
  const isClient = hydrated && user?.role === 'client';

  useEffect(() => {
    if (!isClient) return;
    api.get('/favorites').then(({ data }) => setFav(data.includes(p.id))).catch(() => {});
  }, [isClient, p.id]);

  async function toggleFav() {
    if (!user) return window.open(`/login?next=/products/${p.id}`, '_blank', 'noopener');   // la connexion s'ouvre dans un nouvel onglet, la fiche reste ouverte
    try {
      const { data } = await api.post(`/products/${p.id}/favorite`);
      setFav(data.favorite);
      setLoves(data.loves);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }

  function addToCart() {
    const { ok, message } = add(p, qty, selected);
    (ok ? toast.success : toast.error)(message);
  }

  return (
    <div className="pd-hero" ref={heroRef}>
      <div className="pd-gallery">
        {images.length > 1 && (
          <div className="pd-thumbs">
            {images.map((src, i) => (
              <button key={src} type="button" className={i === imgIndex ? 'on' : ''} onClick={() => setImgIndex(i)} aria-label={`Image ${i + 1}`}>
                <Image src={src} alt="" fill sizes="110px" />
              </button>
            ))}
          </div>
        )}
        <div className="pd-main">
          {p.brand && <span className="pd-brand">{p.brand}</span>}
          <div className="pd-image">
            <span className="ph" aria-hidden="true">{initial(p.name)}</span>
            {images[imgIndex] && <Image src={images[imgIndex]} alt={p.name} fill sizes="(max-width: 860px) 100vw, 40vw" priority onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
            {p.promo > 0 && <span className="pc-promo">-{p.promo}%</span>}
            {images.length > 1 && (
              <>
                <button type="button" className="pd-arrow prev" onClick={() => moveImg(-1)} aria-label="Image précédente">&lt;</button>
                <button type="button" className="pd-arrow next" onClick={() => moveImg(1)} aria-label="Image suivante">&gt;</button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="pd-info">
        <h1 className="pd-name">{p.name}</h1>

        {colors.length > 0 && (
          <div className="pd-option">
            <span className="pd-label">Couleurs :</span>
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                className={`pd-swatch${selected?.color === c ? ' on' : ''}${variants.some((v) => v.color === c && v.stock > 0) ? '' : ' soldout'}`}
                style={{ background: c }}
                onClick={() => pick('color', c)}
                aria-label={`Couleur ${c}`}
                aria-pressed={selected?.color === c}
              />
            ))}
          </div>
        )}

        {sizes.length > 0 && (
          <div className="pd-option">
            <span className="pd-label">Taille :</span>
            {sizes.map((s) => {
              // La taille n'est disponible que dans la couleur choisie, s'il y en a une
              const inColor = variants.filter((v) => v.size === s && (!selected?.color || v.color === selected.color));
              return (
                <button
                  key={s}
                  type="button"
                  className={`pd-size${selected?.size === s ? ' on' : ''}${inColor.some((v) => v.stock > 0) ? '' : ' soldout'}`}
                  onClick={() => pick('size', s)}
                  aria-pressed={selected?.size === s}
                >{s}</button>
              );
            })}
          </div>
        )}

        {selected && (
          <p className="pd-chosen"><strong>{p.name}</strong> <VariantTag color={selected.color} size={selected.size} /></p>
        )}

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
          <button type="button" onClick={addToCart} disabled={stock <= 0}>{stock > 0 ? 'Ajouter' : 'Indisponible'}</button>
        </div>
        <button type="button" className={`pd-fav${fav ? ' on' : ''}`} onClick={toggleFav} aria-pressed={fav}>
          <span aria-hidden="true">{fav ? '♥' : '♡'}</span> Favoris
        </button>
        <a href={moreHref} className="pd-more">voir plus &gt;</a>
      </div>
    </div>
  );
}
