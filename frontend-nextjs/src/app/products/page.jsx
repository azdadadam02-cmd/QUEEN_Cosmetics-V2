import { Suspense } from 'react';
import ProductsBrowser from '@/components/layout/ProductsBrowser';
import { apiGet } from '@/lib/serverApi';

export const metadata = { title: 'Catalogue' };

/** Catalogue complet (/products) */
export default function ProductsPage() {
  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Parfums · Soins · Maquillage</span>
        <h1 className="h-serif">Catalogue</h1>
      </div>
      <Suspense fallback={<div className="grid">{Array.from({ length: 8 }, (_, i) => <div key={i} className="skeleton sk-card" />)}</div>}>
        <Catalogue />
      </Suspense>
    </>
  );
}

async function Catalogue() {
  const [products, categories] = await Promise.all([apiGet('/products'), apiGet('/categories')]);
  return <ProductsBrowser products={products || []} categories={categories || []} title="Tous les produits" eyebrow={`${products?.length || 0} produits`} />;
}
