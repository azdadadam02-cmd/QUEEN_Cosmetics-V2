/** Session de l'utilisateur : token Sanctum + infos (nom, email, rôle). Persisté dans le navigateur. */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: (token, user) => set({ token, user }),
      setUser: (user) => set({ user }),
      clear: () => set({ token: null, user: null }),
    }),
    { name: 'queen-auth', storage: createJSONStorage(() => localStorage) }
  )
);
