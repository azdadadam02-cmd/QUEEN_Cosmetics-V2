<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Usp */
class UspResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'     => $this->id,
            'icon'   => $this->icone,
            'text'   => $this->texte,
            'link'   => $this->lien,
            'order'  => (int) $this->ordre_affichage,
            'active' => (bool) $this->est_actif,
        ];
    }
}
