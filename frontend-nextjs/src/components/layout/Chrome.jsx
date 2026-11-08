'use client';
import { usePathname } from 'next/navigation';

/** Pages d'accès (connexion, inscription) : sans barres ni navbar, footer conservé */
const AUTH_PAGES = ['/login', '/register'];

/** Barres et navbar du haut : cachées sur les pages d'accès. À placer dans un <Suspense> (usePathname est lu à la demande). */
export default function Chrome({ children }) {
  return AUTH_PAGES.includes(usePathname()) ? null : children;
}
