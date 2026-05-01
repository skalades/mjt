<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\InventoryItem;
use App\Models\OrderMaterialUsage;
use App\Models\InventoryTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderMaterialUsageController extends Controller
{
    public function store(Request $request, Order $order)
    {
        $validated = $request->validate([
            'inventory_item_id' => 'required|exists:inventory_items,id',
            'quantity' => 'required|numeric|min:0.01',
            'notes' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated, $order) {
            // 1. Record Usage
            OrderMaterialUsage::create([
                'order_id' => $order->id,
                'inventory_item_id' => $validated['inventory_item_id'],
                'quantity' => $validated['quantity'],
                'notes' => $validated['notes'],
                'created_by' => auth()->id(),
            ]);

            // 2. Create Inventory Transaction (OUT)
            InventoryTransaction::create([
                'inventory_item_id' => $validated['inventory_item_id'],
                'type' => 'OUT',
                'quantity' => $validated['quantity'],
                'notes' => "Pemakaian untuk pesanan #{$order->order_number}. " . ($validated['notes'] ?? ''),
                'referenceable_type' => Order::class,
                'referenceable_id' => $order->id,
                'created_by' => auth()->id(),
            ]);
        });

        return back()->with('success', 'Pemakaian bahan berhasil dicatat.');
    }

    public function destroy(OrderMaterialUsage $usage)
    {
        DB::transaction(function () use ($usage) {
            // Restore inventory (Create IN transaction to reverse the OUT)
            InventoryTransaction::create([
                'inventory_item_id' => $usage->inventory_item_id,
                'type' => 'IN',
                'quantity' => $usage->quantity,
                'notes' => "Pembatalan pemakaian bahan untuk pesanan #{$usage->order->order_number}",
                'created_by' => auth()->id(),
            ]);

            $usage->delete();
        });

        return back()->with('success', 'Catatan pemakaian bahan dihapus dan stok dikembalikan.');
    }
}
