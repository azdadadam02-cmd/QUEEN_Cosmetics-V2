import Link from 'next/link';

const ICONS = {
  gift: <><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13" /><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" /><path d="M7.5 8a2.5 2.5 0 0 1 0-5C9.5 3 12 8 12 8s2.5-5 4.5-5a2.5 2.5 0 0 1 0 5" /></>,
  perfume: <><rect x="6" y="11" width="12" height="10" rx="2" /><path d="M10 11V8h4v3" /><rect x="9" y="4" width="6" height="4" rx="1" /></>,
  lips: <><path d="M8 21v-8h8v8z" /><path d="M9 13v-3h6v3" /><path d="M10 10V4l4 2.5V10" /></>,
  eye: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  drop: <><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" /><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" /></>,
  nails: <><rect x="7" y="11" width="10" height="10" rx="2" /><path d="M10 11V7h4v4" /><path d="M11 7V3h2v4" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
};

// Chaque carte mène à une page qui existe déjà : les packs, ou une catégorie du catalogue (affichée seulement si elle existe)
const ITEMS = [
  { label: 'Les Packs', href: '/packs', icon: 'gift', color: '#e86a6a', packs: true },
  { label: 'Parfums', cat: 'Parfums', icon: 'perfume', color: '#6fb0ab' },
  { label: 'Lèvres', cat: 'Maquillage Levres', icon: 'lips', color: '#e8506a' },
  { label: 'Yeux', cat: 'Maquillage Yeux', icon: 'eye', color: '#5aa0c8' },
  { label: 'Soin du visage', cat: 'Soin Visage', icon: 'drop', color: '#55b98a' },
  { label: 'Ongles', cat: 'Ongles', icon: 'nails', color: '#b69a82' },
  { label: 'Solaire', cat: 'Solaire', icon: 'sun', color: '#f4a24c' },
];

/** Bandeau de raccourcis de l'accueil : « Besoin d'un coup de pouce ? » */
export default function GuidanceStrip({ categories = [], hasPacks = false }) {
  const items = ITEMS.filter((i) => (i.packs ? hasPacks : categories.includes(i.cat)));
  if (items.length < 3) return null;

  return (
    <section className="guide" aria-labelledby="guide-title">
      <div>
        <h2 id="guide-title">Besoin d’un coup de pouce ?</h2>
        <p>Découvrez ce qui est populaire en ce moment.</p>
      </div>
      <div className="guide-cards">
        {items.map((i) => (
          <Link key={i.label} href={i.href || `/products?cat=${encodeURIComponent(i.cat)}`} className="guide-card" style={{ '--ic': i.color }}>
            <span>{i.label}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">{ICONS[i.icon]}</svg>
          </Link>
        ))}
      </div>
    </section>
  );
}
