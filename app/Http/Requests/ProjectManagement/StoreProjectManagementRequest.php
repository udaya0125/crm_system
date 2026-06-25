<?php

namespace App\Http\Requests\ProjectManagement;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectManagementRequest extends FormRequest
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
             'client_name'         => 'required|string|max:255',
            'project_title'       => 'required|string|max:255',
            'service_type'        => 'required|string|max:255',
            'start_date'          => 'required|date',
            'deadline'            => 'required|date|after_or_equal:start_date',
            'assigned_team'       => 'nullable|string|max:255',
            'user_remarks'        => 'nullable|string|max:255',
            'admin_remarks'       => 'nullable|string|max:255',
            'priority'            => 'required|string',
            'status'              => 'required|string',
            'completion'          => 'nullable|integer|min:0|max:100',
            'project_description' => 'nullable|json',
        ];
    }
}
