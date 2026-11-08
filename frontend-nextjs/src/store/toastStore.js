/** Messages succès / erreur / info : plus rien ne les affiche (<Toaster /> retiré du layout, à la demande).
 *  Les appels toast.* sont gardés : remettre un composant qui lit useToastStore suffit pour les réactiver. */
import { create } from 'zustand';

let id = 0;
export const useToastStore = create((set, get) => ({
  toasts: [],
  push: (type, message) => {
    const t = { id: ++id, type, message };
    set({ toasts: [...get().toasts, t].slice(-4) });
    setTimeout(() => get().dismiss(t.id), 4500);
  },
  dismiss: (tid) => set({ toasts: get().toasts.filter((t) => t.id !== tid) }),
}));

export const toast = {
  success: (m) => useToastStore.getState().push('success', m),
  error: (m) => useToastStore.getState().push('error', m),
  info: (m) => useToastStore.getState().push('info', m),
};
