import Image from 'next/image';
import Link from 'next/link';
import { initial, money } from '@/lib/format';
import AddToCartButton from './AddToCartButton';

/** Carte produit (grille de l'accueil et du catalogue) */
export default function ProductCard({ product: p }) {
  const out = !p.in_stock;
  const statusClass = out ? 'out' : p.low_stock ? 'low' : 'ok';
  const statusText = out ? 'Out of stock' : p.low_stock ? `Plus que ${p.stock} en stock` : 'Disponible';

  return (
    <article className={`card${out ? ' soldout' : ''}`}>
      <Link href={`/products/${p.id}`} className="card-media" aria-label={p.name}>
        <span className="ph" aria-hidden="true">{initial(p.name)}</span>
        {p.image_url && <Image src={p.image_url} alt={p.name} fill sizes="(max-width: 760px) 100vw, 300px" />}
        {p.category && <span className="tag">{p.category}</span>}
        {p.promo > 0 && <span className="promo-badge">-{p.promo}%</span>}
        {out && <span className="soldout-badge">Out of stock</span>}
      </Link>
      <div className="card-body">
        <h3><Link href={`/products/${p.id}`}>{p.name}</Link></h3>
        <div className="card-row">
          <span className="price">
            {p.promo > 0 && <del className="old-price">{money(p.original_price)}</del>} {money(p.price)}
          </span>
          <span className={`status ${statusClass}`}>{statusText}</span>
        </div>
        <AddToCartButton product={p} />
      </div>
    </article>
  );
}
