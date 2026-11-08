export function money(n) {
  const v = Number(n || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${v.replace(/ | /g, ' ')} DH`;
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
