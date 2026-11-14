<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'product_id' => $this->produit_id,
            'id'         => $this->id,
            'name'       => $this->product?->nom,
            'pack_name'  => $this->pack?->nom,
            'variant_color' => $this->variant?->couleur,
            'variant_size'  => $this->variant?->sizeLabel(),
            'image_url'  => $this->product?->image ? asset('images/'.$this->product->image) : null,
            'quantity'   => (int) $this->quantite,
            'unit_price' => (float) $this->prix_unitaire,
            'subtotal'   => round($this->quantite * $this->prix_unitaire, 2),
        ];
    }
}
