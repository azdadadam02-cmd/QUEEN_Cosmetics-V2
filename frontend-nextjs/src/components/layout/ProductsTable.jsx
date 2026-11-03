'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Thumb from '@/components/ui/Thumb';
import { api, errorMessage } from '@/lib/api';
import { money } from '@/lib/format';
import { toast } from '@/store/toastStore';

/** Tableau des produits + stats. onEdit absent = lecture seule (admin) */
export default function ProductsTable({ onEdit, reloadKey = 0, onLoaded }) {
  const [data, setData] = useState(null);
  const [q, setQ] = useState('');

  const onLoadedRef = useRef(onLoaded);
  useEffect(() => {
    onLoadedRef.current = onLoaded;
  });

  // Recharge à l'ouverture et après chaque enregistrement (reloadKey change)
  useEffect(() => {
    let alive = true;
    api
      .get('/manage/products')
      .then(({ data }) => {
        if (!alive) return;
        setData(data);
        onLoadedRef.current?.(data);
      })
      .catch((e) => toast.error(errorMessage(e)));
    return () => {
      alive = false;
    };
  }, [reloadKey]);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (data?.products || []).filter((p) => !s || p.name.toLowerCase().includes(s) || (p.category || '').toLowerCase().includes(s));
  }, [data, q]);

  const st = data?.stats;
  return (
    <>
      {st && (
        <div className="stats">
          <div className="stat"><span className="stat-label">Produits</span><strong>{st.total}</strong><small>au catalogue</small></div>
          <div className="stat"><span className="stat-label">Unités</span><strong>{st.unites}</strong><small>en stock</small></div>
          <div className="stat warn"><span className="stat-label">Stock faible</span><strong>{st.faible}</strong><small>5 unités ou moins</small></div>
          <div className="stat warn"><span className="stat-label">Rupture</span><strong>{st.rupture}</strong><small>indisponibles</small></div>
        </div>
      )}
      <div className="panel tablewrap">
        <div className="toolbar">
          <label className="search">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4-4" /></svg>
            <input type="search" placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <span className="count">{list.length} produit(s)</span>
        </div>
        <table className="tbl">
          <thead>
            <tr><th>Produit</th><th>Catégorie</th><th className="num">Prix</th><th className="num">Promo</th><th className="num">Stock</th><th>État</th>{onEdit && <th className="right">Action</th>}</tr>
          </thead>
          <tbody>
            {!data && <tr><td colSpan={7} className="empty-row">Chargement…</td></tr>}
            {data && list.length === 0 && <tr><td colSpan={7} className="empty-row">Aucun produit.</td></tr>}
            {list.map((p) => (
              <tr key={p.id}>
                <td><span className="cell-prod"><Thumb src={p.image_url} name={p.name} size="xs" /><strong>{p.name}</strong></span></td>
                <td>{p.category || '—'}</td>
                <td className="num">
                  {money(p.original_price)}
                  {p.promo > 0 && <small>{money(p.price)} après promo</small>}
                </td>
                <td className="num">{p.promo > 0 ? <span className="pill pill-promo">-{p.promo}%</span> : '—'}</td>
                <td className="num"><strong>{p.stock}</strong></td>
                <td>
                  <span className={`status ${!p.in_stock ? 'out' : p.low_stock ? 'low' : 'ok'}`}>
                    {!p.in_stock ? 'Rupture' : p.low_stock ? 'Stock faible' : 'Disponible'}
                  </span>
                </td>
                {onEdit && <td className="right"><button type="button" className="btn-ghost" onClick={() => onEdit(p)}>Modifier</button></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
