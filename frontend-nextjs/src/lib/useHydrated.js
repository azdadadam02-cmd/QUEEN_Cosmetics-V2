'use client';
import { usePathname } from 'next/navigation';
import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};
export function useHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

const firstPath = typeof window === 'undefined' ? null : window.location.pathname;

export function useLayoutPathname() {
  const pathname = usePathname();
  return useHydrated() || firstPath === null ? pathname : firstPath;
}
