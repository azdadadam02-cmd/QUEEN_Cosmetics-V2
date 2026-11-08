export default function VariantTag({ color, size }) {
  if (!color && !size) return null;
  return (
    <span className="variant-tag">
      {color && <span className="variant-dot" style={{ background: color }} title={color} role="img" aria-label={`Couleur ${color}`} />}
      {size && <span>{size}</span>}
    </span>
  );
}
