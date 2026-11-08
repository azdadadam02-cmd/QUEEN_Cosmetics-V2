/** Formulaire produit du responsable produits : conversions entre l'API (anglais) et les champs Laravel (français) */
export const EMPTY_PRODUCT = { nom: '', marque: '', categorie: '', sous_categorie: '', tranche_age: '', details: '', prix: '', stock: '', promotion: '' };

/** Une ligne est SOIT une couleur, SOIT une taille : chacune a son prix (vide = prix du produit) et son stock */
export const EMPTY_COLOR = { id: null, kind: 'color', couleur: '#b5736a', prix: '', stock: '' };
export const EMPTY_SIZE = { id: null, kind: 'size', taille: '', volume_ml: '', poids_g: '', quantite_pieces: '', prix: '', stock: '' };

const num = (v) => (v === '' || v === null || v === undefined ? null : Number(v));
const text = (v) => (v === null || v === undefined ? '' : String(v));

export function productToForm(p) {
  if (!p?.id) return EMPTY_PRODUCT;
  return { nom: p.name, marque: p.brand || '', categorie: p.category || '', sous_categorie: p.sub_category || '', tranche_age: p.age_range || '', details: p.details || '', prix: String(p.original_price), stock: String(p.stock), promotion: String(p.own_promotion || '') };
}

const hasSize = (v) => !!(v.taille || v.volume_ml || v.poids_g || v.quantite_pieces);

/** Ancienne ligne couleur + taille : rangée dans les tailles, legacyColor signale la couleur qui sera retirée à l'enregistrement */
export function variantsToRows(p) {
  return (p?.variants || []).map((v) => (v.color && !hasSize(v)
    ? { ...EMPTY_COLOR, id: v.id, couleur: v.color, prix: text(v.prix), stock: String(v.stock) }
    : { ...EMPTY_SIZE, id: v.id, taille: v.taille || '', volume_ml: text(v.volume_ml), poids_g: text(v.poids_g), quantite_pieces: text(v.quantite_pieces), prix: text(v.prix), stock: String(v.stock), ...(v.color ? { legacyColor: v.color } : {}) }));
}

export function rowsToVariants(rows) {
  return rows.map((v) => {
    const color = v.kind === 'color';
    return {
      id: v.id,
      couleur: color ? v.couleur : null,
      taille: color ? null : v.taille.trim() || null,
      volume_ml: color ? null : num(v.volume_ml),
      poids_g: color ? null : num(v.poids_g),
      quantite_pieces: color ? null : num(v.quantite_pieces),
      prix: v.prix.trim() || null,   // texte : Laravel accepte « 12,5 » et refuse le reste, au lieu d'un NaN silencieux
      stock: num(v.stock),   // vide = erreur de Laravel, jamais un 0 silencieux
    };
  });
}

export const variantsTotal = (rows) => rows.reduce((s, v) => s + (Number(v.stock) || 0), 0);
