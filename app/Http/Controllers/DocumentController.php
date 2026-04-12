<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Order;
use App\Models\FinanceTransaction;
use App\Models\InventoryItem;
use Barryvdh\DomPDF\Facade\Pdf;

class DocumentController extends Controller
{
    /**
     * Generate Proforma Invoice PDF
     */
    public function invoice($id)
    {
        $order = Order::with('items')->findOrFail($id);
        
        $pdf = Pdf::loadView('pdf.invoice', compact('order'));
        
        return $pdf->stream('Invoice-' . $order->order_number . '.pdf');
    }

    /**
     * Generate Delivery Order (Surat Jalan) PDF
     */
    public function deliveryOrder($id)
    {
        $order = Order::with('items')->findOrFail($id);
        
        $pdf = Pdf::loadView('pdf.delivery_order', compact('order'));
        
        return $pdf->stream('SuratJalan-' . $order->order_number . '.pdf');
    }

    /**
     * Generate Corporate Financial Ledger Report
     */
    public function financeReport()
    {
        $transactions = FinanceTransaction::where('status', 'SUCCESS')
            ->orderBy('transaction_date', 'desc')
            ->get();
            
        $pdf = Pdf::loadView('pdf.finance_report', compact('transactions'));
        
        return $pdf->stream('Laporan-Keuangan-' . date('Y-m-d') . '.pdf');
    }

    /**
     * Generate Warehouse Inventory Status Report
     */
    public function inventoryReport()
    {
        $items = InventoryItem::withSum(['transactions as total_stock' => function($query) {
            $query->selectRaw("SUM(case when type = 'IN' then quantity else -quantity end)");
        }], 'quantity')->get();

        $pdf = Pdf::loadView('pdf.inventory_status', compact('items'));
        
        return $pdf->stream('Laporan-Stok-' . date('Y-m-d') . '.pdf');
    }
}
