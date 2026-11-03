/**
 * Connexion / inscription / déconnexion.
 * Le token Sanctum est gardé dans le store auth (persisté dans le navigateur).
 */
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  useAuthStore.getState().setSession(data.token, data.user);
  return data; // { message, token, user }
}

export async function register(payload) {
  // payload : { nom, email, password, password_confirmation }
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

/** Relit l'utilisateur (et son rôle) depuis la base */
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

/** Page d'accueil de chaque rôle */
export function homeFor(user) {
  return user?.home || '/';
}
