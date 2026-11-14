<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CartCheckRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'items'            => ['present', 'array', 'max:60'],
            'items.*.id'       => ['nullable', 'required_without:items.*.pack_id', 'integer', 'min:1'],
            'items.*.pack_id'  => ['nullable', 'integer', 'min:1'],
            'items.*.variant_id' => ['nullable', 'integer', 'min:1'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:1000'],
        ];
    }
}
