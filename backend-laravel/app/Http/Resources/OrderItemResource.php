<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\OrderItem */
class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'product_id' => $this->produit_id,
            'name'       => $this->product?->nom,
            'image_url'  => $this->product?->image ? asset('images/'.$this->product->image) : null,
            'quantity'   => (int) $this->quantite,
            'unit_price' => (float) $this->prix_unitaire,
            'subtotal'   => round($this->quantite * $this->prix_unitaire, 2),
        ];
    }
}
