import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import ScrollTop from '@/components/layout/ScrollTop';
import Thumb from '@/components/ui/Thumb';
import { money } from '@/lib/format';
import { apiGet } from '@/lib/serverApi';
import PackBuy from './PackBuy';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const p = /^\d+$/.test(id) ? await apiGet(`/packs/${id}`) : null;
  return { title: p?.name || 'Pack introuvable' };
}

/** Fiche d'un pack : image, produits inclus, prix unique, ajout au panier */
export default function PackPage({ params }) {
  return (
    <>
      <ScrollTop />
      <Suspense fallback={<div className="pd-hero"><div className="skeleton" style={{ height: 420 }} /><div className="skeleton" style={{ height: 420 }} /></div>}>
        <PackDetail params={params} />
      </Suspense>
    </>
  );
}

async function PackDetail({ params }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const p = await apiGet(`/packs/${id}`);
  if (!p) notFound();

  return (
    <>
      <div className="pd-hero">
        <div className="pd-gallery">
          <div className="pd-main">
            <div className="pd-image" style={{ background: p.background }}>
              {p.image_url && <Image src={p.image_url} alt={p.name} fill sizes="(max-width: 860px) 100vw, 40vw" priority />}
            </div>
          </div>
        </div>
        <div className="pd-info">
          <h1 className="pd-name">{p.name}</h1>
          {p.description && <p>{p.description}</p>}
          <div className="pd-buy-info">
            <div className="pd-price">
              {p.value > p.price && <del>{money(p.value)}</del>}
              <strong>{money(p.price)}</strong>
            </div>
            <div className="pd-cod">
              Paiement à la livraison
              <svg viewBox="0 0 32 24" aria-hidden="true"><path d="M2 5h17v13H2zM19 9h6l5 5v4H19z" /><circle cx="8" cy="19" r="2.6" /><circle cx="24" cy="19" r="2.6" /></svg>
            </div>
          </div>
          <PackBuy pack={p} />
        </div>
      </div>

      <section className="pd-section">
        <h2>Produits du pack</h2>
        <ul className="pack-items">
          {p.products.map((it) => (
            <li key={it.id}>
              <Link href={`/products/${it.id}`}>
                <Thumb src={it.image_url} name={it.name} size="sm" />
                <span>{it.name}{it.quantity > 1 && ` × ${it.quantity}`}</span>
                <small>{money(it.price)}</small>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
