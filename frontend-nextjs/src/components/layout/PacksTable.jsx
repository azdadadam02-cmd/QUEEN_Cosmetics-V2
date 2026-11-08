'use client';
import Thumb from '@/components/ui/Thumb';
import { money } from '@/lib/format';

export default function PacksTable({ packs, onEdit, onDelete }) {
  return (
    <div className="panel tablewrap">
      <table className="tbl">
        <thead>
          <tr><th>Pack</th><th>Produits</th><th className="num">Prix</th><th className="num">Dispo</th><th>État</th>{onEdit && <th className="right">Actions</th>}</tr>
        </thead>
        <tbody>
          {!packs && <tr><td colSpan={6} className="empty-row">Chargement…</td></tr>}
          {packs?.length === 0 && <tr><td colSpan={6} className="empty-row">Aucun pack.</td></tr>}
          {packs?.map((p) => (
            <tr key={p.id}>
              <td><span className="cell-prod"><Thumb src={p.image_url} name={p.name} size="xs" /><strong>{p.name}</strong></span></td>
              <td>{p.products.map((it) => `${it.name}${it.quantity > 1 ? ` × ${it.quantity}` : ''}`).join(', ') || '—'}</td>
              <td className="num">{money(p.price)}{p.value > p.price && <small>au lieu de {money(p.value)}</small>}</td>
              <td className="num"><strong>{p.stock}</strong></td>
              <td><span className={`pill ${p.active ? 'pill-livree' : 'pill-role'}`}>{p.active ? 'Actif' : 'Inactif'}</span></td>
              {onEdit && (
                <td className="act right">
                  <button type="button" className="btn-ghost" onClick={() => onEdit(p)}>Modifier</button>{' '}
                  <button type="button" className="btn-danger" onClick={() => onDelete(p)}>Supprimer</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
