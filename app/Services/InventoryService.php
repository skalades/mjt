<?php

namespace App\Services;

use App\Models\InventoryItem;
use App\Models\InventoryTransaction;

class InventoryService
{
    /**
     * Calculate current stock for an item.
     */
    public function getCurrentStock(InventoryItem $item): float
    {
        return (float) InventoryTransaction::where('inventory_item_id', $item->id)
            ->selectRaw("SUM(CASE WHEN type = 'IN' THEN quantity ELSE -quantity END) as total")
            ->value('total') ?? 0;
    }

    /**
     * Check if item has enough stock.
     */
    public function hasEnoughStock(InventoryItem $item, float $requestedQuantity): bool
    {
        return $this->getCurrentStock($item) >= $requestedQuantity;
    }
}
