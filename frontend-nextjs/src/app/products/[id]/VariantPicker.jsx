'use client';
import VariantTag from '@/components/ui/VariantTag';
import { pickVariant } from '@/lib/variants';

const unique = (values) => [...new Set(values.filter(Boolean))];

export default function VariantPicker({ variants, selected, onSelect, productName }) {
  const colors = unique(variants.map((v) => v.color));
  const sizes = unique(variants.map((v) => v.size));
  const pick = (key, value) => onSelect(pickVariant(variants, selected, key, value));

  return (
    <>
      {colors.length > 0 && (
        <div className="pd-option">
          <span className="pd-label">Couleurs :</span>
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              className={`pd-swatch${selected?.color === c ? ' on' : ''}${variants.some((v) => v.color === c && v.stock > 0) ? '' : ' soldout'}`}
              style={{ background: c }}
              onClick={() => pick('color', c)}
              aria-label={`Couleur ${c}`}
              aria-pressed={selected?.color === c}
            />
          ))}
        </div>
      )}

      {sizes.length > 0 && (
        <div className="pd-option">
          <span className="pd-label">Taille :</span>
          {sizes.map((s) => {
            // La taille n'est disponible que dans la couleur choisie, s'il y en a une
            const inColor = variants.filter((v) => v.size === s && (!selected?.color || v.color === selected.color));
            return (
              <button
                key={s}
                type="button"
                className={`pd-size${selected?.size === s ? ' on' : ''}${inColor.some((v) => v.stock > 0) ? '' : ' soldout'}`}
                onClick={() => pick('size', s)}
                aria-pressed={selected?.size === s}
              >{s}</button>
            );
          })}
        </div>
      )}

      {selected && (
        <p className="pd-chosen"><strong>{productName}</strong> <VariantTag color={selected.color} size={selected.size} /></p>
      )}
    </>
  );
}
