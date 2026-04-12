<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\FinanceTransaction;
use Carbon\Carbon;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Fully Paid Order
        $order1 = Order::create([
            'order_number' => 'ORD-' . Carbon::now()->format('Y') . '-001',
            'client_name' => 'PT. Mitra Plastik Abadi',
            'status' => 'SHIPPED',
            'payment_status' => 'PAID',
            'total_amount' => 15000000,
            'paid_amount' => 15000000,
            'due_date' => Carbon::now()->subDays(5),
            'created_at' => Carbon::now()->subDays(10),
        ]);

        OrderItem::create([
            'order_id' => $order1->id,
            'item_name' => 'Casing Speaker 4"',
            'quantity' => 1000,
            'unit_price' => 15000,
            'subtotal' => 15000000,
        ]);

        FinanceTransaction::create([
            'type' => 'IN',
            'category' => 'ORDER_PAYMENT',
            'amount' => 15000000,
            'payment_method' => 'TRANSFER_MANDIRI',
            'status' => 'SUCCESS',
            'transaction_date' => Carbon::now()->subDays(10),
            'referenceable_id' => $order1->id,
            'referenceable_type' => Order::class,
            'notes' => 'Pelunasan ORD-001',
        ]);

        // 2. Partially Paid Order (Production)
        $order2 = Order::create([
            'order_number' => 'ORD-' . Carbon::now()->format('Y') . '-002',
            'client_name' => 'PT. Sumber Jaya Mandiri',
            'status' => 'PRODUCTION',
            'payment_status' => 'PARTIAL',
            'total_amount' => 25000000,
            'paid_amount' => 10000000,
            'due_date' => Carbon::now()->addDays(15),
            'created_at' => Carbon::now()->subDays(2),
        ]);

        OrderItem::create([
            'order_id' => $order2->id,
            'item_name' => 'Handle Pintu Kulkas V2',
            'quantity' => 2000,
            'unit_price' => 12500,
            'subtotal' => 25000000,
        ]);

        FinanceTransaction::create([
            'type' => 'IN',
            'category' => 'ORDER_PAYMENT',
            'amount' => 10000000,
            'payment_method' => 'TRANSFER_BCA',
            'status' => 'SUCCESS',
            'transaction_date' => Carbon::now()->subDays(2),
            'referenceable_id' => $order2->id,
            'referenceable_type' => Order::class,
            'notes' => 'DP 40% ORD-002',
        ]);

        // 3. New Order (Unpaid)
        $order3 = Order::create([
            'order_number' => 'ORD-' . Carbon::now()->format('Y') . '-003',
            'client_name' => 'CV. Berkah Sentosa',
            'status' => 'DRAFT',
            'payment_status' => 'UNPAID',
            'total_amount' => 8500000,
            'paid_amount' => 0,
            'due_date' => Carbon::now()->addDays(20),
            'created_at' => Carbon::now(), // Testing today count
        ]);

        OrderItem::create([
            'order_id' => $order3->id,
            'item_name' => 'Base Plate MJT-09',
            'quantity' => 500,
            'unit_price' => 17000,
            'subtotal' => 8500000,
        ]);
    }
}
