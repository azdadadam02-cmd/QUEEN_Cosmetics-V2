import Thumb from '@/components/ui/Thumb';
import { money } from '@/lib/format';

const status = (p) => (p.deleted ? ['out', 'Supprimé'] : !p.in_stock ? ['out', 'Rupture'] : p.low_stock ? ['low', 'Stock faible'] : ['ok', 'Disponible']);

/** onEdit absent = lecture seule (admin) ; onAsk(kind, p) ouvre la confirmation */
export default function ProductRow({ product: p, onEdit, onAsk }) {
  const [cls, label] = status(p);
  return (
    <tr>
      <td><span className="cell-prod"><Thumb src={p.image_url} name={p.name} size="xs" /><strong>{p.name}</strong></span></td>
      <td>{p.category || '—'}</td>
      <td className="num">
        {money(p.original_price)}
        {p.promo > 0 && <small>{money(p.price)} après promo</small>}
      </td>
      <td className="num">{p.promo > 0 ? <span className="pill pill-promo">-{p.promo}%</span> : '—'}</td>
      <td className="num"><strong>{p.stock}</strong></td>
      <td><span className={`status ${cls}`}>{label}</span></td>
      {onEdit && (
        <td className="right"><div className="row-actions">
          {p.deleted ? (
            <>
              <button type="button" className="btn-ok" onClick={() => onAsk('restore', p)}>Restaurer</button>
              <button type="button" className="btn-danger" onClick={() => onAsk('force', p)}>Supprimer définitivement</button>
            </>
          ) : (
            <>
              <button type="button" className="btn-ghost" onClick={() => onEdit(p)}>Modifier</button>
              <button type="button" className="btn-danger" onClick={() => onAsk('delete', p)}>Supprimer</button>
            </>
          )}
        </div></td>
      )}
    </tr>
  );
}
