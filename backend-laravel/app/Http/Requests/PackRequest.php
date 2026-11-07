<?php

namespace App\Http\Requests;

use App\Models\ProductVariant;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

/** Ajout / modification d'un pack (responsable produits ou admin). Formulaire multipart : les produits arrivent en JSON. */
class PackRequest extends FormRequest
{
    public function authorize(): bool
    {
        return in_array($this->user()?->role, ['responsable_produits', 'admin'], true);
    }

    protected function prepareForValidation(): void
    {
        $products = json_decode((string) $this->input('products', '[]'), true);

        $this->merge([
            'nom'          => trim((string) $this->input('nom')),
            'description'  => trim((string) $this->input('description')) ?: null,
            'texte_bouton' => trim((string) $this->input('texte_bouton')) ?: 'Voir le pack',
            'prix_promo'   => str_replace(',', '.', trim((string) $this->input('prix_promo'))),
            'products'     => is_array($products) ? $products : [],
        ]);
    }

    public function rules(): array
    {
        $color = ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'];

        return [
            'nom'           => ['required', 'string', 'max:150'],
            'description'   => ['nullable', 'string', 'max:1000'],
            'prix_promo'    => ['required', 'numeric', 'gt:0', 'max:99999999'],
            'couleur_fond'  => $color,
            'couleur_texte' => $color,
            'texte_bouton'  => ['string', 'max:40'],
            'est_actif'     => ['required', 'boolean'],
            'image'         => ['nullable', 'file', 'mimetypes:image/jpeg,image/png,image/webp,image/gif', 'max:3072', 'dimensions:max_width=6000,max_height=6000'],

            'products'            => ['required', 'array', 'min:1', 'max:20'],
            'products.*.id'       => ['required', 'integer', 'distinct', 'exists:produits,id'],
            'products.*.quantite' => ['required', 'integer', 'min:1', 'max:20'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $v) {
            $ids = array_filter(array_map(fn ($r) => is_array($r) ? (int) ($r['id'] ?? 0) : 0, (array) $this->input('products', [])));
            if ($ids && ProductVariant::whereIn('produit_id', $ids)->exists()) {
                $v->errors()->add('products', 'Un pack ne peut pas contenir un produit à variantes (couleur ou taille).');
            }
        });
    }

    public function messages(): array
    {
        return [
            'nom.*'           => 'Le nom est obligatoire (150 caractères max).',
            'description.*'   => 'La description ne doit pas dépasser 1000 caractères.',
            'prix_promo.*'    => 'Le prix doit être un nombre supérieur à 0.',
            'couleur_fond.*'  => 'Couleur du fond invalide.',
            'couleur_texte.*' => 'Couleur du texte invalide.',
            'texte_bouton.*'  => 'Le texte du bouton ne doit pas dépasser 40 caractères.',
            'image.mimetypes' => "Format d'image non accepté (JPG, PNG, WEBP ou GIF).",
            'image.max'       => "L'image ne doit pas dépasser 3 Mo.",
            'image.*'         => 'Image invalide ou trop grande (6000 px maximum).',
            'products.required' => 'Ajoutez au moins un produit au pack.',
            'products.min'      => 'Ajoutez au moins un produit au pack.',
            'products.max'      => 'Un pack contient 20 produits au maximum.',
            'products.*.id.*'   => 'Un produit du pack est invalide ou ajouté deux fois.',
            'products.*.quantite.*' => 'La quantité de chaque produit doit être entre 1 et 20.',
        ];
    }
}
