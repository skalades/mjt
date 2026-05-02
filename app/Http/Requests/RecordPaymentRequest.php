<?php

namespace App\Http\Requests;

use App\Enums\PaymentMethod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class RecordPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount' => 'required|numeric|min:1',
            'payment_method' => ['required', new Enum(PaymentMethod::class)],
            'transaction_date' => 'required|date',
            'maturity_date' => 'nullable|date|required_if:payment_method,CHEQUE,GIRO',
            'reference_number' => 'nullable|string',
            'notes' => 'nullable|string',
        ];
    }
}
