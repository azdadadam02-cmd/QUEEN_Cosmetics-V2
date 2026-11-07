'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { Fragment, useEffect, useRef, useState } from 'react';
import Pager from '@/components/ui/Pager';
import { useScrollReveal } from '@/lib/useReveal';
import PackCard from './PackCard';
import ProductCard from './ProductCard';

const ROW = 6;        // produits par rangée
const PER_PAGE = 12;  // produits par page (2 lignes)
const ROWS_PER_PAGE = 4;
const PACK_EVERY = 2;      // une bande de packs toutes les 2 rangées
const PACKS_PER_BAND = 3;
const NONE = 'Autres';

function groupBy(items, keyOf) {
  const groups = new Map();
  items.forEach((p) => {
    const key = keyOf(p) || NONE;
    groups.set(key, [...(groups.get(key) || []), p]);
  });
  return [...groups].sort(([a], [b]) => a.localeCompare(b, 'fr'));   // même ordre que la barre de catégories
}

/**
 * Barre de catégories + produits. L'état vit dans l'URL : retour navigateur et rechargement gardent la page.
 * Tous → une rangée par catégorie ; ?cat → une rangée par sous-catégorie ; VOIR PLUS ou recherche → 12 par page.
 * shortcut: tout le catalogue est envoyé au navigateur, passer à une pagination Laravel au-delà de ~1000 produits.
 */
export default function ProductsBrowser({ products, categories, packs = [] }) {
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

  const search = q.toLowerCase();
  const list = products.filter((p) => (!cat || (p.category || NONE) === cat)
    && (!sub || (p.sub_category || NONE) === sub)
    && (!search || p.name.toLowerCase().includes(search)));

  const groups = sub || showAll || q ? [] : groupBy(list, (p) => (cat ? p.sub_category : p.category));
  const rows = groups.length > 1 ? groups : null;   // catégorie sans sous-catégories : directement la liste paginée

  const pageSize = rows ? ROWS_PER_PAGE : PER_PAGE;
  const pages = Math.max(1, Math.ceil((rows || list).length / pageSize));
  const page = Math.min(pages, Math.max(1, Number(params.get('page')) || 1));
  const goPage = (n) => go({ cat, sub, all: showAll ? '1' : null, page: n > 1 ? String(n) : null });

  // Catégorie choisie toujours visible dans la barre, même arrivé par un lien
  useEffect(() => {
    activeRef.current?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, [cat]);

  // Sans barre de défilement, la souris a besoin de flèches pour voir les catégories cachées
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

      {q && <p className="search-note">Résultats pour « {q} » : {list.length}</p>}

      {products.length === 0 ? (
        <p className="empty">Aucun produit pour le moment. Revenez très bientôt ✦</p>
      ) : list.length === 0 ? (
        <p className="empty">Aucun produit ne correspond à votre recherche.</p>
      ) : rows ? (
        rows.slice((page - 1) * pageSize, page * pageSize).map(([name, items], i) => {
          const rowNumber = (page - 1) * pageSize + i + 1;
          // Après chaque 2 rangées (vue Tous) : les 3 packs suivants, jusqu'à épuisement
          const band = !cat && rowNumber % PACK_EVERY === 0
            ? packs.slice((rowNumber / PACK_EVERY - 1) * PACKS_PER_BAND, (rowNumber / PACK_EVERY) * PACKS_PER_BAND)
            : [];
          return (
          <Fragment key={name}>
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
          {band.length > 0 && (
            <div className="pack-band">
              {band.map((pack) => <PackCard key={pack.id} pack={pack} />)}
            </div>
          )}
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
