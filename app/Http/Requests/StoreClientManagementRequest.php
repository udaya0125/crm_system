<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreClientManagementRequest extends FormRequest
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
            'lead_id'         => 'required|exists:leads,id',
            'company_name'    => 'required|string|max:255',
            'contact_person'  => 'nullable|string|max:255',
            'email'           => 'nullable|email|max:255',
            'phone'           => 'nullable|string|max:20',
            'address'         => 'nullable|string',
            'service_type'    => 'nullable|string|max:255',
            'account_manager' => 'nullable|string|max:255',
            'total_projects'  => 'nullable|integer|min:0',
            'total_revenue'   => 'nullable|numeric|min:0',
            'payment_status'  => 'nullable|string|max:50',
        ];
    }

     public function messages(): array
    {
        return [
            'lead_id.required' => 'Please select a lead.',
            'lead_id.exists'   => 'Selected lead does not exist.',
        ];
    }
}
