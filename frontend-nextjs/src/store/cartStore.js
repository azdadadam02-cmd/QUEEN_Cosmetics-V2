/**
 * Panier : reste enregistré même si on change de page ou qu'on ferme l'onglet (localStorage).
 * ⚠ Les prix ici servent seulement à l'affichage : Laravel recalcule TOUT (prix, promo, stock)
 *   via /api/cart/check et au moment de la commande.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const MAX_LIGNES = 30;
export const MAX_QTE = 20;

/** Une ligne = un produit + sa variante (rouge et noir du même rouge à lèvres font deux lignes) */
export const lineKey = (i) => (i.pack_id ? `pack:${i.pack_id}` : `${i.id}:${i.variant_id || 0}`);

const toLine = (l, stock, quantity) => ({
  id: l.id ?? null,
  pack_id: l.pack_id || null,
  products: l.products || null,
  variant_id: l.variant_id || null,
  variant_color: l.variant_color || null,
  variant_size: l.variant_size || null,
  name: l.name,
  price: l.price,
  image_url: l.image_url,
  stock,
  quantity,
});

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      add: (product, qty = 1, variant = null) => {
        const wanted = { ...product, variant_id: variant?.id, variant_color: variant?.color, variant_size: variant?.size };
        const key = lineKey(wanted);
        const items = get().items;
        const found = items.find((i) => lineKey(i) === key);
        const current = found?.quantity || 0;
        const stock = variant ? variant.stock : product.stock ?? found?.stock ?? MAX_QTE;

        if (stock <= 0) return { ok: false, message: `« ${product.name} » est en rupture de stock.` };
        if (!found && items.length >= MAX_LIGNES) return { ok: false, message: `Panier plein (${MAX_LIGNES} produits maximum).` };
        if (current >= MAX_QTE) return { ok: false, message: `Quantité maximale (${MAX_QTE}) atteinte pour « ${product.name} ».` };
        if (current >= stock) return { ok: false, message: `Stock maximum atteint pour « ${product.name} ».` };

        const line = toLine(wanted, stock, Math.min(stock, MAX_QTE, current + Math.max(1, qty)));
        set({ items: found ? items.map((i) => (lineKey(i) === key ? line : i)) : [...items, line] });
        return { ok: true, message: `« ${product.name} » ajouté au panier.` };
      },

      addPack: (pack, qty = 1) => {
        const wanted = { ...pack, pack_id: pack.id, id: null };
        const key = lineKey(wanted);
        const items = get().items;
        const found = items.find((i) => lineKey(i) === key);
        const current = found?.quantity || 0;

        if (pack.stock <= 0) return { ok: false, message: `« ${pack.name} » n'est plus disponible.` };
        if (!found && items.length >= MAX_LIGNES) return { ok: false, message: `Panier plein (${MAX_LIGNES} produits maximum).` };
        if (current >= Math.min(pack.stock, MAX_QTE)) return { ok: false, message: `Quantité maximale atteinte pour « ${pack.name} ».` };

        const line = toLine(wanted, pack.stock, Math.min(pack.stock, MAX_QTE, current + Math.max(1, qty)));
        set({ items: found ? items.map((i) => (lineKey(i) === key ? line : i)) : [...items, line] });
        return { ok: true, message: `« ${pack.name} » ajouté au panier.` };
      },

      setQuantity: (key, quantity) =>
        set({
          items:
            quantity < 1
              ? get().items.filter((i) => lineKey(i) !== key)
              : get().items.map((i) => (lineKey(i) === key ? { ...i, quantity: Math.min(quantity, MAX_QTE, i.stock || MAX_QTE) } : i)),
        }),

      remove: (key) => set({ items: get().items.filter((i) => lineKey(i) !== key) }),
      clear: () => set({ items: [] }),

      syncFromServer: (lines) => set({ items: lines.map((l) => toLine(l, l.stock, l.quantity)) }),

      payload: () => get().items.map(({ id, pack_id, variant_id, quantity }) => (pack_id ? { pack_id, quantity } : { id, variant_id: variant_id || null, quantity })),
    }),
    { name: 'queen-cart', storage: createJSONStorage(() => localStorage) }
  )
);

export const useCartCount = () => useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
