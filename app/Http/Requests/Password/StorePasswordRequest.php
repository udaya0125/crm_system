<?php

namespace App\Http\Requests\Password;

use Illuminate\Foundation\Http\FormRequest;

class StorePasswordRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
             'organization_id'     => 'required|exists:organizations,id',
            'category_id'         => 'required|exists:categories,id',
            'sub_category_id'     => 'nullable|exists:sub_categories,id',
            'sub_sub_category_id' => 'nullable|exists:sub_sub_categories,id',
            'username'            => 'required|string|max:255',
            'password'            => 'required|string',
            'expirydate'          => 'nullable|date',
            'note'                => 'nullable|string',
            'image'               => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ];
    }
}
