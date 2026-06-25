<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreExpirationRequest extends FormRequest
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
             'client_id' => 'required|exists:clients,id',
            'title' => 'required|string|max:255',
            'last_renewal_date' => 'required|date',
            'duration' => 'required|integer|min:1|max:120',
            'expiration_date' => 'required|date|after_or_equal:last_renewal_date',
        ];
    }

    public function messages(): array
    {
        return [
            'client_id.required' => 'Please select a client.',
            'client_id.exists' => 'Selected client does not exist.',
            'expiration_date.after_or_equal' =>
                'Expiration date must be after renewal date.',
        ];
    }
}
