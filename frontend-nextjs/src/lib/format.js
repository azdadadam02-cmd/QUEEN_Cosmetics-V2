export function money(n) {
  const v = Number(n || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${v.replace(/ | /g, ' ')} DH`;
}

const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

/**
 * « 8 novembre 2026 » à partir de l'ISO de Laravel, déjà dans le fuseau de la boutique : on lit le jour tel quel.
 * Pas de conversion JS : Node, les navigateurs et PHP n'ont pas les mêmes règles pour Africa/Casablanca.
 */
export function dayDate(iso) {
  const [y, m, d] = String(iso ?? '').slice(0, 10).split('-').map(Number);
  return y && m && d ? `${d} ${MONTHS[m - 1]} ${y}` : '';
}

export function dateTime(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export const norm = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function initial(s) {
  return (s || '?').trim().charAt(0).toUpperCase() || '?';
}

export const STATUS = {
  'En attente': { label: 'En attente', cls: 'attente' },
  Acceptee: { label: 'Acceptée', cls: 'acceptee' },
  Livree: { label: 'Livrée', cls: 'livree' },
  Refusee: { label: 'Refusée', cls: 'refusee' },
};
export const statusInfo = (s) => STATUS[s] || { label: s, cls: 'attente' };
