'use client';
import ProductCard from '@/components/layout/ProductCard';
import { googleFontsHref, themeVars } from '@/lib/theme';

const SAMPLE = { id: 0, name: 'Rouge à lèvres', brand: 'Queen', price: 90, original_price: 100, promo: 10, image_url: null, in_stock: true, rating: 4, rating_count: 3 };

/** Aperçu en direct : les variables du thème sont posées sur ce bloc seulement, le reste de la page garde son apparence */
export default function ThemePreview({ theme }) {
  const fonts = googleFontsHref(theme);
  return (
    <>
      {fonts && <link rel="stylesheet" href={fonts} />}
      <div className="theme-preview" style={themeVars(theme)} inert>
        <div className="tp-nav"><span>Accueil</span><span>Produits</span><span>Les Packs</span><span>Panier</span></div>
        <div className="tp-body">
          <h3>Nos nouveautés</h3>
          <p>Parfums, soins et maquillage, paiement à la livraison.</p>
          <div className="tp-card"><ProductCard product={SAMPLE} /></div>
          <span className="pc-out">Rupture de stock</span>
          <span className="tp-btn">Ajouter</span>
        </div>
        <div className="tp-foot">QUEEN Cosmetics · Paiement à la livraison</div>
      </div>
    </>
  );
}
