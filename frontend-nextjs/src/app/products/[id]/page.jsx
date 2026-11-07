import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import ProductHero from './ProductHero';
import Reviews from './Reviews';
import { apiGet } from '@/lib/serverApi';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const p = /^\d+$/.test(id) ? await apiGet(`/products/${id}`) : null;
  return { title: p?.name || 'Produit introuvable' };
}

/** Fiche produit dynamique : /products/1, /products/2… */
export default function ProductPage({ params }) {
  return (
    <Suspense fallback={<div className="pd-hero"><div className="skeleton" style={{ height: 520 }} /><div className="skeleton" style={{ height: 520 }} /></div>}>
      <ProductDetail params={params} />
    </Suspense>
  );
}

async function ProductDetail({ params }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const [p, reviews] = await Promise.all([apiGet(`/products/${id}`), apiGet(`/products/${id}/reviews`)]);
  if (!p) notFound();

  const about = [['Marque', p.brand], ['Catégorie', p.category], ['Sous-catégorie', p.sub_category], ["Tranche d'âge", p.age_range]].filter(([, v]) => v);

  return (
    <>
      <ProductHero product={p} />

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

      <Reviews productId={p.id} reviews={reviews || []} />
    </>
  );
}
