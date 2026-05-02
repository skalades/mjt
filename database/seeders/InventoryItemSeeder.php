<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\InventoryItem;
use App\Models\InventoryTransaction;
use Illuminate\Support\Facades\DB;

class InventoryItemSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing data to avoid duplication or SKU conflicts
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        InventoryTransaction::truncate();
        InventoryItem::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $items = [
            ['sku' => 'MAT-TP', 'name' => 'TP', 'price' => 31000, 'cat' => 'KARET'],
            ['sku' => 'MAT-EPDM', 'name' => 'EPDM', 'price' => 58000, 'cat' => 'KARET'],
            ['sku' => 'MAT-SILICON', 'name' => 'SILICON', 'price' => 150000, 'cat' => 'KARET'],
            ['sku' => 'MAT-NBR', 'name' => 'NBR', 'price' => 60000, 'cat' => 'KARET'],
            ['sku' => 'MAT-SINTETIS', 'name' => 'SINTETIS', 'price' => 0, 'cat' => 'KARET'],
            ['sku' => 'MAT-D1', 'name' => 'D1', 'price' => 0, 'cat' => 'KARET'],
            ['sku' => 'MAT-D2', 'name' => 'D2', 'price' => 0, 'cat' => 'KARET'],
            ['sku' => 'MAT-SBR', 'name' => 'SBR', 'price' => 58000, 'cat' => 'KARET'],
            ['sku' => 'MAT-PITON', 'name' => 'PITON', 'price' => 1200000, 'cat' => 'KARET'],
            ['sku' => 'MAT-CB', 'name' => 'CB', 'price' => 0, 'cat' => 'KARET'],
            ['sku' => 'MAT-BESI', 'name' => 'BESI', 'price' => 22000, 'cat' => 'LOGAM'],
            ['sku' => 'MAT-ALMUNIUM', 'name' => 'ALMUNIUM', 'price' => 0, 'cat' => 'LOGAM'],
            ['sku' => 'MAT-KUNINGAN', 'name' => 'KUNINGAN', 'price' => 0, 'cat' => 'LOGAM'],
            ['sku' => 'MAT-CARBON', 'name' => 'CARBON', 'price' => 65000, 'cat' => 'PLASTIK'],
            ['sku' => 'MAT-NYLON', 'name' => 'NYLON', 'price' => 0, 'cat' => 'PLASTIK'],
            ['sku' => 'MAT-TEFLON', 'name' => 'TEFLON', 'price' => 0, 'cat' => 'PLASTIK'],
        ];

        foreach ($items as $data) {
            $item = InventoryItem::create([
                'sku' => $data['sku'],
                'name' => $data['name'],
                'description' => "Kategori: " . $data['cat'],
                'unit' => 'Kg',
                'purchase_price' => $data['price'],
                'min_stock_threshold' => 10,
            ]);

            // Record initial stock of 0 (or some default if needed, but 0 is safer)
            InventoryTransaction::create([
                'inventory_item_id' => $item->id,
                'type' => 'IN',
                'quantity' => 0,
                'notes' => 'Inisialisasi sistem (Data Master)',
            ]);
        }
    }
}
