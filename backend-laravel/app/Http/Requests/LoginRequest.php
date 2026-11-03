<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge(['email' => mb_strtolower(trim((string) $this->input('email')))]);
    }

    public function rules(): array
    {
        return [
            'email'    => ['required', 'string', 'email', 'max:150'],
            'password' => ['required', 'string', 'max:72'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.*'    => 'Adresse email invalide.',
            'password.*' => 'Le mot de passe est obligatoire.',
        ];
    }
}
