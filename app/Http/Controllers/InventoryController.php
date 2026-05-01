<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\InventoryItem;
use App\Models\InventoryTransaction;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class InventoryController extends Controller
{
    public function index(): Response
    {
        $items = InventoryItem::with(['transactions' => function($query) {
            $query->latest()->limit(5);
        }])->latest()->paginate(10);

        return Inertia::render('Inventory/Index', [
            'items' => $items,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sku' => 'required|string|unique:inventory_items',
            'name' => 'required|string',
            'unit' => 'required|string',
            'purchase_price' => 'nullable|numeric|min:0',
            'initial_stock' => 'required|numeric|min:0',
            'min_stock_threshold' => 'nullable|integer',
        ]);

        DB::transaction(function () use ($validated) {
            $item = InventoryItem::create([
                'sku' => $validated['sku'],
                'name' => $validated['name'],
                'unit' => $validated['unit'],
                'purchase_price' => $validated['purchase_price'] ?? 0,
                'min_stock_threshold' => $validated['min_stock_threshold'] ?? 10,
            ]);

            if ($validated['initial_stock'] > 0) {
                InventoryTransaction::create([
                    'inventory_item_id' => $item->id,
                    'type' => 'IN',
                    'quantity' => $validated['initial_stock'],
                    'notes' => 'Stok awal sistem',
                    'created_by' => auth()->id(),
                ]);
            }
        });

        return redirect()->route('inventory.index')->with('success', 'Barang berhasil ditambahkan.');
    }

    public function update(Request $request, InventoryItem $inventory)
    {
        $validated = $request->validate([
            'sku' => "required|string|unique:inventory_items,sku,{$inventory->id}",
            'name' => 'required|string',
            'unit' => 'required|string',
            'purchase_price' => 'nullable|numeric|min:0',
            'min_stock_threshold' => 'nullable|integer',
        ]);

        $inventory->update($validated);

        return redirect()->route('inventory.index')->with('success', 'Barang berhasil diperbarui.');
    }

    public function destroy(InventoryItem $inventory)
    {
        $inventory->delete();

        return redirect()->route('inventory.index')->with('success', 'Barang berhasil dihapus (soft delete).');
    }
}
