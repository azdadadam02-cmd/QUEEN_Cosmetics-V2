<?php

namespace App\Services;

use App\Models\Product;

/**
 * Le panier vit dans le navigateur (Zustand) ; ici on le RE-CALCULE toujours
 * depuis la base : prix (promo comprise) et stock à jour, lignes invalides retirées.
 */
class CartService
{
    public const MAX_LIGNES = 30;   // produits différents
    public const MAX_QTE    = 20;   // par produit

    /**
     * @param  array<int, array{id:int, quantity:int}>  $items
     * @return array{lines: array, total: float, count: int, warnings: string[]}
     */
    public function lines(array $items): array
    {
        $out = ['lines' => [], 'total' => 0.0, 'count' => 0, 'warnings' => []];

        // Regroupe les doublons et applique les limites
        $wanted = [];
        foreach ($items as $it) {
            $id = (int) ($it['id'] ?? 0);
            $q  = (int) ($it['quantity'] ?? 0);
            if ($id > 0 && $q > 0) {
                $wanted[$id] = min(self::MAX_QTE, ($wanted[$id] ?? 0) + $q);
            }
        }
        if (count($wanted) > self::MAX_LIGNES) {
            $wanted = array_slice($wanted, 0, self::MAX_LIGNES, true);
            $out['warnings'][] = 'Panier limité à '.self::MAX_LIGNES.' produits différents.';
        }
        if (! $wanted) {
            return $out;
        }

        $products = Product::withPromo()->whereIn('id', array_keys($wanted))->get()->keyBy('id');

        foreach ($wanted as $id => $qte) {
            $p = $products->get($id);
            if (! $p) {
                $out['warnings'][] = "Un produit n'existe plus et a été retiré du panier.";
                continue;
            }
            if ($p->quantite_stock <= 0) {
                $out['warnings'][] = "« {$p->nom} » n'est plus disponible : retiré du panier.";
                continue;
            }
            if ($qte > $p->quantite_stock) {
                $qte = $p->quantite_stock;
                $out['warnings'][] = "Quantité de « {$p->nom} » ajustée au stock disponible ({$p->quantite_stock}).";
            }

            $prix = $p->finalPrice();
            $out['lines'][] = [
                'id'             => $p->id,
                'name'           => $p->nom,
                'category'       => $p->categorie,
                'image_url'      => $p->imageUrl(),
                'price'          => $prix,
                'original_price' => (float) $p->prix,
                'promo'          => $p->promoPercent(),
                'quantity'       => $qte,
                'stock'          => $p->quantite_stock,
                'subtotal'       => round($prix * $qte, 2),
            ];
            $out['total'] += $prix * $qte;
            $out['count'] += $qte;
        }
        $out['total'] = round($out['total'], 2);

        return $out;
    }
}
