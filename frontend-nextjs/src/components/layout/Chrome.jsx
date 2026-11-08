'use client';
import { useLayoutPathname } from '@/lib/useHydrated';

const AUTH_PAGES = ['/login', '/register'];

/** Barres et navbar du haut : cachées sur les pages d'accès. À placer dans un <Suspense> (le chemin est lu à la demande). */
export default function Chrome({ children }) {
  return AUTH_PAGES.includes(useLayoutPathname()) ? null : children;
}
