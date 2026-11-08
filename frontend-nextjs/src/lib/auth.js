import { api } from '@/lib/api';
import { safeInternalPath } from '@/lib/safePath';
import { useAuthStore } from '@/store/authStore';

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  useAuthStore.getState().setSession(data.token, data.user);
  return data;
}

/** Lit ?next=/checkout en n'acceptant QUE des chemins internes (pas de redirection ouverte) */
export function nextPath() {
  return safeInternalPath(new URLSearchParams(window.location.search).get('next'), window.location.origin);
}

export async function register(payload) {
  const { data } = await api.post('/auth/register', payload);
  useAuthStore.getState().setSession(data.token, data.user);
  return data;
}

export async function logout() {
  try {
    await api.post('/auth/logout');
  } catch {
    /* token déjà invalide : rien à faire */
  }
  useAuthStore.getState().clear();
}

export async function refreshMe() {
  if (!useAuthStore.getState().token) return null;
  try {
    const { data } = await api.get('/auth/me');
    useAuthStore.getState().setUser(data);
    return data;
  } catch {
    return null;
  }
}

export const ROLE_LABELS = {
  client: 'Client',
  admin: 'Administrateur',
  responsable_produits: 'Responsable produits',
  responsable_commandes: 'Responsable commandes',
};

export function homeFor(user) {
  return user?.home || '/';
}

export const isStaffPath = (pathname) => /^\/(admin|gestion)(\/|$)/.test(pathname);
