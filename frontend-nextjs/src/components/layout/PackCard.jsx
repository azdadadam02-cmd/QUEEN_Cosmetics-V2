'use client';
import Image from 'next/image';
import Link from 'next/link';

/** Carte pack : image en haut, bandeau personnalisé (couleurs et bouton choisis par le responsable produits) */
export default function PackCard({ pack: p }) {
  return (
    <Link href={`/packs/${p.id}`} className="pack-card" style={{ background: p.background, color: p.color }}>
      <span className="pack-img">
        {p.image_url && <Image src={p.image_url} alt="" fill sizes="(max-width: 760px) 100vw, 80vw" onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
      </span>
      <span className="pack-body">
        <strong>{p.name}</strong>
        {p.description && <span className="pack-desc">{p.description}</span>}
        <span className="pack-cta">{p.button} ►</span>
      </span>
    </Link>
  );
}
