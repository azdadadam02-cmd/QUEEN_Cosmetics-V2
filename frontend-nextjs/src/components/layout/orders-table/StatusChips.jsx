import { STATUS } from '@/lib/format';

/** Filtre par statut, avec le nombre de commandes de chacun */
export default function StatusChips({ value, onChange, counters = {} }) {
  const total = Object.values(counters).reduce((a, b) => a + Number(b), 0);
  return (
    <div className="chips" role="group" aria-label="Filtrer par statut">
      <button type="button" className={`chip${value === '' ? ' active' : ''}`} onClick={() => onChange('')}>
        Toutes <b>{total}</b>
      </button>
      {Object.entries(STATUS).map(([key, s]) => (
        <button key={key} type="button" className={`chip${value === key ? ' active' : ''}`} onClick={() => onChange(key)}>
          {s.label} <b>{counters[key] || 0}</b>
        </button>
      ))}
    </div>
  );
}
