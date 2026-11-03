<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

/** Publicité du carrousel (admin) : titre, réduction %, image, produit lié (promo) */
class AdvertisementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'titre'      => trim((string) $this->input('titre')),
            'reduction'  => $this->filled('reduction') ? $this->input('reduction') : 0,
            'produit_id' => $this->filled('produit_id') && (int) $this->input('produit_id') > 0 ? $this->input('produit_id') : null,
        ]);
    }

    public function rules(): array
    {
        return [
            'titre'      => ['required', 'string', 'max:100'],
            'reduction'  => ['integer', 'min:0', 'max:90'],
            'produit_id' => ['nullable', 'integer', 'exists:produits,id'],
            'image'      => ['nullable', 'file', 'mimetypes:image/jpeg,image/png,image/webp,image/gif', 'max:3072', 'dimensions:max_width=6000,max_height=6000'],
        ];
    }

    public function after(): array
    {
        return [function (Validator $v) {
            if ($this->input('produit_id') && (int) $this->input('reduction') === 0) {
                $v->errors()->add('reduction', 'Pour lier un produit, indiquez une réduction supérieure à 0.');
            }
        }];
    }

    public function messages(): array
    {
        return [
            'titre.*'           => 'Le titre est obligatoire (100 caractères max).',
            'reduction.*'       => 'La réduction doit être un entier entre 0 et 90 (0 = pas de badge).',
            'produit_id.exists' => 'Produit introuvable.',
            'image.mimetypes'   => "Format d'image non accepté (JPG, PNG, WEBP ou GIF).",
            'image.max'         => "L'image ne doit pas dépasser 3 Mo.",
            'image.*'           => 'Image invalide ou trop grande (6000 px maximum).',
        ];
    }
}
