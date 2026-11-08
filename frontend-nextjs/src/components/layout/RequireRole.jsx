'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useHydrated } from '@/lib/useHydrated';
import { useAuthStore } from '@/store/authStore';

export default function RequireRole({ roles, children }) {
  const hydrated = useHydrated();
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const allowed = user && roles.includes(user.role);

  useEffect(() => {
    if (!hydrated || allowed) return;
    if (!user) router.replace(`/login?next=${encodeURIComponent(window.location.pathname)}`);
    else router.replace(user.home || '/');
  }, [hydrated, allowed, user, router]);

  if (!hydrated || !allowed) return <p className="loading-line">Chargement…</p>;
  return children;
}
