<?php

namespace App\Services;

use App\Models\Pack;
use App\Models\Product;

/**
 * Le panier vit dans le navigateur (Zustand) ; ici on le RE-CALCULE toujours
 * depuis la base : prix (promo comprise) et stock à jour, lignes invalides retirées.
 */
class CartService
{
    public const MAX_LIGNES = 30;
    public const MAX_QTE    = 20;

    public function lines(array $items): array
    {
        $out = ['lines' => [], 'total' => 0.0, 'count' => 0, 'warnings' => []];

        $wanted = [];
        foreach ($items as $it) {
            $id = (int) ($it['id'] ?? 0);
            $q  = (int) ($it['quantity'] ?? 0);
            $packId = (int) ($it['pack_id'] ?? 0);
            if ($packId > 0 && $q > 0) {
                $key = 'pack:'.$packId;
                $wanted[$key] = min(self::MAX_QTE, ($wanted[$key] ?? 0) + $q);
            } elseif ($id > 0 && $q > 0) {
                $key = $id.':'.(int) ($it['variant_id'] ?? 0);
                $wanted[$key] = min(self::MAX_QTE, ($wanted[$key] ?? 0) + $q);
            }
        }
        if (count($wanted) > self::MAX_LIGNES) {
            $wanted = array_slice($wanted, 0, self::MAX_LIGNES, true);
            $out['warnings'][] = 'Panier limité à '.self::MAX_LIGNES.' produits différents.';
        }
        if (! $wanted) {
            return $out;
        }

        $packIds = [];
        foreach (array_keys($wanted) as $k) {
            if (str_starts_with($k, 'pack:')) {
                $packIds[] = (int) substr($k, 5);
            }
        }
        $packs    = Pack::withDetails()->where('est_actif', true)->whereIn('id', $packIds)->get()->keyBy('id');
        $ids      = array_map(fn ($k) => (int) explode(':', $k)[0], array_filter(array_keys($wanted), fn ($k) => ! str_starts_with($k, 'pack:')));
        $products = Product::withPromo()->with('variants')->whereIn('id', $ids)->get()->keyBy('id');

        foreach ($wanted as $key => $qte) {
            if (str_starts_with($key, 'pack:')) {
                $pack = $packs->get((int) substr($key, 5));
                if (! $pack) {
                    $out['warnings'][] = "Un pack n'est plus disponible et a été retiré du panier.";
                    continue;
                }
                $stock = $pack->availableCount();
                if ($stock <= 0) {
                    $out['warnings'][] = "« {$pack->nom} » n'est plus disponible : retiré du panier.";
                    continue;
                }
                if ($qte > $stock) {
                    $qte = $stock;
                    $out['warnings'][] = "Quantité de « {$pack->nom} » ajustée au stock disponible ({$stock}).";
                }
                $out['lines'][] = [
                    'pack_id'   => $pack->id,
                    'name'      => $pack->nom,
                    'image_url' => $pack->image ? asset('images/'.$pack->image) : null,
                    'price'     => (float) $pack->prix_promo,
                    'quantity'  => $qte,
                    'stock'     => $stock,
                    'subtotal'  => round($pack->prix_promo * $qte, 2),
                    'products'  => $pack->products->map(fn ($p) => ['id' => $p->id, 'name' => $p->nom, 'image_url' => $p->imageUrl(), 'quantity' => (int) $p->pivot->quantite])->values(),
                ];
                $out['total'] += $pack->prix_promo * $qte;
                $out['count'] += $qte;
                continue;
            }

            [$id, $variantId] = array_map('intval', explode(':', $key));
            $p = $products->get($id);
            if (! $p) {
                $out['warnings'][] = "Un produit n'existe plus et a été retiré du panier.";
                continue;
            }
            $v = $variantId ? $p->variants->firstWhere('id', $variantId) : null;
            if (($variantId && ! $v) || (! $v && $p->variants->isNotEmpty())) {
                $out['warnings'][] = "Choisissez à nouveau une option pour « {$p->nom} » : retiré du panier.";
                continue;
            }
            $stock = $v ? $v->quantite_stock : $p->quantite_stock;
            if ($stock <= 0) {
                $out['warnings'][] = "« {$p->nom} » n'est plus disponible : retiré du panier.";
                continue;
            }
            if ($qte > $stock) {
                $qte = $stock;
                $out['warnings'][] = "Quantité de « {$p->nom} » ajustée au stock disponible ({$stock}).";
            }

            $prix = $p->finalPrice();
            $out['lines'][] = [
                'id'             => $p->id,
                'variant_id'     => $v?->id,
                'variant_color'  => $v?->couleur,
                'variant_size'   => $v?->sizeLabel(),
                'name'           => $p->nom,
                'category'       => $p->categorie,
                'image_url'      => $p->imageUrl(),
                'price'          => $prix,
                'original_price' => (float) $p->prix,
                'promo'          => $p->promoPercent(),
                'quantity'       => $qte,
                'stock'          => $stock,
                'subtotal'       => round($prix * $qte, 2),
            ];
            $out['total'] += $prix * $qte;
            $out['count'] += $qte;
        }
        $out['total'] = round($out['total'], 2);

        return $out;
    }
}
