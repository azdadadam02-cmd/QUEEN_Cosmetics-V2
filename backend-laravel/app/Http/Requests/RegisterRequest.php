<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'nom'   => trim((string) $this->input('nom')),
            'email' => mb_strtolower(trim((string) $this->input('email'))),
        ]);
    }

    public function rules(): array
    {
        return [
            'nom'      => ['required', 'string', 'min:4', 'max:100'],
            'email'    => ['required', 'string', 'email', 'max:150', 'unique:utilisateurs,email'],
            'password' => ['required', 'string', 'min:8', 'max:72', 'regex:/[A-Z]/', 'confirmed'],
        ];
    }

    public function messages(): array
    {
        return [
            'nom.required'       => 'Le nom est obligatoire.',
            'nom.min'            => 'Le nom doit contenir plus de 3 caractères.',
            'nom.max'            => 'Le nom ne doit pas dépasser 100 caractères.',
            'email.unique'       => 'Cette adresse email est déjà utilisée.',
            'email.*'            => 'Adresse email invalide.',
            'password.min'       => 'Le mot de passe doit contenir au moins 8 caractères.',
            'password.max'       => 'Le mot de passe ne doit pas dépasser 72 caractères.',
            'password.regex'     => 'Le mot de passe doit contenir au moins une majuscule.',
            'password.confirmed' => 'Les deux mots de passe ne correspondent pas.',
            'password.required'  => 'Le mot de passe est obligatoire.',
        ];
    }
}
