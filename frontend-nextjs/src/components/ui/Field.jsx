/** Champ de formulaire avec libellé + message d'erreur venant de Laravel */
export default function Field({ label, hint, error, id, as = 'input', children, ...props }) {
  const Tag = as;
  return (
    <div className="field">
      {label && (
        <label htmlFor={id}>
          {label} {hint && <small>{hint}</small>}
        </label>
      )}
      {children ?? <Tag id={id} {...props} />}
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}
