/** Formulaire produit du responsable produits : conversions entre l'API (anglais) et les champs Laravel (français) */
export const EMPTY_PRODUCT = { nom: '', marque: '', categorie: '', sous_categorie: '', tranche_age: '', details: '', prix: '', stock: '', promotion: '' };
export const EMPTY_VARIANT = { id: null, hasColor: false, couleur: '#b5736a', taille: '', volume_ml: '', poids_g: '', quantite_pieces: '', stock: '' };

const num = (v) => (v === '' || v === null || v === undefined ? null : Number(v));

export function productToForm(p) {
  if (!p?.id) return EMPTY_PRODUCT;
  return { nom: p.name, marque: p.brand || '', categorie: p.category || '', sous_categorie: p.sub_category || '', tranche_age: p.age_range || '', details: p.details || '', prix: String(p.original_price), stock: String(p.stock), promotion: String(p.own_promotion || '') };
}

export function variantsToRows(p) {
  return (p?.variants || []).map((v) => ({
    id: v.id,
    hasColor: !!v.color,
    couleur: v.color || EMPTY_VARIANT.couleur,
    taille: v.taille || '',
    volume_ml: v.volume_ml ?? '',
    poids_g: v.poids_g ?? '',
    quantite_pieces: v.quantite_pieces ?? '',
    stock: String(v.stock),
  }));
}

export function rowsToVariants(rows) {
  return rows.map((v) => ({
    id: v.id,
    couleur: v.hasColor ? v.couleur : null,
    taille: v.taille.trim() || null,
    volume_ml: num(v.volume_ml),
    poids_g: num(v.poids_g),
    quantite_pieces: num(v.quantite_pieces),
    stock: num(v.stock),   // vide = erreur de Laravel, jamais un 0 silencieux
  }));
}

export const variantsTotal = (rows) => rows.reduce((s, v) => s + (Number(v.stock) || 0), 0);
