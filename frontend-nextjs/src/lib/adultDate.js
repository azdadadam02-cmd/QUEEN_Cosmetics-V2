const pad = (n) => String(n).padStart(2, '0');

/**
 * Dernière date de naissance possible pour avoir 18 ans aujourd'hui, au format du <input type="date"> (AAAA-MM-JJ).
 * Comme Carbon::subYears côté Laravel : un 29 février devient le 28 (setFullYear donnerait le 1er mars, un jour trop tard).
 */
export function latestAdultBirthDate(today = new Date(), age = 18) {
  const y = today.getFullYear() - age;
  const m = today.getMonth();
  const lastDay = new Date(y, m + 1, 0).getDate();
  return `${y}-${pad(m + 1)}-${pad(Math.min(today.getDate(), lastDay))}`;
}
