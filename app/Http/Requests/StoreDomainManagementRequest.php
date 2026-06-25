<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDomainManagementRequest extends FormRequest
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

            'domain_name'         => 'required|string|max:255',
            'client_id'           => 'required|exists:clients,id',
            'register'            => 'required|string|max:255',
            'purchase_date'       => 'required|date',
            'expiry_date'         => 'required|date|after:purchase_date',
            'auto_renewal_status' => 'required|string',
            'dns_provider'        => 'nullable|string|max:255',
        ];
    }
    public function messages(): array
    {
        return [
            'client_id.exists' => 'Selected client does not exist.',
            'expiry_date.after' => 'Expiry date must be after purchase date.',
        ];
    }
}
