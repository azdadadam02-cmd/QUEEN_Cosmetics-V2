<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/** Ajout / modification d'un produit (responsable produits). Image optionnelle en modification. */
class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'responsable_produits';
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'nom'       => trim((string) $this->input('nom')),
            'categorie' => trim((string) $this->input('categorie')) ?: null,
            'prix'      => str_replace(',', '.', trim((string) $this->input('prix'))),
            'promotion' => $this->filled('promotion') ? $this->input('promotion') : 0,
        ]);
    }

    public function rules(): array
    {
        return [
            'nom'       => ['required', 'string', 'max:100'],
            'categorie' => ['nullable', 'string', 'max:50'],
            'prix'      => ['required', 'numeric', 'gt:0', 'max:99999999'],
            'stock'     => ['required', 'integer', 'min:0', 'max:1000000'],
            'promotion' => ['integer', 'min:0', 'max:90'],
            // Vrai contrôle d'image (contenu, pas l'extension) : 3 Mo max, 6000 px max
            'image'     => ['nullable', 'file', 'mimetypes:image/jpeg,image/png,image/webp,image/gif', 'max:3072', 'dimensions:max_width=6000,max_height=6000'],
        ];
    }

    public function messages(): array
    {
        return [
            'nom.*'           => 'Le nom est obligatoire (100 caractères max).',
            'categorie.*'     => 'La catégorie ne doit pas dépasser 50 caractères.',
            'prix.*'          => 'Le prix doit être un nombre supérieur à 0.',
            'stock.*'         => 'La quantité en stock doit être un entier positif ou nul.',
            'promotion.*'     => 'La promotion doit être un entier entre 0 et 90 (0 = aucune).',
            'image.mimetypes' => "Format d'image non accepté (JPG, PNG, WEBP ou GIF).",
            'image.max'       => "L'image ne doit pas dépasser 3 Mo.",
            'image.*'         => 'Image invalide ou trop grande (6000 px maximum).',
        ];
    }
}
