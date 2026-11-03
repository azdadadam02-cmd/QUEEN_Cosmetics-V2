<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/** Création / modification d'un utilisateur non-admin par l'admin */
class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
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
        $user     = $this->route('user');            // null en création
        $creating = $user === null;

        return [
            'nom'      => ['required', 'string', 'min:4', 'max:100'],
            'email'    => ['required', 'string', 'email', 'max:150', Rule::unique('utilisateurs', 'email')->ignore($user?->id)],
            'role'     => ['required', Rule::in(User::ROLES_GERABLES)],
            'password' => [$creating ? 'required' : 'nullable', 'string', 'min:8', 'max:72', 'regex:/[A-Z]/'],
        ];
    }

    public function messages(): array
    {
        return [
            'nom.min'           => 'Le nom doit contenir plus de 3 caractères.',
            'nom.*'             => 'Le nom est obligatoire (100 caractères max).',
            'email.unique'      => 'Cette adresse email est déjà utilisée.',
            'email.*'           => 'Adresse email invalide.',
            'role.*'            => 'Rôle invalide.',
            'password.required' => 'Le mot de passe est obligatoire.',
            'password.min'      => 'Le mot de passe doit contenir au moins 8 caractères.',
            'password.regex'    => 'Le mot de passe doit contenir au moins une majuscule.',
            'password.*'        => 'Mot de passe invalide.',
        ];
    }
}
