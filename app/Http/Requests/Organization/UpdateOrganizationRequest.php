<?php

namespace App\Http\Requests\Organization;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrganizationRequest extends FormRequest
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
         $id = $this->route('id');
        return [
            //
            'name' => 'required|string|max:255',
            'domain' => 'nullable|string|max:255|unique:organizations,domain,' . $id,
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Organization name is required.',
            'domain.unique' => 'This domain already exists.',
        ];
    }
}
