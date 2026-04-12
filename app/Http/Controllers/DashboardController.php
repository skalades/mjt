<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\InventoryItem;
use App\Models\FinanceTransaction;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // 1. Finance Stats
        $balance = FinanceTransaction::where('status', 'SUCCESS')
            ->selectRaw("SUM(CASE WHEN type = 'IN' THEN amount ELSE -amount END) as total")
            ->value('total') ?? 0;

        $monthlyCashIn = FinanceTransaction::where('status', 'SUCCESS')
            ->where('type', 'IN')
            ->whereMonth('transaction_date', Carbon::now()->month)
            ->whereYear('transaction_date', Carbon::now()->year)
            ->sum('amount');

        // 2. Inventory Stats
        $totalItems = InventoryItem::count();
        
        // Calculate low stock items
        // Since we don't have a current_stock column, we sum the transactions
        $lowStockCount = InventoryItem::where(function($query) {
            $query->selectRaw("SUM(CASE WHEN type = 'IN' THEN quantity ELSE -quantity END)")
                ->from('inventory_transactions')
                ->whereColumn('inventory_item_id', 'inventory_items.id');
        }, '<=', DB::raw('min_stock_threshold'))->count();

        // 3. Order Stats
        $totalOrders = Order::count();
        $ordersToday = Order::whereDate('created_at', Carbon::today())->count();

        return Inertia::render('Dashboard', [
            'stats' => [
                'total_orders' => $totalOrders,
                'orders_today' => $ordersToday,
                'total_items' => $totalItems,
                'low_stock_count' => $lowStockCount,
                'balance' => (int) $balance,
                'monthly_cash_in' => (int) $monthlyCashIn,
            ]
        ]);
    }
}
