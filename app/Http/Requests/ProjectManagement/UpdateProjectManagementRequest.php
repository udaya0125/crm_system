<?php

namespace App\Http\Requests\ProjectManagement;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectManagementRequest extends FormRequest
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
            'client_name'         => 'sometimes|string|max:255',
            'project_title'       => 'sometimes|string|max:255',
            'service_type'        => 'sometimes|string|max:255',
            'start_date'          => 'sometimes|date',
            'deadline'            => 'sometimes|date',
            'assigned_team'       => 'nullable|string|max:255',
            'user_remarks'        => 'nullable|string|max:255',
            'admin_remarks'       => 'nullable|string|max:255',
            'priority'            => 'sometimes|string',
            'status'              => 'sometimes|string',
            'completion'          => 'nullable|integer|min:0|max:100',
            'project_description' => 'nullable|json',
        ];
    }
}
