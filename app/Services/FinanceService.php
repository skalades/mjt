<?php

namespace App\Services;

use App\Models\FinanceTransaction;
use App\Models\Order;
use App\Models\OrderMaterialUsage;
use App\Enums\TransactionType;
use App\Enums\PaymentMethod;
use Illuminate\Support\Facades\DB;

class FinanceService
{
    public function createTransaction(array $data): FinanceTransaction
    {
        $method = PaymentMethod::from($data['payment_method']);
        
        return FinanceTransaction::create([
            ...$data,
            'status' => $method->isPending() ? 'PENDING' : 'SUCCESS',
            'created_by' => auth()->id(),
        ]);
    }

    public function deleteTransaction(FinanceTransaction $transaction): bool
    {
        return DB::transaction(function () use ($transaction) {
            // If linked to an order, revert the paid amount
            if ($transaction->referenceable_type === \App\Models\Order::class && $transaction->referenceable_id) {
                $order = $transaction->referenceable;
                if ($order) {
                    $order->decrement('paid_amount', $transaction->amount);
                    // Update payment status via OrderService logic
                    app(\App\Services\OrderService::class)->updatePaymentStatus($order);
                }
            }

            return $transaction->delete();
        });
    }

    public function getSummary(): array
    {
        $balance = FinanceTransaction::where('status', 'SUCCESS')
            ->selectRaw("SUM(CASE WHEN type = 'IN' THEN amount ELSE -amount END) as total")
            ->value('total') ?? 0;

        $pendingGiro = FinanceTransaction::where('status', 'PENDING')
            ->whereIn('payment_method', [PaymentMethod::CHEQUE->value, PaymentMethod::GIRO->value])
            ->sum('amount');

        $totalIncome = FinanceTransaction::where('status', 'SUCCESS')
            ->where('type', 'IN')
            ->sum('amount');

        $totalExpense = FinanceTransaction::where('status', 'SUCCESS')
            ->where('type', 'OUT')
            ->sum('amount');

        $materialCost = (int) (OrderMaterialUsage::sum('total_cost') ?? 0);

        return [
            'total_balance' => (int) $balance,
            'pending_giro' => (int) $pendingGiro,
            'total_income' => (int) $totalIncome,
            'total_expense' => (int) $totalExpense,
            'material_cost' => $materialCost,
        ];
    }
}
