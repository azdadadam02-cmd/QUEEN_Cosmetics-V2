<?php

namespace App\Http\Requests;

use App\Services\CartService;
use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'client';
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'telephone' => preg_replace('/[\s.\-]/', '', (string) $this->input('telephone')),
            'nom'       => trim((string) $this->input('nom')),
            'ville'     => trim((string) $this->input('ville')),
            'adresse'   => trim((string) $this->input('adresse')),
        ]);
    }

    public function rules(): array
    {
        return [
            'items'            => ['required', 'array', 'min:1', 'max:'.CartService::MAX_LIGNES],
            'items.*.id'       => ['nullable', 'required_without:items.*.pack_id', 'integer', 'exists:produits,id'],
            'items.*.pack_id'  => ['nullable', 'integer', 'exists:packs,id'],
            'items.*.variant_id' => ['nullable', 'integer', 'min:1'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:'.CartService::MAX_QTE],

            'nom'       => ['required', 'string', 'min:3', 'max:100'],
            'telephone' => ['required', 'regex:/^(\+212|00212|0)[5-7]\d{8}$/'],
            'ville'     => ['required', 'string', 'min:2', 'max:80'],
            'adresse'   => ['required', 'string', 'min:8', 'max:255'],
            'majeur'    => ['accepted'],
        ];
    }

    public function messages(): array
    {
        return [
            'items.required'     => 'Votre panier est vide.',
            'items.min'          => 'Votre panier est vide.',
            'items.max'          => 'Panier limité à '.CartService::MAX_LIGNES.' produits différents.',
            'items.*.id.exists'  => "Un produit de votre panier n'existe plus.",
            'items.*.pack_id.*'  => "Un pack de votre panier n'existe plus.",
            'items.*.variant_id.*' => 'Option de produit invalide.',
            'items.*.quantity.*' => 'Quantité invalide (1 à '.CartService::MAX_QTE.' par produit).',
            'nom.*'              => 'Indiquez le nom de la personne qui réceptionne (3 à 100 caractères).',
            'telephone.*'        => 'Numéro de téléphone invalide (ex : 06 12 34 56 78).',
            'ville.*'            => 'Indiquez votre ville.',
            'adresse.*'          => 'Indiquez votre adresse complète (rue, n°, quartier — 8 caractères minimum).',
            'majeur.accepted'    => 'Vous devez confirmer avoir 18 ans ou plus pour passer commande.',
        ];
    }
}
