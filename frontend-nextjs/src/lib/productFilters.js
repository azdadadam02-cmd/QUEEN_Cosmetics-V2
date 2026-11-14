export const EMPTY_FILTERS = { q: '', view: '', cat: '', sub: '', dispo: '', stars: '', promo: '', sort: '' };

export const uniqSorted = (values) => [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, 'fr'));

/** Catalogue ou corbeille (view === 'trash') */
export const productsInView = (products, view) => products.filter((p) => !!p.deleted === (view === 'trash'));

/** stars : '' | '0' (sans avis) … '5', même arrondi que le composant Stars */
export function filterProducts(products, f) {
  const s = f.q.trim().toLowerCase();
  const rows = products.filter((p) =>
    (!f.cat || p.category === f.cat) &&
    (!f.sub || p.sub_category === f.sub) &&
    (!s || p.name.toLowerCase().includes(s) || (p.category || '').toLowerCase().includes(s)) &&
    (!f.dispo || (f.dispo === 'dispo') === !!p.in_stock) &&
    (f.stars === '' || (p.rating_count > 0 ? Math.round(p.rating) : 0) === Number(f.stars)) &&
    (!f.promo || (f.promo === 'yes') === p.promo > 0));
  return f.sort ? [...rows].sort((a, b) => (f.sort === 'asc' ? a.price - b.price : b.price - a.price)) : rows;
}
