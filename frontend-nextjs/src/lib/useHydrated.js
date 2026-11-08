'use client';
import { usePathname } from 'next/navigation';
import { useSyncExternalStore } from 'react';

/** true seulement dans le navigateur, après hydratation (évite les différences serveur / client
 *  pour tout ce qui vient du localStorage : panier, session…) */
const subscribe = () => () => {};
export function useHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

const firstPath = typeof window === 'undefined' ? null : window.location.pathname;

/** usePathname pour les composants du layout racine : tant qu'ils ne sont pas hydratés, renvoie l'URL du
 *  chargement (celle du HTML serveur). Sinon une redirection pendant l'hydratation → erreur d'hydratation. */
export function useLayoutPathname() {
  const pathname = usePathname();
  return useHydrated() || firstPath === null ? pathname : firstPath;
}
