<?php

namespace App\Http\Requests;

use App\Enums\PaymentMethod;
use App\Enums\TransactionType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreFinanceTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', new Enum(TransactionType::class)],
            'category' => 'required|in:CAPITAL,OPERATIONAL,SALARY,OTHER,ORDER_PAYMENT,MATERIAL_PURCHASE',
            'amount' => 'required|numeric|min:1',
            'payment_method' => ['required', new Enum(PaymentMethod::class)],
            'transaction_date' => 'required|date',
            'maturity_date' => 'nullable|date|required_if:payment_method,CHEQUE,GIRO',
            'source' => 'nullable|string',
            'reference_number' => 'nullable|string',
            'notes' => 'nullable|string',
        ];
    }
}
