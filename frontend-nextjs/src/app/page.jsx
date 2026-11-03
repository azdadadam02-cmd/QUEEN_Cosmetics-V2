import { Suspense } from 'react';
import AdsCarousel from '@/components/layout/AdsCarousel';
import ProductsBrowser from '@/components/layout/ProductsBrowser';
import Button from '@/components/ui/Button';
import { apiGet } from '@/lib/serverApi';

/** Accueil : carrousel des publicités + sélection de produits (données lues côté serveur) */
export default function HomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  const [ads, products, categories] = await Promise.all([apiGet('/advertisements'), apiGet('/products'), apiGet('/categories')]);
  return (
    <>
      <AdsCarousel ads={ads || []} />
      <ProductsBrowser products={(products || []).slice(0, 8)} categories={categories || []} title="Nos coups de cœur" />
      {products?.length > 8 && (
        <div className="more">
          <Button href="/products">Voir tout le catalogue ({products.length})</Button>
        </div>
      )}
    </>
  );
}

function HomeSkeleton() {
  return (
    <>
      <div className="skeleton sk-ads" />
      <div className="grid">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="skeleton sk-card" />
        ))}
      </div>
    </>
  );
}
