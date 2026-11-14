'use client';
import { useEffect, useState } from 'react';
import { api, errorMessage } from '@/lib/api';
import { useHydrated } from '@/lib/useHydrated';
import { useAuthStore } from '@/store/authStore';

/** Favori du client connecté + compteur public. onError reçoit le message si l'API refuse. */
export function useFavorite(productId, initialLoves, onError) {
  const hydrated = useHydrated();
  const user = useAuthStore((s) => s.user);
  const [fav, setFav] = useState(false);
  const [loves, setLoves] = useState(initialLoves || 0);
  const isClient = hydrated && user?.role === 'client';

  useEffect(() => {
    if (!isClient) return;
    api.get('/favorites').then(({ data }) => setFav(data.includes(productId))).catch(() => {});
  }, [isClient, productId]);

  async function toggle() {
    if (!user) return window.open(`/login?next=/products/${productId}`, '_blank', 'noopener');   // la connexion s'ouvre dans un nouvel onglet, la fiche reste ouverte
    try {
      const { data } = await api.post(`/products/${productId}/favorite`);
      setFav(data.favorite);
      setLoves(data.loves);
    } catch (err) {
      onError(errorMessage(err));
    }
  }

  return { fav, loves, toggle };
}
