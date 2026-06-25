<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFinanceTrackingRequest extends FormRequest
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
            'invoice_id'   => 'nullable|string|max:255|unique:finance_trackings,invoice_id',
            'client'       => 'required|string|max:255',
            'project'      => 'required|string|max:255',
            'invoice_date' => 'required|date',
            'due_date'     => 'required|date|after_or_equal:invoice_date',
            'amount'       => 'required|numeric|min:0',
            'paid_amount'  => 'nullable|numeric|min:0',
            'status'       => 'nullable|string',
        ];
    }

     public function messages(): array
    {
        return [
            'client.required' => 'Client name is required.',
            'project.required' => 'Project name is required.',
            'due_date.after_or_equal' => 'Due date must be after invoice date.',
        ];
    }
}
