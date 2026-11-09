import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import ProductCard from '@/components/layout/ProductCard';
import ScrollTop from '@/components/layout/ScrollTop';
import ProductHero from './ProductHero';
import Reviews from './Reviews';
import { apiGet } from '@/lib/serverApi';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const p = /^\d+$/.test(id) ? await apiGet(`/products/${id}`) : null;
  return { title: p?.name || 'Produit introuvable' };
}

export default function ProductPage({ params }) {
  return (
    <>
      <ScrollTop />
      <Suspense fallback={<div className="pd-hero"><div className="skeleton" style={{ height: 520 }} /><div className="skeleton" style={{ height: 520 }} /></div>}>
        <ProductDetail params={params} />
      </Suspense>
    </>
  );
}

async function ProductDetail({ params }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const [p, reviews, suggested] = await Promise.all([apiGet(`/products/${id}`), apiGet(`/products/${id}/reviews`), apiGet(`/products/suggestions?ids=${id}&limit=7`).catch(() => [])]);
  if (!p) notFound();
  // Même sous-catégorie, les mieux notés d'abord (calculé par l'API) : 6 affichés, le 7e demandé sert seulement à savoir s'il en reste
  const found = Array.isArray(suggested) ? suggested : suggested?.data || [];
  const similar = found.slice(0, 6);
  const moreUrl = `/products?cat=${encodeURIComponent(p.category || '')}${p.sub_category ? `&sub=${encodeURIComponent(p.sub_category)}` : ''}`;

  const about = [['Marque', p.brand], ['Catégorie', p.category], ['Sous-catégorie', p.sub_category], ["Tranche d'âge", p.age_range]].filter(([, v]) => v);

  return (
    <>
      <ProductHero product={p} reviews={reviews || []} moreHref={similar.length ? '#similaires' : '#description'} />

      <section className="pd-section" id="description">
        <h2>Description</h2>
        <p>{p.details || 'Description à venir.'}</p>
      </section>

      {about.length > 0 && (
        <section className="pd-section">
          <h2>À propos</h2>
          <dl className="pd-about">
            {about.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </section>
      )}

      {similar.length > 0 && (
        <section className="pd-section" id="similaires">
          <h2>Vous aimerez aussi</h2>
          <div className="pgrid">{similar.map((s) => <ProductCard key={s.id} product={s} />)}</div>
          {found.length > 6 && p.category && <Link href={moreUrl} className="see-more">Voir plus &gt;</Link>}
        </section>
      )}

      <Reviews productId={p.id} reviews={reviews || []} />
    </>
  );
}
