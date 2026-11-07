'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRef } from 'react';
import PackCard from '@/components/layout/PackCard';
import Pager from '@/components/ui/Pager';
import { useScrollReveal } from '@/lib/useReveal';

const PER_PAGE = 6;

export default function PacksBrowser({ packs }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const pages = Math.max(1, Math.ceil(packs.length / PER_PAGE));
  const page = Math.min(pages, Math.max(1, Number(params.get('page')) || 1));
  const gridRef = useRef(null);
  useScrollReveal(gridRef, '.pack-card', [page]);

  function goPage(n) {
    window.history.pushState(null, '', n > 1 ? `${pathname}?page=${n}` : pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (packs.length === 0) return <p className="empty">Aucun pack pour le moment. Revenez très bientôt ✦</p>;

  return (
    <>
      <div className="pack-grid" ref={gridRef}>
        {packs.slice((page - 1) * PER_PAGE, page * PER_PAGE).map((p) => <PackCard key={p.id} pack={p} />)}
      </div>
      <Pager page={page} pages={pages} onChange={goPage} />
    </>
  );
}
