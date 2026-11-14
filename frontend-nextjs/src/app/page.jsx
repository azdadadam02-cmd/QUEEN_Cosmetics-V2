import { Suspense } from 'react';
import AdsCarousel from '@/components/layout/AdsCarousel';
import ProductsBrowser from '@/components/layout/ProductsBrowser';
import { apiGet } from '@/lib/serverApi';

export default function HomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  const [ads, products, categories, packs] = await Promise.all([apiGet('/advertisements'), apiGet('/products'), apiGet('/categories'), apiGet('/packs').catch(() => [])]);
  return (
    <>
      <AdsCarousel ads={ads || []} />
      <ProductsBrowser products={products || []} categories={categories || []} packs={packs || []} guidance />
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
