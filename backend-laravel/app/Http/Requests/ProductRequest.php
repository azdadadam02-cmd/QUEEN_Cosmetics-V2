<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

/** Ajout / modification d'un produit (responsable produits). Image optionnelle en modification. */
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
        // Formulaire multipart : les variantes arrivent en JSON
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
            'variants'       => is_array($variants) ? $variants : [],
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
        ];
    }

    /** Une variante sans couleur ni taille, ou deux variantes identiques, ne peuvent pas être choisies par le client */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $v) {
            $seen = [];
            foreach ((array) $this->input('variants', []) as $i => $r) {
                if (! is_array($r)) {
                    continue;
                }
                $sig = [$r['couleur'] ?? null, $r['taille'] ?? null, $r['volume_ml'] ?? null, $r['poids_g'] ?? null, $r['quantite_pieces'] ?? null];
                if (! array_filter($sig)) {
                    $v->errors()->add("variants.$i", 'Chaque variante doit avoir une couleur ou une taille.');
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
            'variants.*.*'         => 'Valeur de variante invalide (nombre entier positif attendu).',
        ];
    }
}
