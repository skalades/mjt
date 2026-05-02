<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\InventoryItem;
use App\Models\OrderMaterialUsage;
use App\Models\InventoryTransaction;
use App\Services\InventoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderMaterialUsageController extends Controller
{
    protected $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    public function store(Request $request, Order $order)
    {
        $validated = $request->validate([
            'inventory_item_id' => 'required|exists:inventory_items,id',
            'quantity' => 'required|numeric|min:0.01',
            'notes' => 'nullable|string',
        ]);

        $item = InventoryItem::findOrFail($validated['inventory_item_id']);

        // Check Stock
        if (!$this->inventoryService->hasEnoughStock($item, $validated['quantity'])) {
            return back()->withErrors(['quantity' => 'Stok tidak mencukupi untuk pemakaian ini.']);
        }

        DB::transaction(function () use ($validated, $order, $item) {
            // 1. Record Usage with COGS tracking
            OrderMaterialUsage::create([
                'order_id' => $order->id,
                'inventory_item_id' => $validated['inventory_item_id'],
                'quantity' => $validated['quantity'],
                'unit_cost' => $item->purchase_price,
                'total_cost' => $validated['quantity'] * $item->purchase_price,
                'notes' => $validated['notes'],
                'created_by' => auth()->id(),
            ]);

            // 2. Create Inventory Transaction (OUT)
            // Uses reference_id (string) for traceability — morph columns don't exist in schema
            InventoryTransaction::create([
                'inventory_item_id' => $validated['inventory_item_id'],
                'type' => 'OUT',
                'quantity' => $validated['quantity'],
                'reference_id' => "ORD-{$order->id}",
                'notes' => "Pemakaian untuk pesanan #{$order->order_number}. " . ($validated['notes'] ?? ''),
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
                'reference_id' => "ORD-{$usage->order_id}",
                'notes' => "Pembatalan pemakaian bahan untuk pesanan #{$usage->order->order_number}",
                'created_by' => auth()->id(),
            ]);

            $usage->delete();
        });

        return back()->with('success', 'Catatan pemakaian bahan dihapus dan stok dikembalikan.');
    }
}
