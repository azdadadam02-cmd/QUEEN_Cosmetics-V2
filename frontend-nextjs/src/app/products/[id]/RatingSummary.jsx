/** Note moyenne + répartition par étoiles (avis approuvés). */
export default function RatingSummary({ rating, count, reviews }) {
  // shortcut: la répartition vient des 50 derniers avis renvoyés par l'API, à calculer côté serveur si un produit en dépasse 50
  const total = reviews.length;
  const per = [5, 4, 3, 2, 1].map((n) => [n, reviews.filter((r) => r.rating === n).length]);

  return (
    <div className="pd-rating">
      <div className="pd-rating-score">
        <p><strong>{count > 0 ? rating.toFixed(1) : '0'}</strong><span>/5</span></p>
        <small>({count} avis)</small>
      </div>
      <ul aria-label="Répartition des notes">
        {per.map(([n, c]) => (
          <li key={n}>
            <span className="pd-rating-star" aria-hidden="true">★</span>
            <span>{n}</span>
            <span className="pd-rating-bar" role="img" aria-label={`${n} étoiles : ${c} avis`}>
              <i style={{ width: `${total ? (c / total) * 100 : 0}%` }} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
