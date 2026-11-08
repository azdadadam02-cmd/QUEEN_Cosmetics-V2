'use client';
import VariantTag from '@/components/ui/VariantTag';

/** Couleurs et tailles indépendantes : chaque bouton est une version vendue à part (son prix, son stock) */
export default function VariantPicker({ variants, selected, onSelect, productName }) {
  const colors = variants.filter((v) => v.color);
  const sizes = variants.filter((v) => !v.color && v.size);
  const on = (v) => selected?.id === v.id;

  return (
    <>
      {colors.length > 0 && (
        <div className="pd-option">
          <span className="pd-label">Couleurs :</span>
          {colors.map((v) => (
            <button
              key={v.id}
              type="button"
              className={`pd-swatch${on(v) ? ' on' : ''}${v.stock > 0 ? '' : ' soldout'}`}
              style={{ background: v.color }}
              onClick={() => onSelect(v)}
              aria-label={`Couleur ${v.color}`}
              aria-pressed={on(v)}
            />
          ))}
        </div>
      )}

      {sizes.length > 0 && (
        <div className="pd-option">
          <span className="pd-label">Taille :</span>
          {sizes.map((v) => (
            <button key={v.id} type="button" className={`pd-size${on(v) ? ' on' : ''}${v.stock > 0 ? '' : ' soldout'}`} onClick={() => onSelect(v)} aria-pressed={on(v)}>
              {v.size}
            </button>
          ))}
        </div>
      )}

      {selected && (
        <p className="pd-chosen"><strong>{productName}</strong> <VariantTag color={selected.color} size={selected.size} /></p>
      )}
    </>
  );
}
