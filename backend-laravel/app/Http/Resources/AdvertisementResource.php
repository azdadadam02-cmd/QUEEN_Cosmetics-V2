<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Advertisement */
class AdvertisementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'title'        => $this->titre,
            'reduction'    => (int) $this->reduction,
            'image_url'    => $this->image ? asset('images/'.$this->image) : null,
            'product_id'   => $this->produit_id,
            'product_name' => $this->whenLoaded('product', fn () => $this->product?->nom),
        ];
    }
}
