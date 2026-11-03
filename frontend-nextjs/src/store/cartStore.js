/**
 * Panier : reste enregistré même si on change de page ou qu'on ferme l'onglet (localStorage).
 * ⚠ Les prix ici servent seulement à l'affichage : Laravel recalcule TOUT (prix, promo, stock)
 *   via /api/cart/check et au moment de la commande.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const MAX_LIGNES = 30; // produits différents
export const MAX_QTE = 20; // par produit

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // [{ id, name, price, image_url, stock, quantity }]

      /** @returns {{ok: boolean, message: string}} */
      add: (product, qty = 1) => {
        const items = get().items;
        const found = items.find((i) => i.id === product.id);
        const current = found?.quantity || 0;
        const stock = product.stock ?? found?.stock ?? MAX_QTE;

        if (stock <= 0) return { ok: false, message: `« ${product.name} » est en rupture de stock.` };
        if (!found && items.length >= MAX_LIGNES) return { ok: false, message: `Panier plein (${MAX_LIGNES} produits maximum).` };
        if (current >= MAX_QTE) return { ok: false, message: `Quantité maximale (${MAX_QTE}) atteinte pour « ${product.name} ».` };
        if (current >= stock) return { ok: false, message: `Stock maximum atteint pour « ${product.name} ».` };

        const quantity = Math.min(stock, MAX_QTE, current + Math.max(1, qty));
        const line = { id: product.id, name: product.name, price: product.price, image_url: product.image_url, stock, quantity };
        set({ items: found ? items.map((i) => (i.id === product.id ? { ...i, ...line } : i)) : [...items, line] });
        return { ok: true, message: `« ${product.name} » ajouté au panier.` };
      },

      setQuantity: (id, quantity) =>
        set({
          items:
            quantity < 1
              ? get().items.filter((i) => i.id !== id)
              : get().items.map((i) => (i.id === id ? { ...i, quantity: Math.min(quantity, MAX_QTE, i.stock || MAX_QTE) } : i)),
        }),

      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      clear: () => set({ items: [] }),

      /** Remplace le panier par la version vérifiée par Laravel (prix / stock à jour) */
      syncFromServer: (lines) =>
        set({
          items: lines.map((l) => ({ id: l.id, name: l.name, price: l.price, image_url: l.image_url, stock: l.stock, quantity: l.quantity })),
        }),

      /** Format envoyé à l'API */
      payload: () => get().items.map(({ id, quantity }) => ({ id, quantity })),
    }),
    { name: 'queen-cart', storage: createJSONStorage(() => localStorage) }
  )
);

/** Nombre total d'articles (pour le badge de la navbar) */
export const useCartCount = () => useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
