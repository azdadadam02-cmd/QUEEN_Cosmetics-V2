'use client';
import { useLayoutPathname } from '@/lib/useHydrated';

const AUTH_PAGES = ['/login', '/register'];

export default function Chrome({ children }) {
  return AUTH_PAGES.includes(useLayoutPathname()) ? null : children;
}
