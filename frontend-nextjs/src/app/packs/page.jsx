import { Suspense } from 'react';
import { apiGet } from '@/lib/serverApi';
import PacksBrowser from './PacksBrowser';

export const metadata = { title: 'Les Packs' };

export default function PacksPage() {
  return (
    <>
      <h1 className="pf-page-title">Les Packs</h1>
      <Suspense fallback={<div className="pack-grid">{Array.from({ length: 6 }, (_, i) => <div key={i} className="skeleton" style={{ height: 300 }} />)}</div>}>
        <Packs />
      </Suspense>
    </>
  );
}

async function Packs() {
  const packs = await apiGet('/packs');
  return <PacksBrowser packs={packs || []} />;
}
