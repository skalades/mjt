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
    public function index(Request $request): Response
    {
        $query = InventoryItem::select('inventory_items.*')
            ->selectSub(function ($sub) {
                $sub->from('inventory_transactions')
                    ->selectRaw("COALESCE(SUM(CASE WHEN type = 'IN' THEN quantity ELSE -quantity END), 0)")
                    ->whereColumn('inventory_transactions.inventory_item_id', 'inventory_items.id');
            }, 'current_stock')
            ->with(['transactions' => function($q) {
                $q->latest()->limit(5);
            }]);

        // Server-side search
        if ($request->has('search') && $request->search !== '') {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('sku', 'LIKE', "%{$searchTerm}%");
            });
        }

        $items = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Inventory/Index', [
            'items' => $items,
            'filters' => $request->only(['search']),
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

    public function adjust(Request $request, InventoryItem $inventory)
    {
        $validated = $request->validate([
            'type' => 'required|in:IN,OUT',
            'quantity' => 'required|numeric|min:0.01',
            'notes' => 'nullable|string',
        ]);

        InventoryTransaction::create([
            'inventory_item_id' => $inventory->id,
            'type' => $validated['type'],
            'quantity' => $validated['quantity'],
            'notes' => 'Penyesuaian Manual: ' . ($validated['notes'] ?? '-'),
            'created_by' => auth()->id(),
        ]);

        return redirect()->route('inventory.index')->with('success', 'Stok berhasil diperbarui.');
    }
}
