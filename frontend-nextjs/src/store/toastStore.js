/** Messages éphémères (succès / erreur / info) — remplace les « flash » de l'ancien site */
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
