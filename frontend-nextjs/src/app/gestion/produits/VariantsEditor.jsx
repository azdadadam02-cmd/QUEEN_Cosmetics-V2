'use client';
import { EMPTY_VARIANT } from '@/lib/productForm';

/** Lignes de variantes (couleur, taille, ml, g, pcs, stock). currentStock : stock saisi avant la première variante */
export default function VariantsEditor({ variants, onChange, errors, currentStock }) {
  const setVariant = (i, k, value) => onChange(variants.map((v, j) => (j === i ? { ...v, [k]: value } : v)));
  const variantError = Object.entries(errors).find(([k]) => k.startsWith('variants'))?.[1];

  return (
    <fieldset className="form-group">
      <legend>Variantes <small>(le stock du produit devient leur total)</small></legend>
      {variants.length > 0 && (
        <div className="variant-row variant-head" aria-hidden="true">
          <span>Couleur</span><span>Taille</span><span>ml</span><span>g</span><span>pcs</span><strong>Stock *</strong><span />
        </div>
      )}
      {variants.map((v, i) => (
        <div className="variant-row" key={v.id ?? `new-${i}`}>
          <label className="variant-color">
            <input type="checkbox" checked={v.hasColor} onChange={(e) => setVariant(i, 'hasColor', e.target.checked)} aria-label="Avec couleur" />
            <input type="color" value={v.couleur} disabled={!v.hasColor} onChange={(e) => setVariant(i, 'couleur', e.target.value)} aria-label="Couleur" />
          </label>
          <input type="text" maxLength={20} placeholder="Taille" aria-label="Taille (texte)" value={v.taille} onChange={(e) => setVariant(i, 'taille', e.target.value)} />
          <input type="number" min="1" placeholder="ml" aria-label="Volume en ml" value={v.volume_ml} onChange={(e) => setVariant(i, 'volume_ml', e.target.value)} />
          <input type="number" min="1" placeholder="g" aria-label="Poids en grammes" value={v.poids_g} onChange={(e) => setVariant(i, 'poids_g', e.target.value)} />
          <input type="number" min="1" placeholder="pcs" aria-label="Nombre de pièces" value={v.quantite_pieces} onChange={(e) => setVariant(i, 'quantite_pieces', e.target.value)} />
          <input type="number" min="0" required className={errors[`variants.${i}.stock`] ? 'invalid' : ''} placeholder="Stock" aria-label="Stock (obligatoire)" value={v.stock} onChange={(e) => setVariant(i, 'stock', e.target.value)} />
          <button type="button" className="btn-danger" onClick={() => onChange(variants.filter((_, j) => j !== i))} aria-label="Retirer la variante">×</button>
        </div>
      ))}
      {variantError && <span className="error-text">{variantError}</span>}
      {/* La première variante reprend le stock déjà saisi : le champ Stock disparaît, la quantité ne doit pas se perdre */}
      <button type="button" className="btn-ghost" onClick={() => onChange([...variants, { ...EMPTY_VARIANT, stock: variants.length === 0 ? currentStock : '' }])}>+ Ajouter une variante</button>
    </fieldset>
  );
}
