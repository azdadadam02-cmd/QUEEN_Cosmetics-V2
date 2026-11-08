'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { Fragment, useEffect, useRef, useState } from 'react';
import Pager from '@/components/ui/Pager';
import { norm } from '@/lib/format';
import { useScrollReveal } from '@/lib/useReveal';
import GuidanceStrip from './GuidanceStrip';
import PackCard from './PackCard';
import PacksSection from './PacksSection';
import ProductCard from './ProductCard';

const ROW = 6;
const PER_PAGE = 12;
const ROWS_PER_PAGE = 4;
const NONE = 'Autres';

function groupBy(items, keyOf) {
  const groups = new Map();
  items.forEach((p) => {
    const key = keyOf(p) || NONE;
    groups.set(key, [...(groups.get(key) || []), p]);
  });
  return [...groups].sort(([a], [b]) => a.localeCompare(b, 'fr'));
}

/**
 * Barre de catégories + produits. L'état vit dans l'URL : retour navigateur et rechargement gardent la page.
 * Tous → une rangée par catégorie ; ?cat → une rangée par sous-catégorie ; VOIR PLUS ou recherche → 12 par page.
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
  const activeRef = useRef(null);

  function go(next, scroll = true) {
    const query = new URLSearchParams();
    if (q) query.set('q', q);
    Object.entries(next).forEach(([k, v]) => v && query.set(k, v));
    const qs = query.toString();
    window.history.pushState(null, '', qs ? `${pathname}?${qs}` : pathname);
    if (scroll) sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  // Recherche : chaque mot doit se trouver dans le nom, la marque, la catégorie ou la sous-catégorie (sans accents ni majuscules)
  const terms = norm(q).split(/\s+/).filter(Boolean);
  const matches = (...fields) => {
    const hay = norm(fields.join(' '));
    return terms.every((t) => hay.includes(t));
  };
  const list = products.filter((p) => (!cat || (p.category || NONE) === cat)
    && (!sub || (p.sub_category || NONE) === sub)
    && (!terms.length || matches(p.name, p.brand, p.category, p.sub_category)));
  // Un pack ressort par son nom ou par n'importe quel produit qu'il contient
  const foundPacks = terms.length && !cat && !sub
    ? searchPacks.filter((k) => matches(k.name, k.description, ...(k.products || []).flatMap((x) => [x.name, x.brand, x.category, x.sub_category])))
    : [];

  const groups = sub || showAll || q ? [] : groupBy(list, (p) => (cat ? p.sub_category : p.category));
  const rows = groups.length > 1 ? groups : null;

  const pageSize = rows ? ROWS_PER_PAGE : PER_PAGE;
  const pages = Math.max(1, Math.ceil((rows || list).length / pageSize));
  const page = Math.min(pages, Math.max(1, Number(params.get('page')) || 1));
  const pageRows = rows ? rows.slice((page - 1) * pageSize, page * pageSize) : [];
  const goPage = (n) => go({ cat, sub, all: showAll ? '1' : null, page: n > 1 ? String(n) : null });

  useEffect(() => {
    activeRef.current?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, [cat]);

  const barRef = useRef(null);
  const [barOverflows, setBarOverflows] = useState(false);
  useEffect(() => {
    const measure = () => setBarOverflows(!!barRef.current && barRef.current.scrollWidth > barRef.current.clientWidth + 1);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [categories.length]);
  const slideBar = (dir) => barRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });

  useScrollReveal(sectionRef, '.pc, .pack-card', [cat, sub, showAll, page, q]);

  useEffect(() => {
    if (q) sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [q]);

  const back = sub ? { cat } : {};

  return (
    <section className="shop" id="produits" ref={sectionRef}>
      {categories.length > 0 && (
        <div className="catbar-wrap">
          {barOverflows && <button type="button" className="catbar-arrow" onClick={() => slideBar(-1)} aria-label="Catégories précédentes">‹</button>}
          <nav className="catbar" aria-label="Catégories" ref={barRef}>
          {[null, ...categories].map((c) => (
            <button key={c ?? 'all'} ref={cat === c ? activeRef : null} type="button" className={cat === c ? 'active' : ''} aria-current={cat === c ? 'true' : undefined} onClick={() => go({ cat: c })}>
              {c ?? 'Tous'}
            </button>
          ))}
          </nav>
          {barOverflows && <button type="button" className="catbar-arrow" onClick={() => slideBar(1)} aria-label="Catégories suivantes">›</button>}
        </div>
      )}

      {q && <p className="search-note">Résultats pour « {q} » : {list.length} produit{list.length > 1 ? 's' : ''}{foundPacks.length > 0 && ` et ${foundPacks.length} pack${foundPacks.length > 1 ? 's' : ''}`}</p>}

      {foundPacks.length > 0 && (
        <div className="pack-grid search-packs">{foundPacks.map((k) => <PackCard key={k.id} pack={k} />)}</div>
      )}

      {products.length === 0 ? (
        <p className="empty">Aucun produit pour le moment. Revenez très bientôt ✦</p>
      ) : list.length === 0 ? (
        foundPacks.length === 0 && <p className="empty">Aucun produit ni pack ne correspond à votre recherche.</p>
      ) : rows ? (
        pageRows.map(([name, items], i) => {
          const showPacks = page === 1 && !cat && packs.length > 0 && i === Math.min(1, pageRows.length - 1);
          return (
          <Fragment key={name}>
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
          {showPacks && <PacksSection packs={packs} />}
          </Fragment>
          );
        })
      ) : (
        <>
          {(cat || sub) && (
            <div className="list-head">
              {(sub || showAll) && <button type="button" onClick={() => go(back)}>&lt; Retour</button>}
              <h2 className="pc-row-title">{[cat, sub].filter(Boolean).join(' › ')}</h2>
              <small>{list.length} produit{list.length > 1 ? 's' : ''}</small>
            </div>
          )}
          <div className="pgrid">
            {list.slice((page - 1) * pageSize, page * pageSize).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </>
      )}

      {list.length > 0 && <Pager page={page} pages={pages} onChange={goPage} />}
    </section>
  );
}
