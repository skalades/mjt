<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\InventoryItem;
use App\Models\InventoryTransaction;

class InventoryItemSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'sku' => 'MAT-PP-001',
                'name' => 'Polypropylene (PP) Virgin Grade',
                'description' => 'Bahan baku plastik murni kualitas tinggi.',
                'unit' => 'Kg',
                'min_stock_threshold' => 100,
                'initial_stock' => 500,
            ],
            [
                'sku' => 'MAT-OR-002',
                'name' => 'Masterbatch Orange MJT',
                'description' => 'Pewarna khusus untuk produk MJT.',
                'unit' => 'Kg',
                'min_stock_threshold' => 20,
                'initial_stock' => 15, // Test low stock
            ],
            [
                'sku' => 'MAT-RCL-003',
                'name' => 'Recycle Resin A+ Clear',
                'description' => 'Bahan daur ulang kualitas premium.',
                'unit' => 'Kg',
                'min_stock_threshold' => 200,
                'initial_stock' => 450,
            ],
        ];

        foreach ($items as $data) {
            $initialStock = $data['initial_stock'];
            unset($data['initial_stock']);

            $item = InventoryItem::create($data);

            // Record initial stock
            InventoryTransaction::create([
                'inventory_item_id' => $item->id,
                'type' => 'IN',
                'quantity' => $initialStock,
                'notes' => 'Stok awal sistem MJT v2.0',
            ]);
        }
    }
}
