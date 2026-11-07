'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BarIcon } from '@/lib/barIcons';

const isStaffPath = (pathname) => /^\/(admin|gestion)(\/|$)/.test(pathname);

/** Lien interne (Link), externe (nouvel onglet) ou simple bloc quand l'admin n'a mis aucun lien */
function Maybe({ href, children, ...props }) {
  if (!href) return <div {...props}>{children}</div>;
  if (href.startsWith('/')) return <Link href={href} {...props}>{children}</Link>;
  return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
}

function countdown(ms) {
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const p = (n) => String(n).padStart(2, '0');
  return `${d > 0 ? `${d}j ` : ''}${p(Math.floor((s % 86400) / 3600))}h ${p(Math.floor((s % 3600) / 60))}m ${p(s % 60)}s`;
}

function PromoBar({ promo }) {
  const end = promo.ends_at ? new Date(promo.ends_at).getTime() : null;
  // null tant que le navigateur n'a pas affiché : le serveur ne rend jamais l'heure (évite un décalage d'hydratation)
  const [now, setNow] = useState(null);
  useEffect(() => {
    if (end === null) return;
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const timer = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [end]);

  if (end !== null && now !== null && now >= end) return null;   // promo terminée pendant que la page était ouverte
  return (
    <Maybe href={promo.link} className="promo-bar" style={{ background: promo.background, color: promo.color }}>
      <span className="promo-text">{promo.text}</span>
      {end !== null && now !== null && <span className="promo-delay" aria-label="Temps restant">{countdown(end - now)}</span>}
    </Maybe>
  );
}

/** Barre des avantages (grise) + barre promo, au-dessus de la navbar. Elles défilent avec la page, seule la navbar reste collée. */
export default function TopBars({ usps, promo, brand }) {
  const pathname = usePathname();
  if (isStaffPath(pathname)) return null;   // pas dans les espaces de gestion
  return (
    <>
      {usps.length > 0 && (
        <ul className="usp-bar" aria-label="Nos avantages">
          {usps.map((u) => (
            <li key={u.id}>
              <Maybe href={u.link} className="usp-item">
                <BarIcon name={u.icon} />
                <span>{u.text}</span>
              </Maybe>
            </li>
          ))}
        </ul>
      )}
      {promo && <PromoBar promo={promo} />}
      {brand && (
        <Link href="/" className="brand-bar" style={{ background: brand.background, color: brand.color }}>{brand.name}</Link>
      )}
    </>
  );
}
