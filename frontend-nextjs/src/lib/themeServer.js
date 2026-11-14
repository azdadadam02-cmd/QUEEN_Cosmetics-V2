import { cacheLife, cacheTag } from 'next/cache';
import { API_URL } from '@/lib/serverApi';

/**
 * Apparence du site, gardée en cache par Next : Laravel n'est interrogé qu'une fois, pas à chaque page.
 * Le cache ne se vide que quand l'admin enregistre (refreshTheme, tag « theme »).
 * Une erreur est volontairement relancée : une réponse en échec ne doit jamais être mise en cache.
 */
export async function getTheme() {
  'use cache';
  cacheLife('max');
  cacheTag('theme');

  const res = await fetch(`${API_URL}/api/theme`, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`API ${res.status} sur /theme`);
  return res.json();
}
