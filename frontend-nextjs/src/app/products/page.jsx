import { Suspense } from 'react';
import ProductsBrowser from '@/components/layout/ProductsBrowser';
import { apiGet } from '@/lib/serverApi';

export const metadata = { title: 'Catalogue' };

export default function ProductsPage() {
  return (
    <>
      <h1 className="sr-only">Catalogue</h1>
      <Suspense fallback={<div className="pgrid">{Array.from({ length: 6 }, (_, i) => <div key={i} className="skeleton sk-card" />)}</div>}>
        <Catalogue />
      </Suspense>
    </>
  );
}

async function Catalogue() {
  const [products, categories, packs] = await Promise.all([apiGet('/products'), apiGet('/categories'), apiGet('/packs').catch(() => [])]);
  return <ProductsBrowser products={products || []} categories={categories || []} searchPacks={packs || []} />;
}
