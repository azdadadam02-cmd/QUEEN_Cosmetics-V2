'use client';
import Image from 'next/image';
import Link from 'next/link';
import { money } from '@/lib/format';

export default function PackCard({ pack: p }) {
  const saving = p.value > p.price ? p.value - p.price : 0;
  return (
    <Link href={`/packs/${p.id}`} className="pack-card" style={{ background: p.background, color: p.color }}>
      <span className="pack-img">
        {p.image_url && <Image src={p.image_url} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
      </span>
      <span className="pack-body">
        <strong>{p.name}</strong>
        {p.description && <span className="pack-desc">{p.description}</span>}
        {p.price > 0 && (
          <span className="pack-price">
            <b>{money(p.price)}</b>
            {saving > 0 && (
              <>
                <del>{money(p.value)}</del>
                <span className="pack-save">Vous économisez {money(saving)}</span>
              </>
            )}
          </span>
        )}
        <span className="pack-cta">{p.button}</span>
      </span>
    </Link>
  );
}
