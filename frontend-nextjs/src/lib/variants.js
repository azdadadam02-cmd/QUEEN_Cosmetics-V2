/** Garde l'autre choix si la combinaison existe, sinon prend la première variante de cette option */
export function pickVariant(variants, selected, key, value) {
  const same = variants.filter((v) => v[key] === value);
  const other = key === 'color' ? 'size' : 'color';
  return same.find((v) => v[other] === selected?.[other] && v.stock > 0) || same.find((v) => v.stock > 0) || same[0];
}
