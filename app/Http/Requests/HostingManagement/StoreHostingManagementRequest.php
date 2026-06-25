<?php

namespace App\Http\Requests\HostingManagement;

use Illuminate\Foundation\Http\FormRequest;

class StoreHostingManagementRequest extends FormRequest
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
             'hosting_plan'     => 'required|string|max:255',
            'client_id'        => 'required|exists:clients,id',
            'disk_usage'       => 'nullable|string|max:255',
            'renewal_date'     => 'required|date',
            'hosting_provider' => 'required|string|max:255',
        ];
    }
    public function messages(): array
    {
        return [
            'client_id.exists' => 'Selected client does not exist.',
        ];
    }
}
