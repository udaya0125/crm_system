<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTicketRequest extends FormRequest
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
            'issue_type'          => 'required|string|max:255',
            'device_type'         => 'required|string|max:255',
            'problem_description' => 'required|string',
            'priority'            => 'required|string',
            'email'               => 'nullable|email|max:255',
            'image'               => 'nullable|mimes:jpg,jpeg,png,webp,pdf|max:5120',
            'assigned_technician' => 'nullable|exists:users,id',
            'status'              => 'required|string',
            'recaptcha_token'     => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'recaptcha_token.required' => 'Please complete the reCAPTCHA.',
        ];
    }
}
