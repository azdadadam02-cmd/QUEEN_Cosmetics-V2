<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class ProductRequest extends FormRequest
{
    public const MAX_GALLERY = 10;
    private const IMAGE = ['file', 'mimetypes:image/jpeg,image/png,image/webp,image/gif', 'max:3072', 'dimensions:max_width=6000,max_height=6000'];

    public function authorize(): bool
    {
        return $this->user()?->role === 'responsable_produits';
    }

    protected function prepareForValidation(): void
    {
        $clean = fn (string $k) => trim((string) $this->input($k)) ?: null;
        $variants = json_decode((string) $this->input('variants', '[]'), true);

        $this->merge([
            'nom'            => trim((string) $this->input('nom')),
            'categorie'      => $clean('categorie'),
            'sous_categorie' => $clean('sous_categorie'),
            'marque'         => $clean('marque'),
            'tranche_age'    => $clean('tranche_age'),
            'details'        => $clean('details'),
            'prix'           => str_replace(',', '.', trim((string) $this->input('prix'))),
            'promotion'      => $this->filled('promotion') ? $this->input('promotion') : 0,
            // Prix de variante : « 12,5 » accepté, vide = prix du produit
            'variants'       => is_array($variants) ? array_map(fn ($r) => is_array($r) && isset($r['prix']) ? ['prix' => trim(str_replace(',', '.', (string) $r['prix'])) ?: null] + $r : $r, $variants) : [],
        ]);
    }

    public function rules(): array
    {
        return [
            'nom'            => ['required', 'string', 'max:100'],
            'categorie'      => ['nullable', 'string', 'max:50'],
            'sous_categorie' => ['nullable', 'string', 'max:100'],
            'marque'         => ['nullable', 'string', 'max:100'],
            'tranche_age'    => ['nullable', 'string', 'max:50'],
            'details'        => ['nullable', 'string', 'max:5000'],
            'prix'           => ['required', 'numeric', 'gt:0', 'max:99999999'],
            'stock'          => ['required', 'integer', 'min:0', 'max:1000000'],
            'promotion'      => ['integer', 'min:0', 'max:90'],
            // Vrai contrôle d'image (contenu, pas l'extension) : 3 Mo max, 6000 px max
            'image'          => ['nullable', ...self::IMAGE],
            'gallery'        => ['array', 'max:'.self::MAX_GALLERY],
            'gallery.*'      => self::IMAGE,
            'remove_images'   => ['array'],
            'remove_images.*' => ['integer'],

            'variants'                   => ['array', 'max:30'],
            'variants.*.id'              => ['nullable', 'integer'],
            'variants.*.couleur'         => ['nullable', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'variants.*.taille'          => ['nullable', 'string', 'max:20'],
            'variants.*.volume_ml'       => ['nullable', 'integer', 'min:1', 'max:1000000'],
            'variants.*.poids_g'         => ['nullable', 'integer', 'min:1', 'max:1000000'],
            'variants.*.quantite_pieces' => ['nullable', 'integer', 'min:1', 'max:1000000'],
            'variants.*.stock'           => ['required', 'integer', 'min:0', 'max:1000000'],
            'variants.*.prix'            => ['nullable', 'numeric', 'min:0', 'max:1000000'],
        ];
    }

    /** Une variante est SOIT une couleur, SOIT une taille (jamais les deux), et deux variantes identiques ne peuvent pas être choisies par le client */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $v) {
            $seen = [];
            foreach ((array) $this->input('variants', []) as $i => $r) {
                if (! is_array($r)) {
                    continue;
                }
                $sig = [$r['couleur'] ?? null, $r['taille'] ?? null, $r['volume_ml'] ?? null, $r['poids_g'] ?? null, $r['quantite_pieces'] ?? null];
                $hasSize = (bool) array_filter(array_slice($sig, 1));
                if (! array_filter($sig)) {
                    $v->errors()->add("variants.$i", 'Chaque variante doit avoir une couleur ou une taille.');
                } elseif ($sig[0] && $hasSize) {
                    $v->errors()->add("variants.$i", 'Une variante est soit une couleur, soit une taille : ajoutez-les dans deux lignes séparées.');
                } elseif (in_array($sig, $seen)) {
                    $v->errors()->add("variants.$i", 'Deux variantes sont identiques.');
                }
                $seen[] = $sig;
            }
        });
    }

    public function messages(): array
    {
        return [
            'nom.*'           => 'Le nom est obligatoire (100 caractères max).',
            'categorie.*'     => 'La catégorie ne doit pas dépasser 50 caractères.',
            'sous_categorie.*' => 'La sous-catégorie ne doit pas dépasser 100 caractères.',
            'marque.*'        => 'La marque ne doit pas dépasser 100 caractères.',
            'tranche_age.*'   => "La tranche d'âge ne doit pas dépasser 50 caractères.",
            'details.*'       => 'La description ne doit pas dépasser 5000 caractères.',
            'prix.*'          => 'Le prix doit être un nombre supérieur à 0.',
            'stock.*'         => 'La quantité en stock doit être un entier positif ou nul.',
            'promotion.*'     => 'La promotion doit être un entier entre 0 et 90 (0 = aucune).',
            'image.mimetypes' => "Format d'image non accepté (JPG, PNG, WEBP ou GIF).",
            'image.max'       => "L'image ne doit pas dépasser 3 Mo.",
            'image.*'         => 'Image invalide ou trop grande (6000 px maximum).',
            'gallery.max'     => 'Galerie limitée à '.self::MAX_GALLERY.' images.',
            'gallery.*.*'     => 'Image de galerie invalide (JPG, PNG, WEBP ou GIF, 3 Mo maximum).',
            'variants.*.couleur.*' => 'Couleur de variante invalide.',
            'variants.*.taille.*'  => 'Taille de variante trop longue (20 caractères max).',
            'variants.*.stock.*'   => 'Indiquez le stock de chaque variante (0 ou plus).',
            'variants.*.prix.*'    => 'Prix de variante invalide (nombre positif, vide = prix du produit).',
            'variants.*.*'         => 'Valeur de variante invalide (nombre entier positif attendu).',
        ];
    }
}
