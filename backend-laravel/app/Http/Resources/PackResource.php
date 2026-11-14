<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PackResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->nom,
            'description' => $this->description,
            'image_url'   => $this->image ? asset('images/'.$this->image) : null,
            'price'       => (float) $this->prix_promo,
            'value'       => $this->separateValue(),
            'background'  => $this->couleur_fond,
            'color'       => $this->couleur_texte,
            'button'      => $this->texte_bouton,
            'active'      => (bool) $this->est_actif,
            'stock'       => $this->availableCount(),
            'products'    => $this->products->map(fn ($p) => [
                'id'        => $p->id,
                'name'      => $p->nom,
                'brand'        => $p->marque,
                'category'     => $p->categorie,
                'sub_category' => $p->sous_categorie,
                'image_url' => $p->imageUrl(),
                'price'     => $p->finalPrice(),
                'quantity'  => (int) $p->pivot->quantite,
            ])->values(),
        ];
    }
}
