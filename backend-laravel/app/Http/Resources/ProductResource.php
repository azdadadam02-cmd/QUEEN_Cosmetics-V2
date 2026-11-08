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
            'details'        => $this->details,
            'brand'          => $this->marque,
            'sub_category'   => $this->sous_categorie,
            'age_range'      => $this->tranche_age,
            'gallery'        => $this->whenLoaded('images', fn () => $this->images->sortBy('ordre_affichage')->values()->map(fn ($i) => ['id' => $i->id, 'url' => asset('images/'.$i->chemin_image)])),
            'variants'       => $this->whenLoaded('variants', fn () => $this->variants->map(fn ($v) => [
                'id'              => $v->id,
                'color'           => $v->couleur,
                'size'            => $v->sizeLabel(),
                'stock'           => $v->quantite_stock,
                'taille'          => $v->taille,
                'volume_ml'       => $v->volume_ml,
                'poids_g'         => $v->poids_g,
                'quantite_pieces' => $v->quantite_pieces,
            ])),
            'buyers'         => $this->when($this->buyers_count !== null, fn () => (int) $this->buyers_count),
            'loves'          => $this->when($this->loves_count !== null, fn () => (int) $this->loves_count),
            'rating'         => round((float) ($this->rating_avg ?? 0), 1),   // moyenne des avis approuvés
            'rating_count'   => (int) ($this->rating_count ?? 0),
            'stock'          => $stock,
            'deleted'        => $this->trashed(),             // en corbeille (visible seulement au back-office)
            'in_stock'       => $stock > 0,
            'low_stock'      => $stock > 0 && $stock <= 5,
            'image'          => $this->image,
            'image_url'      => $this->imageUrl(),
        ];
    }
}
