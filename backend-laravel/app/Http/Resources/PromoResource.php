<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PromoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'text'       => $this->texte,
            'link'       => $this->lien,
            'background' => $this->couleur_fond,
            'color'      => $this->couleur_texte,
            'starts_at'  => $this->date_debut?->toIso8601String(),
            'ends_at'    => $this->date_fin?->toIso8601String(),
            'active'     => (bool) $this->est_actif,
        ];
    }
}
