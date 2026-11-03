'use client';
import { useSyncExternalStore } from 'react';

/** true seulement dans le navigateur, après hydratation (évite les différences serveur / client
 *  pour tout ce qui vient du localStorage : panier, session…) */
const subscribe = () => () => {};
export function useHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
