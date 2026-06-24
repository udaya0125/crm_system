<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateClientRequest extends FormRequest
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
            'type'         => 'nullable|string|max:255',
            'name'         => 'required|string|max:255',
            'branchname'   => 'nullable|string|max:255',
            'code'         => 'nullable|string|max:100',
            'pannumber'    => 'nullable|string|max:100',
            'country'      => 'nullable|string|max:100',
            'state'        => 'nullable|string|max:100',
            'city'         => 'nullable|string|max:100',
            'street'       => 'nullable|string|max:255',
            'telone'       => 'nullable|string|max:20',
            'teltwo'       => 'nullable|string|max:20',
            'mobile'       => 'nullable|string|max:20',
            'email'        => 'nullable|email|max:255',
            'website'      => 'nullable|string|max:255',
            'activestatus' => 'nullable|string|max:255',
            'ledgername'   => 'nullable|string|max:255',
        ];
    }
}
