'use client';
import { EMPTY_COLOR, EMPTY_SIZE } from '@/lib/productForm';

const SIZE_FIELDS = [
  ['taille', 'Taille', 'text', 'Taille (texte)'],
  ['volume_ml', 'ml', 'number', 'Volume en ml'],
  ['poids_g', 'g', 'number', 'Poids en grammes'],
  ['quantite_pieces', 'pcs', 'number', 'Nombre de pièces'],
];

/**
 * Deux listes indépendantes : les couleurs et les tailles. Chaque ligne = une version vendue, avec son prix et son stock.
 * variants garde l'ordre envoyé à Laravel : les erreurs « variants.3.stock » pointent vers la bonne ligne.
 * currentStock : stock saisi avant la première variante ; basePrice : prix du produit (proposé en grisé).
 */
export default function VariantsEditor({ variants, onChange, errors, currentStock, basePrice }) {
  const set = (i, k, value) => onChange(variants.map((v, j) => (j === i ? { ...v, [k]: value } : v)));
  const remove = (i) => onChange(variants.filter((_, j) => j !== i));
  // La première variante reprend le stock déjà saisi : le champ Stock disparaît, la quantité ne doit pas se perdre
  const add = (empty) => onChange([...variants, { ...empty, stock: variants.length === 0 ? currentStock : '' }]);
  const rows = (kind) => variants.map((v, i) => [v, i]).filter(([v]) => v.kind === kind);
  const rowError = (i) => errors[`variants.${i}`] || Object.entries(errors).find(([k]) => k.startsWith(`variants.${i}.`))?.[1];
  const listError = errors.variants;
  const pricePlaceholder = basePrice ? `${basePrice} (produit)` : 'Prix du produit';

  const common = (v, i) => (
    <>
      <input type="text" inputMode="decimal" placeholder={pricePlaceholder} aria-label="Prix en DH (vide = prix du produit)" className={errors[`variants.${i}.prix`] ? 'invalid' : ''} value={v.prix} onChange={(e) => set(i, 'prix', e.target.value)} />
      <input type="number" min="0" required placeholder="Stock" aria-label="Stock (obligatoire)" className={errors[`variants.${i}.stock`] ? 'invalid' : ''} value={v.stock} onChange={(e) => set(i, 'stock', e.target.value)} />
      <button type="button" className="btn-danger" onClick={() => remove(i)} aria-label="Retirer cette ligne">×</button>
    </>
  );

  return (
    <div className="variants-editor">
      <p className="muted variants-note">Chaque couleur et chaque taille est une version vendue à part : son propre prix (vide = prix du produit) et son propre stock. Le stock du produit devient leur total.</p>

      <fieldset className="form-group">
        <legend>Couleurs</legend>
        {rows('color').length > 0 && (
          <div className="variant-row color variant-head" aria-hidden="true"><span>Couleur</span><span>Prix (DH)</span><strong>Stock *</strong><span /></div>
        )}
        {rows('color').map(([v, i]) => (
          <div key={v.id ?? `new-${i}`}>
            <div className="variant-row color">
              <input type="color" value={v.couleur} onChange={(e) => set(i, 'couleur', e.target.value)} aria-label="Couleur" />
              {common(v, i)}
            </div>
            {rowError(i) && <span className="error-text">{rowError(i)}</span>}
          </div>
        ))}
        <button type="button" className="btn-ghost" onClick={() => add(EMPTY_COLOR)}>+ Ajouter une couleur</button>
      </fieldset>

      <fieldset className="form-group">
        <legend>Tailles <small>(taille, ml, g ou pièces)</small></legend>
        {rows('size').length > 0 && (
          <div className="variant-row size variant-head" aria-hidden="true">
            {SIZE_FIELDS.map(([, label]) => <span key={label}>{label}</span>)}<span>Prix (DH)</span><strong>Stock *</strong><span />
          </div>
        )}
        {rows('size').map(([v, i]) => (
          <div key={v.id ?? `new-${i}`}>
            <div className="variant-row size">
              {SIZE_FIELDS.map(([k, label, type, aria]) => (
                <input key={k} type={type} min={type === 'number' ? '1' : undefined} maxLength={type === 'text' ? 20 : undefined} placeholder={label} aria-label={aria} value={v[k]} onChange={(e) => set(i, k, e.target.value)} />
              ))}
              {common(v, i)}
            </div>
            {v.legacyColor && (
              <span className="error-text">
                <span className="legacy-dot" style={{ background: v.legacyColor }} /> Cette ligne avait aussi une couleur ({v.legacyColor}) : elle sera retirée à l&apos;enregistrement. Ajoutez-la dans « Couleurs » si besoin.
              </span>
            )}
            {rowError(i) && <span className="error-text">{rowError(i)}</span>}
          </div>
        ))}
        <button type="button" className="btn-ghost" onClick={() => add(EMPTY_SIZE)}>+ Ajouter une taille</button>
      </fieldset>
      {listError && <span className="error-text">{listError}</span>}
    </div>
  );
}
