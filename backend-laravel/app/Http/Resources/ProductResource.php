<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Forme JSON d'un produit envoyée à Next.js.
 * La base reste en français (nom, prix, quantite_stock…), l'API parle « propre ».
 *
 * @mixin \App\Models\Product
 */
class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $stock = (int) $this->quantite_stock;
        $promo = $this->promoPercent();

        return [
            'id'             => $this->id,
            'name'           => $this->nom,
            'category'       => $this->categorie,
            'price'          => $this->finalPrice(),          // prix payé (promo comprise)
            'original_price' => (float) $this->prix,          // prix barré si promo > 0
            'promo'          => $promo,                       // % (0 = pas de promo)
            'own_promotion'  => (int) $this->promotion,       // promo saisie sur le produit (back-office)
            'stock'          => $stock,
            'in_stock'       => $stock > 0,
            'low_stock'      => $stock > 0 && $stock <= 5,
            'image'          => $this->image,
            'image_url'      => $this->imageUrl(),
        ];
    }
}
