'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Thumb from '@/components/ui/Thumb';
import { api, errorMessage } from '@/lib/api';
import { money } from '@/lib/format';
import { toast } from '@/store/toastStore';

const ACTIONS = {
  delete: {
    title: 'Supprimer le produit',
    text: (p) => `Voulez-vous supprimer « ${p.name} » ? Il disparaît de la boutique et va dans les supprimés, où vous pourrez le restaurer.`,
    run: (p) => api.delete(`/manage/products/${p.id}`),
  },
  restore: {
    title: 'Restaurer le produit',
    text: (p) => `Voulez-vous restaurer « ${p.name} » ? Il redevient visible dans la boutique.`,
    run: (p) => api.post(`/manage/products/${p.id}/restore`),
  },
  force: {
    title: 'Supprimer définitivement',
    text: (p) => `Voulez-vous supprimer « ${p.name} » définitivement ? Action irréversible : ses variantes, sa galerie, ses avis et ses favoris seront effacés.`,
    run: (p) => api.delete(`/manage/products/${p.id}/force`),
    danger: true,
  },
};

export default function ProductsTable({ onEdit, reloadKey = 0, onLoaded }) {
  const [data, setData] = useState(null);
  const [q, setQ] = useState('');
  const [view, setView] = useState('');
  const [cat, setCat] = useState('');
  const [sub, setSub] = useState('');
  const [dispo, setDispo] = useState('');
  const [stars, setStars] = useState('');
  const [promo, setPromo] = useState('');
  const [sort, setSort] = useState('');
  const [tick, setTick] = useState(0);
  const [ask, setAsk] = useState(null);
  const [busy, setBusy] = useState(false);

  const onLoadedRef = useRef(onLoaded);
  useEffect(() => {
    onLoadedRef.current = onLoaded;
  });

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
  }, [reloadKey, tick]);

  const inView = useMemo(() => (data?.products || []).filter((p) => !!p.deleted === (view === 'trash')), [data, view]);
  const uniq = (values) => [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, 'fr'));
  const cats = useMemo(() => uniq(inView.map((p) => p.category)), [inView]);
  const subs = useMemo(() => uniq(inView.filter((p) => p.category === cat).map((p) => p.sub_category)), [inView, cat]);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    const rows = inView.filter((p) =>
      (!cat || p.category === cat) &&
      (!sub || p.sub_category === sub) &&
      (!s || p.name.toLowerCase().includes(s) || (p.category || '').toLowerCase().includes(s)) &&
      (!dispo || (dispo === 'dispo') === !!p.in_stock) &&
      (stars === '' || (p.rating_count > 0 ? Math.round(p.rating) : 0) === Number(stars)) &&
      (!promo || (promo === 'yes') === p.promo > 0));
    return sort ? [...rows].sort((a, b) => (sort === 'asc' ? a.price - b.price : b.price - a.price)) : rows;
  }, [inView, q, cat, sub, dispo, stars, promo, sort]);

  async function confirm() {
    setBusy(true);
    try {
      const { data } = await ACTIONS[ask.kind].run(ask.p);
      toast.success(data.message);
      setTick((t) => t + 1);
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setAsk(null);
      setBusy(false);
    }
  }

  const st = data?.stats;
  const action = ask && ACTIONS[ask.kind];
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
          <div className="filters">
            <select value={view} onChange={(e) => { setView(e.target.value); setCat(''); setSub(''); }} aria-label="Catalogue ou produits supprimés">
              <option value="">Produits du catalogue</option>
              <option value="trash">Supprimés ({st?.corbeille ?? 0})</option>
            </select>
            <select value={cat} onChange={(e) => { setCat(e.target.value); setSub(''); }} aria-label="Filtrer par catégorie">
              <option value="">Catégorie : toutes</option>
              {cats.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={sub} onChange={(e) => setSub(e.target.value)} disabled={!cat} aria-label="Filtrer par sous-catégorie">
              <option value="">Sous-catégorie : toutes</option>
              {subs.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={dispo} onChange={(e) => setDispo(e.target.value)} aria-label="Filtrer par disponibilité">
              <option value="">Disponibilité : toutes</option>
              <option value="dispo">Disponibles</option>
              <option value="indispo">Indisponibles (rupture)</option>
            </select>
            <select value={stars} onChange={(e) => setStars(e.target.value)} aria-label="Filtrer par nombre d'étoiles">
              <option value="">Étoiles : toutes</option>
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
              <option value="0">Sans avis</option>
            </select>
            <select value={promo} onChange={(e) => setPromo(e.target.value)} aria-label="Filtrer par promotion">
              <option value="">Promotions : toutes</option>
              <option value="yes">En promotion</option>
              <option value="no">Sans promotion</option>
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Trier par prix">
              <option value="">Tri : plus récents</option>
              <option value="asc">Prix croissant</option>
              <option value="desc">Prix décroissant</option>
            </select>
          </div>
          <span className="count">{list.length} produit(s)</span>
        </div>
        <table className="tbl">
          <thead>
            <tr><th>Produit</th><th>Catégorie</th><th className="num">Prix</th><th className="num">Promo</th><th className="num">Stock</th><th>État</th>{onEdit && <th className="right">Action</th>}</tr>
          </thead>
          <tbody>
            {!data && <tr><td colSpan={7} className="empty-row">Chargement…</td></tr>}
            {data && list.length === 0 && <tr><td colSpan={7} className="empty-row">{view === 'trash' ? 'Aucun produit supprimé.' : 'Aucun produit.'}</td></tr>}
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
                  <span className={`status ${p.deleted || !p.in_stock ? 'out' : p.low_stock ? 'low' : 'ok'}`}>
                    {p.deleted ? 'Supprimé' : !p.in_stock ? 'Rupture' : p.low_stock ? 'Stock faible' : 'Disponible'}
                  </span>
                </td>
                {onEdit && (
                  <td className="right"><div className="row-actions">
                    {p.deleted ? (
                      <>
                        <button type="button" className="btn-ok" onClick={() => setAsk({ kind: 'restore', p })}>Restaurer</button>
                        <button type="button" className="btn-danger" onClick={() => setAsk({ kind: 'force', p })}>Supprimer définitivement</button>
                      </>
                    ) : (
                      <>
                        <button type="button" className="btn-ghost" onClick={() => onEdit(p)}>Modifier</button>
                        <button type="button" className="btn-danger" onClick={() => setAsk({ kind: 'delete', p })}>Supprimer</button>
                      </>
                    )}
                  </div></td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!ask} onClose={() => !busy && setAsk(null)} title={action?.title}>
        {ask && <p>{action.text(ask.p)}</p>}
        <div className="dialog-actions">
          <button type="button" className="btn-ghost" onClick={() => setAsk(null)} disabled={busy}>Non</button>
          <Button variant={action?.danger ? 'danger' : 'gold'} size="sm" loading={busy} onClick={confirm}>Oui</Button>
        </div>
      </Modal>
    </>
  );
}
