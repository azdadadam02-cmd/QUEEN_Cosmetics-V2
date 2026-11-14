import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

import { API_URL } from '@/lib/serverApi';

export { API_URL };

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { Accept: 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Token expiré / supprimé → on déconnecte proprement côté navigateur
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && useAuthStore.getState().token) {
      useAuthStore.getState().clear();
    }
    return Promise.reject(error);
  }
);

export function errorMessage(error, fallback = 'Une erreur est survenue. Réessayez.') {
  const data = error?.response?.data;
  if (data?.errors) return Object.values(data.errors).flat().join(' ');
  if (data?.message) return data.message;
  if (error?.code === 'ERR_NETWORK') return "Impossible de joindre le serveur (l'API Laravel est-elle lancée ?).";
  return fallback;
}

export function fieldErrors(error) {
  const errs = error?.response?.data?.errors || {};
  return Object.fromEntries(Object.entries(errs).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]));
}
