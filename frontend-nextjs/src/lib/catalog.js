import { norm } from './format.js';

export const ROW = 6;
export const PER_PAGE = 12;
export const ROWS_PER_PAGE = 4;
export const NONE = 'Autres';

export function groupBy(items, keyOf) {
  const groups = new Map();
  items.forEach((p) => {
    const key = keyOf(p) || NONE;
    groups.set(key, [...(groups.get(key) || []), p]);
  });
  return [...groups].sort(([a], [b]) => a.localeCompare(b, 'fr'));
}

/** Recherche : chaque mot doit se trouver dans le nom, la marque, la catégorie ou la sous-catégorie (sans accents ni majuscules) */
export function searchCatalog(products, packs, { q, cat, sub }) {
  const terms = norm(q).split(/\s+/).filter(Boolean);
  const matches = (...fields) => {
    const hay = norm(fields.join(' '));
    return terms.every((t) => hay.includes(t));
  };
  const list = products.filter((p) => (!cat || (p.category || NONE) === cat)
    && (!sub || (p.sub_category || NONE) === sub)
    && (!terms.length || matches(p.name, p.brand, p.category, p.sub_category)));
  // Un pack ressort par son nom ou par n'importe quel produit qu'il contient
  const foundPacks = terms.length && !cat && !sub
    ? packs.filter((k) => matches(k.name, k.description, ...(k.products || []).flatMap((x) => [x.name, x.brand, x.category, x.sub_category])))
    : [];
  return { list, foundPacks };
}

/** Tous → une rangée par catégorie ; ?cat → une rangée par sous-catégorie ; sous-catégorie, VOIR PLUS ou recherche → grille paginée */
export function layoutCatalog(list, { cat, sub, showAll, q, page: wanted }) {
  const groups = sub || showAll || q ? [] : groupBy(list, (p) => (cat ? p.sub_category : p.category));
  const rows = groups.length > 1 ? groups : null;
  const pageSize = rows ? ROWS_PER_PAGE : PER_PAGE;
  const pages = Math.max(1, Math.ceil((rows || list).length / pageSize));
  const page = Math.min(pages, Math.max(1, Number(wanted) || 1));
  const slice = (arr) => arr.slice((page - 1) * pageSize, page * pageSize);
  return { rows, pages, page, pageRows: rows ? slice(rows) : [], pageItems: rows ? [] : slice(list) };
}
