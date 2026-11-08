'use client';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/layout/ProductCard';
import Button from '@/components/ui/Button';
import { api, errorMessage } from '@/lib/api';
import { toast } from '@/store/toastStore';

export default function FavoritesPage() {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    api.get('/favorites/products').then(({ data }) => setProducts(data.data ?? data)).catch((e) => toast.error(errorMessage(e)));
  }, []);

  async function remove(id) {
    try {
      await api.post(`/products/${id}/favorite`);
      setProducts((list) => list.filter((p) => p.id !== id));
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }

  return (
    <>
      <h1 className="pf-title">Mon favoris</h1>

      {!products && <p className="loading-line">Chargement…</p>}
      {products?.length === 0 && (
        <div className="empty-state">
          <span className="empty-ico">♥</span>
          <h3>Aucun favori pour le moment</h3>
          <p>Cliquez sur « Favoris » dans la fiche d&apos;un produit pour le retrouver ici.</p>
          <Button href="/products">Découvrir la collection</Button>
        </div>
      )}

      <div className="pf-grid">
        {products?.map((p) => (
          <div key={p.id} className="pf-fav">
            <ProductCard product={p} />
            <button type="button" onClick={() => remove(p.id)} aria-label={`Retirer ${p.name} des favoris`}>♥ Retirer</button>
          </div>
        ))}
      </div>
    </>
  );
}
