<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Order;
use App\Models\InventoryItem;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\PaymentMethod;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_can_create_order()
    {
        $response = $this->actingAs($this->user)->post(route('orders.store'), [
            'client_name' => 'Test Client',
            'order_number' => 'ORD-123',
            'due_date' => now()->addDays(7)->format('Y-m-d'),
            'items' => [
                [
                    'item_name' => 'Rubber Gasket',
                    'quantity' => 10,
                    'unit_price' => 5000,
                ]
            ]
        ]);

        $response->assertRedirect(route('orders.index'));
        $this->assertDatabaseHas('orders', [
            'order_number' => 'ORD-123',
            'total_amount' => 50000,
            'status' => OrderStatus::DRAFT->value,
        ]);
    }

    public function test_can_record_payment()
    {
        $order = Order::create([
            'client_name' => 'Test Client',
            'order_number' => 'ORD-124',
            'total_amount' => 100000,
            'status' => OrderStatus::DRAFT->value,
            'payment_status' => PaymentStatus::UNPAID->value,
        ]);

        $response = $this->actingAs($this->user)->post(route('orders.payment', $order), [
            'amount' => 40000,
            'payment_method' => PaymentMethod::TRANSFER_BCA->value,
            'transaction_date' => now()->format('Y-m-d'),
        ]);

        $response->assertRedirect();
        $order->refresh();

        $this->assertEquals(40000, $order->paid_amount);
        $this->assertEquals(PaymentStatus::PARTIAL->value, $order->payment_status);
        $this->assertDatabaseHas('finance_transactions', [
            'amount' => 40000,
            'referenceable_id' => $order->id,
            'status' => 'SUCCESS',
        ]);
    }
}
