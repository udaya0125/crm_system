<?php

namespace App\Http\Requests\Lead;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLeadRequest extends FormRequest
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
            'client_name'          => 'sometimes|required|string|max:255',
            'company_name'         => 'nullable|string|max:255',
            'phone'                => 'sometimes|required|string|max:20',
            'email'                => 'nullable|email|max:255',
            'service_interested'   => 'nullable|string|max:255',
            'lead_source'          => 'nullable|string|max:255',
            'assigned_salesperson' => 'nullable|string|max:255',
            'next_followup_date'   => 'nullable|date',
            'notes'                => 'nullable|string',
            'status'               => 'nullable|string|max:100',
        ];
    }
}
