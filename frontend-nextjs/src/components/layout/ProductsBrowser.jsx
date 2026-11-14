'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { Fragment, useEffect, useRef } from 'react';
import Pager from '@/components/ui/Pager';
import { layoutCatalog, ROW, searchCatalog } from '@/lib/catalog';
import { useScrollReveal } from '@/lib/useReveal';
import CategoryBar from './CategoryBar';
import GuidanceStrip from './GuidanceStrip';
import PackCard from './PackCard';
import PacksSection from './PacksSection';
import ProductCard from './ProductCard';

const plural = (n, word) => `${n} ${word}${n > 1 ? 's' : ''}`;

/**
 * Barre de catégories + produits. L'état vit dans l'URL : retour navigateur et rechargement gardent la page.
 * Le découpage (rangées, pages) est dans lib/catalog.js.
 * shortcut: tout le catalogue est envoyé au navigateur, passer à une pagination Laravel au-delà de ~1000 produits.
 */
export default function ProductsBrowser({ products, categories, packs = [], searchPacks = packs, guidance = false }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const q = (params.get('q') || '').trim();
  const cat = params.get('cat');
  const sub = params.get('sub');
  const showAll = params.has('all');
  const sectionRef = useRef(null);

  function go(next, scroll = true) {
    const query = new URLSearchParams();
    if (q) query.set('q', q);
    Object.entries(next).forEach(([k, v]) => v && query.set(k, v));
    const qs = query.toString();
    window.history.pushState(null, '', qs ? `${pathname}?${qs}` : pathname);
    if (scroll) sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  const { list, foundPacks } = searchCatalog(products, searchPacks, { q, cat, sub });
  const { rows, pages, page, pageRows, pageItems } = layoutCatalog(list, { cat, sub, showAll, q, page: params.get('page') });
  const goPage = (n) => go({ cat, sub, all: showAll ? '1' : null, page: n > 1 ? String(n) : null });

  useScrollReveal(sectionRef, '.pc, .pack-card', [cat, sub, showAll, page, q]);

  // Une recherche amène directement les résultats à l'écran
  useEffect(() => {
    if (q) sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [q]);

  return (
    <section className="shop" id="produits" ref={sectionRef}>
      {categories.length > 0 && <CategoryBar categories={categories} active={cat} onSelect={(c) => go({ cat: c })} />}

      {q && <p className="search-note">Résultats pour « {q} » : {plural(list.length, 'produit')}{foundPacks.length > 0 && ` et ${plural(foundPacks.length, 'pack')}`}</p>}

      {foundPacks.length > 0 && (
        <div className="pack-grid search-packs">{foundPacks.map((k) => <PackCard key={k.id} pack={k} />)}</div>
      )}

      {products.length === 0 ? (
        <p className="empty">Aucun produit pour le moment. Revenez très bientôt ✦</p>
      ) : list.length === 0 ? (
        foundPacks.length === 0 && <p className="empty">Aucun produit ni pack ne correspond à votre recherche.</p>
      ) : rows ? (
        pageRows.map(([name, items], i) => (
          <Fragment key={name}>
            {/* Accueil, page 1, vue « Tous » : le bandeau de raccourcis juste avant la dernière rangée, les packs après la 2e */}
            {guidance && page === 1 && !cat && pageRows.length > 1 && i === pageRows.length - 1 && <GuidanceStrip categories={categories} hasPacks={packs.length > 0} />}
            <div className="pc-row">
              <h2 className="pc-row-title">{name}</h2>
              <div className="pgrid">
                {items.slice(0, ROW).map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
              {items.length > ROW && (
                <button type="button" className="see-more" onClick={() => go(cat ? { cat, sub: name } : { cat: name, all: '1' })}>
                  Voir plus &gt;
                </button>
              )}
            </div>
            {page === 1 && !cat && packs.length > 0 && i === Math.min(1, pageRows.length - 1) && <PacksSection packs={packs} />}
          </Fragment>
        ))
      ) : (
        <>
          {(cat || sub) && (
            <div className="list-head">
              {(sub || showAll) && <button type="button" onClick={() => go(sub ? { cat } : {})}>&lt; Retour</button>}
              <h2 className="pc-row-title">{[cat, sub].filter(Boolean).join(' › ')}</h2>
              <small>{plural(list.length, 'produit')}</small>
            </div>
          )}
          <div className="pgrid">
            {pageItems.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </>
      )}

      {list.length > 0 && <Pager page={page} pages={pages} onChange={goPage} />}
    </section>
  );
}
