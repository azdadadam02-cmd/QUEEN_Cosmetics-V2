import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import BuyBox from './BuyBox';
import { initial, money } from '@/lib/format';
import { apiGet } from '@/lib/serverApi';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const p = /^\d+$/.test(id) ? await apiGet(`/products/${id}`) : null;
  return { title: p?.name || 'Produit introuvable' };
}

/** Fiche produit dynamique : /products/1, /products/2… */
export default function ProductPage({ params }) {
  return (
    <Suspense fallback={<div className="product-page"><div className="skeleton product-media" /><div className="skeleton" style={{ height: 320 }} /></div>}>
      <ProductDetail params={params} />
    </Suspense>
  );
}

async function ProductDetail({ params }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const p = await apiGet(`/products/${id}`);
  if (!p) notFound();

  return (
    <>
      <nav className="breadcrumb" aria-label="Fil d'Ariane">
        <Link href="/">Accueil</Link> › <Link href="/products">Catalogue</Link> › <span>{p.name}</span>
      </nav>
      <div className="product-page">
        <div className="product-media">
          <span className="ph" aria-hidden="true">{initial(p.name)}</span>
          {p.image_url && <Image src={p.image_url} alt={p.name} fill sizes="(max-width: 860px) 100vw, 50vw" priority />}
          {p.promo > 0 && <span className="promo-badge">-{p.promo}%</span>}
          {!p.in_stock && <span className="soldout-badge">Out of stock</span>}
        </div>

        <div className="product-info">
          {p.category && <span className="eyebrow">{p.category}</span>}
          <h1 className="h-serif">{p.name}</h1>
          <div className="product-price">
            {money(p.price)}
            {p.promo > 0 && (
              <>
                <del>{money(p.original_price)}</del>
                <span className="promo-inline">-{p.promo}%</span>
              </>
            )}
          </div>
          <span className={`status ${!p.in_stock ? 'out' : p.low_stock ? 'low' : 'ok'}`}>
            {!p.in_stock ? 'Rupture de stock' : p.low_stock ? `Plus que ${p.stock} en stock` : 'En stock'}
          </span>
          <BuyBox product={p} />
          <ul className="perks">
            <li>Paiement à la livraison, partout au Maroc</li>
            <li>Produit authentique QUEEN Cosmetics</li>
            <li>Commande réservée aux personnes de 18 ans et plus</li>
          </ul>
        </div>
      </div>
    </>
  );
}
