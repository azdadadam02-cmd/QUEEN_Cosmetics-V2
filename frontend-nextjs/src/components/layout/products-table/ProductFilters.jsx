/** Barre de recherche + filtres. Changer de vue ou de catégorie remet à zéro ce qui en dépend. */
export default function ProductFilters({ filters: f, onChange, cats, subs, trashCount, count }) {
  const set = (k, reset = {}) => (e) => onChange({ ...f, ...reset, [k]: e.target.value });

  return (
    <div className="toolbar">
      <label className="search">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4-4" /></svg>
        <input type="search" placeholder="Rechercher…" value={f.q} onChange={set('q')} />
      </label>
      <div className="filters">
        <select value={f.view} onChange={set('view', { cat: '', sub: '' })} aria-label="Catalogue ou produits supprimés">
          <option value="">Produits du catalogue</option>
          <option value="trash">Supprimés ({trashCount ?? 0})</option>
        </select>
        <select value={f.cat} onChange={set('cat', { sub: '' })} aria-label="Filtrer par catégorie">
          <option value="">Catégorie : toutes</option>
          {cats.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={f.sub} onChange={set('sub')} disabled={!f.cat} aria-label="Filtrer par sous-catégorie">
          <option value="">Sous-catégorie : toutes</option>
          {subs.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={f.dispo} onChange={set('dispo')} aria-label="Filtrer par disponibilité">
          <option value="">Disponibilité : toutes</option>
          <option value="dispo">Disponibles</option>
          <option value="indispo">Indisponibles (rupture)</option>
        </select>
        <select value={f.stars} onChange={set('stars')} aria-label="Filtrer par nombre d'étoiles">
          <option value="">Étoiles : toutes</option>
          {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
          <option value="0">Sans avis</option>
        </select>
        <select value={f.promo} onChange={set('promo')} aria-label="Filtrer par promotion">
          <option value="">Promotions : toutes</option>
          <option value="yes">En promotion</option>
          <option value="no">Sans promotion</option>
        </select>
        <select value={f.sort} onChange={set('sort')} aria-label="Trier par prix">
          <option value="">Tri : plus récents</option>
          <option value="asc">Prix croissant</option>
          <option value="desc">Prix décroissant</option>
        </select>
      </div>
      <span className="count">{count} produit(s)</span>
    </div>
  );
}
