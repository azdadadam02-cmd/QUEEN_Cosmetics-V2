'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import FormError from '@/components/ui/FormError';
import { api, errorMessage } from '@/lib/api';
import { EMPTY_FILTERS, filterProducts, productsInView, uniqSorted } from '@/lib/productFilters';
import { useSubmit } from '@/lib/useSubmit';
import ProductActionDialog, { ACTIONS } from './products-table/ProductActionDialog';
import ProductFilters from './products-table/ProductFilters';
import ProductRow from './products-table/ProductRow';
import ProductStats from './products-table/ProductStats';

/** Tableau des produits + stats. onEdit absent = lecture seule (admin) */
export default function ProductsTable({ onEdit, reloadKey = 0, onLoaded }) {
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [tick, setTick] = useState(0);
  const [ask, setAsk] = useState(null);
  const req = useSubmit();
  const { busy, setError: setLoadError } = req;

  const onLoadedRef = useRef(onLoaded);
  useEffect(() => {
    onLoadedRef.current = onLoaded;
  });

  // Recharge à l'ouverture, après chaque enregistrement (reloadKey) et après chaque suppression / restauration (tick)
  useEffect(() => {
    let alive = true;
    api
      .get('/manage/products')
      .then(({ data }) => {
        if (!alive) return;
        setData(data);
        onLoadedRef.current?.(data);
      })
      .catch((e) => setLoadError(errorMessage(e)));
    return () => {
      alive = false;
    };
  }, [reloadKey, tick, setLoadError]);

  // Catégories (puis sous-catégories de la catégorie choisie) proposées : celles des produits de la vue en cours
  const inView = useMemo(() => productsInView(data?.products || [], filters.view), [data, filters.view]);
  const cats = useMemo(() => uniqSorted(inView.map((p) => p.category)), [inView]);
  const subs = useMemo(() => uniqSorted(inView.filter((p) => p.category === filters.cat).map((p) => p.sub_category)), [inView, filters.cat]);
  const list = useMemo(() => filterProducts(inView, filters), [inView, filters]);

  async function confirm() {
    await req.run(() => ACTIONS[ask.kind].run(ask.p), () => setTick((t) => t + 1));
    setAsk(null);
  }

  return (
    <>
      <FormError message={req.error} />
      {data?.stats && <ProductStats stats={data.stats} />}
      <div className="panel tablewrap">
        <ProductFilters filters={filters} onChange={setFilters} cats={cats} subs={subs} trashCount={data?.stats?.corbeille} count={list.length} />
        <table className="tbl">
          <thead>
            <tr><th>Produit</th><th>Catégorie</th><th className="num">Prix</th><th className="num">Promo</th><th className="num">Stock</th><th>État</th>{onEdit && <th className="right">Action</th>}</tr>
          </thead>
          <tbody>
            {!data && <tr><td colSpan={7} className="empty-row">Chargement…</td></tr>}
            {data && list.length === 0 && <tr><td colSpan={7} className="empty-row">{filters.view === 'trash' ? 'Aucun produit supprimé.' : 'Aucun produit.'}</td></tr>}
            {list.map((p) => <ProductRow key={p.id} product={p} onEdit={onEdit} onAsk={(kind, product) => setAsk({ kind, p: product })} />)}
          </tbody>
        </table>
      </div>
      <ProductActionDialog ask={ask} busy={busy} onCancel={() => setAsk(null)} onConfirm={confirm} />
    </>
  );
}
