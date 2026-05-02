<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\InventoryItem;
use App\Models\InventoryTransaction;
use App\Models\OrderMaterialUsage;
use App\Models\FinanceTransaction;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // 1. Finance Stats — Cash Balance (verified transactions only)
        $balance = FinanceTransaction::where('status', 'SUCCESS')
            ->selectRaw("SUM(CASE WHEN type = 'IN' THEN amount ELSE -amount END) as total")
            ->value('total') ?? 0;

        // Revenue (Total Order Values, excluding cancelled)
        $totalRevenue = Order::where('status', '!=', 'CANCELLED')->sum('total_amount');

        // Material Cost (COGS) — from actual material usage records
        $totalMaterialCost = OrderMaterialUsage::sum('total_cost') ?? 0;

        // Operational Expenses — EXCLUDE material purchases to avoid double counting
        // Material cost is already tracked via OrderMaterialUsage (COGS)
        $totalExpenses = FinanceTransaction::where('status', 'SUCCESS')
            ->where('type', 'OUT')
            ->where('category', '!=', 'MATERIAL_PURCHASE')
            ->sum('amount');

        $grossProfit = $totalRevenue - $totalMaterialCost;
        $netProfit = $grossProfit - $totalExpenses;

        // Monthly Stats
        $monthlyRevenue = Order::where('status', '!=', 'CANCELLED')
            ->whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->sum('total_amount');

        // 2. Inventory Stats
        $totalItems = InventoryItem::count();

        // Low stock count — SQLite-compatible raw query
        $lowStockCount = DB::table('inventory_items')
            ->whereNull('deleted_at')
            ->whereRaw('(
                SELECT COALESCE(SUM(CASE WHEN type = \'IN\' THEN quantity ELSE -quantity END), 0)
                FROM inventory_transactions
                WHERE inventory_transactions.inventory_item_id = inventory_items.id
            ) <= min_stock_threshold')
            ->count();

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
                'revenue' => (int) $totalRevenue,
                'monthly_revenue' => (int) $monthlyRevenue,
                'material_cost' => (int) $totalMaterialCost,
                'gross_profit' => (int) $grossProfit,
                'net_profit' => (int) $netProfit,
                'expenses' => (int) $totalExpenses,
            ]
        ]);
    }
}
