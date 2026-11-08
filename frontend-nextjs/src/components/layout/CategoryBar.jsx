'use client';
import { useEffect, useRef, useState } from 'react';

/** Barre des catégories qui défile ; des flèches apparaissent seulement quand elle déborde (sans barre de défilement, la souris en a besoin) */
export default function CategoryBar({ categories, active, onSelect }) {
  const barRef = useRef(null);
  const activeRef = useRef(null);
  const [overflows, setOverflows] = useState(false);

  // Catégorie choisie toujours visible dans la barre, même arrivé par un lien
  useEffect(() => {
    activeRef.current?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, [active]);

  useEffect(() => {
    const measure = () => setOverflows(!!barRef.current && barRef.current.scrollWidth > barRef.current.clientWidth + 1);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [categories.length]);

  const slide = (dir) => barRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });

  return (
    <div className="catbar-wrap">
      {overflows && <button type="button" className="catbar-arrow" onClick={() => slide(-1)} aria-label="Catégories précédentes">‹</button>}
      <nav className="catbar" aria-label="Catégories" ref={barRef}>
        {[null, ...categories].map((c) => (
          <button key={c ?? 'all'} ref={active === c ? activeRef : null} type="button" className={active === c ? 'active' : ''} aria-current={active === c ? 'true' : undefined} onClick={() => onSelect(c)}>
            {c ?? 'Tous'}
          </button>
        ))}
      </nav>
      {overflows && <button type="button" className="catbar-arrow" onClick={() => slide(1)} aria-label="Catégories suivantes">›</button>}
    </div>
  );
}
