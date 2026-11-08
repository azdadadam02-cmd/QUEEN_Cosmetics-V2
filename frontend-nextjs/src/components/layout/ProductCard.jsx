'use client';
import Image from 'next/image';
import Link from 'next/link';
import Stars from '@/components/ui/Stars';
import { initial, money } from '@/lib/format';

export default function ProductCard({ product: p }) {
  const out = !p.in_stock;
  return (
    <article className={`pc${out ? ' soldout' : ''}`}>
      <Link href={`/products/${p.id}`} className="pc-link" aria-label={p.name}>
        {p.promo > 0 && <span className="pc-promo">promo</span>}
        <span className="pc-img">
          <span className="ph" aria-hidden="true">{initial(p.name)}</span>
          {p.image_url && <Image src={p.image_url} alt="" fill sizes="(max-width: 760px) 50vw, 240px" onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
        </span>
        {p.brand && <span className="pc-brand">{p.brand}</span>}
        <h3 className="pc-name">{p.name}</h3>
        <Stars value={p.rating} count={p.rating_count} />
        <span className="pc-price">
          {p.promo > 0 && <del>{money(p.original_price)}</del>} {money(p.price)}
        </span>
      </Link>
      {out && <span className="pc-out">Rupture de stock</span>}
    </article>
  );
}
