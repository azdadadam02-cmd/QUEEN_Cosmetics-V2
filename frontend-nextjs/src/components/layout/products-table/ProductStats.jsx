export default function ProductStats({ stats: st }) {
  return (
    <div className="stats">
      <div className="stat"><span className="stat-label">Produits</span><strong>{st.total}</strong><small>au catalogue</small></div>
      <div className="stat"><span className="stat-label">Unités</span><strong>{st.unites}</strong><small>en stock</small></div>
      <div className="stat warn"><span className="stat-label">Stock faible</span><strong>{st.faible}</strong><small>5 unités ou moins</small></div>
      <div className="stat warn"><span className="stat-label">Rupture</span><strong>{st.rupture}</strong><small>indisponibles</small></div>
    </div>
  );
}
