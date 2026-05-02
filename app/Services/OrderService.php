<?php

namespace App\Services;

use App\Models\Order;
use App\Models\FinanceTransaction;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\PaymentMethod;
use App\Enums\TransactionType;
use Illuminate\Support\Facades\DB;

class OrderService
{
    /**
     * Create a new order with its items.
     */
    public function createOrder(array $data): Order
    {
        return DB::transaction(function () use ($data) {
            $totalAmount = 0;
            foreach ($data['items'] as $item) {
                $totalAmount += $item['quantity'] * $item['unit_price'];
            }

            $order = Order::create([
                'client_name' => $data['client_name'],
                'order_number' => $data['order_number'],
                'due_date' => $data['due_date'],
                'total_amount' => $totalAmount,
                'status' => OrderStatus::DRAFT->value,
                'payment_status' => PaymentStatus::UNPAID->value,
            ]);

            foreach ($data['items'] as $item) {
                $order->items()->create([
                    'item_name' => $item['item_name'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal' => $item['quantity'] * $item['unit_price'],
                ]);
            }

            return $order;
        });
    }

    /**
     * Record a payment for an order and sync with Finance Ledger.
     */
    public function recordPayment(Order $order, array $data): FinanceTransaction
    {
        return DB::transaction(function () use ($order, $data) {
            $method = PaymentMethod::from($data['payment_method']);

            // 1. Create Finance Transaction
            $finance = FinanceTransaction::create([
                'type' => TransactionType::IN->value,
                'category' => 'ORDER_PAYMENT',
                'payment_method' => $method->value,
                'status' => $method->isPending() ? 'PENDING' : 'SUCCESS',
                'amount' => $data['amount'],
                'transaction_date' => $data['transaction_date'],
                'maturity_date' => $data['maturity_date'] ?? null,
                'reference_number' => $data['reference_number'] ?? null,
                'notes' => $data['notes'] ?? "Pembayaran pesanan {$order->order_number}",
                'referenceable_type' => Order::class,
                'referenceable_id' => $order->id,
                'created_by' => auth()->id(),
            ]);

            // 2. Update Order Paid Amount
            $order->increment('paid_amount', $data['amount']);

            // 3. Update Order Payment Status
            $this->updatePaymentStatus($order);

            return $finance;
        });
    }

    /**
     * Update order payment status based on paid amount.
     */
    public function updatePaymentStatus(Order $order): void
    {
        if ($order->paid_amount >= $order->total_amount) {
            $order->update(['payment_status' => PaymentStatus::PAID->value]);
        } elseif ($order->paid_amount > 0) {
            $order->update(['payment_status' => PaymentStatus::PARTIAL->value]);
        } else {
            $order->update(['payment_status' => PaymentStatus::UNPAID->value]);
        }
    }

    /**
     * Update order production status.
     */
    public function updateStatus(Order $order, string $status): Order
    {
        $statusEnum = OrderStatus::from($status);
        $order->update(['status' => $statusEnum->value]);
        return $order;
    }
}

