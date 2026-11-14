const ICONS = {
  wallet: <><path d="M3 7a2 2 0 0 1 2-2h12v4" /><path d="M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2z" /><circle cx="16" cy="14.5" r="1.2" /></>,
  phone: <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" />,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
  shield: <><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>,
};

// Deux rangées de deux : chaque rangée est serrée sur son contenu (une grille alignerait la 2e colonne sur la plus large)
const ROWS = [
  [['wallet', 'Paiement à la livraison'], ['phone', 'Contact avec le livreur']],
  [['globe', 'Suivi sur le site'], ['shield', 'Confiance et sécurité']],
];

/** Garanties de la boutique, au-dessus du prix (fiche produit et fiche pack) */
export default function TrustBadges() {
  return (
    <div className="pd-trust" role="group" aria-label="Nos garanties">
      {ROWS.map((row) => (
        <ul key={row[0][0]}>
          {row.map(([icon, label]) => (
            <li key={icon}>
              {label}
              <svg viewBox="0 0 24 24" aria-hidden="true">{ICONS[icon]}</svg>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
