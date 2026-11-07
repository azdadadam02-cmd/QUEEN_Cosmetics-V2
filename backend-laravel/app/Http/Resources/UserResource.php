<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\User — jamais le mot de passe */
class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'name'         => $this->nom,
            'email'        => $this->email,
            'image_url'    => $this->image ? asset('images/'.$this->image) : null,
            'role'         => $this->role,
            'home'         => $this->homePath(),
            'orders_count' => $this->whenCounted('orders'),
        ];
    }
}
