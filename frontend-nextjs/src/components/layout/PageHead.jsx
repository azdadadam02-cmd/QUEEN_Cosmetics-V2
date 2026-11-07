/** En-tête de page de l'espace personnel */
export default function PageHead({ title, note, children }) {
  return (
    <div className="page-head page-head-row">
      <div>
        <h1 className="h-serif">{title}</h1>
        {note && <span className="readonly-note">{note}</span>}
      </div>
      {children}
    </div>
  );
}
