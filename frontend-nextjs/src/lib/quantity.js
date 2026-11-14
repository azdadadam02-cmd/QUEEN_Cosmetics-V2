/** Quantité valide : entier entre 1 et max (max = stock ou plafond du panier, jamais moins de 1) */
export function clampQty(n, max) {
  const top = Math.max(1, Math.floor(Number(max)) || 1);
  const value = Math.floor(Number(n));
  return Math.min(top, Math.max(1, Number.isFinite(value) ? value : 1));
}

/** Ce que le client tape : on ne garde que les chiffres ; vide reste vide le temps de la saisie */
export function typedQty(text, max) {
  const digits = String(text).replace(/\D/g, '');
  return digits === '' ? null : clampQty(digits, max);
}
