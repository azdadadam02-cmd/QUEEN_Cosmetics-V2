/** 5 étoiles : pleines selon la note arrondie ; grises tant qu'il n'y a aucun avis */
export default function Stars({ value = 0, count = 0, className = '' }) {
  const full = count > 0 ? Math.round(value) : 0;
  return (
    <span className={`stars ${className}`} role="img" aria-label={count > 0 ? `${value} sur 5 (${count} avis)` : 'Pas encore d’avis'}>
      {[1, 2, 3, 4, 5].map((i) => <span key={i} className={i <= full ? 'on' : ''}>★</span>)}
    </span>
  );
}
