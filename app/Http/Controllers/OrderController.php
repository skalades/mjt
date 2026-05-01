<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Order;
use App\Models\FinanceTransaction;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Order::with(['items', 'financeTransactions' => function($q) {
            $q->latest()->limit(5);
        }]);

        // Filter by Status
        if ($request->has('status')) {
            if ($request->status === 'produksi') {
                $query->whereIn('status', ['PRODUCTION', 'QC']);
            } elseif ($request->status === 'selesai') {
                $query->where('status', 'SHIPPED');
            }
        }

        // Search by order number or client name
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('order_number', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('client_name', 'LIKE', "%{$searchTerm}%");
            });
        }

        $orders = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Orders/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_name' => 'required|string',
            'order_number' => 'required|string|unique:orders',
            'due_date' => 'nullable|date',
            'items' => 'required|array|min:1',
            'items.*.item_name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|integer|min:0',
        ]);

        DB::transaction(function () use ($validated) {
            $totalAmount = 0;
            foreach ($validated['items'] as $item) {
                $totalAmount += $item['quantity'] * $item['unit_price'];
            }

            $order = Order::create([
                'client_name' => $validated['client_name'],
                'order_number' => $validated['order_number'],
                'due_date' => $validated['due_date'],
                'total_amount' => $totalAmount,
                'status' => 'DRAFT',
                'payment_status' => 'UNPAID',
            ]);

            foreach ($validated['items'] as $item) {
                $order->items()->create([
                    'item_name' => $item['item_name'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal' => $item['quantity'] * $item['unit_price'],
                ]);
            }
        });

        return redirect()->route('orders.index')->with('success', 'Pesanan berhasil dibuat.');
    }

    public function show(Order $order): Response
    {
        return Inertia::render('Orders/Show', [
            'order' => $order->load(['items', 'materialUsages.inventoryItem', 'financeTransactions' => fn($q) => $q->latest()]),
            'inventoryItems' => \App\Models\InventoryItem::all(),
        ]);
    }

    /**
     * Record a payment for an order and sync with Finance Ledger.
     */
    public function recordPayment(Request $request, Order $order)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
            'payment_method' => 'required|in:CASH,TRANSFER_MANDIRI,TRANSFER_BCA,CHEQUE,GIRO',
            'transaction_date' => 'required|date',
            'maturity_date' => 'nullable|date|required_if:payment_method,CHEQUE,GIRO',
            'reference_number' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated, $order) {
            // 1. Create Finance Transaction
            $finance = FinanceTransaction::create([
                'type' => 'IN',
                'category' => 'ORDER_PAYMENT',
                'payment_method' => $validated['payment_method'],
                'status' => in_array($validated['payment_method'], ['CHEQUE', 'GIRO']) ? 'PENDING' : 'SUCCESS',
                'amount' => $validated['amount'],
                'transaction_date' => $validated['transaction_date'],
                'maturity_date' => $validated['maturity_date'],
                'reference_number' => $validated['reference_number'],
                'notes' => $validated['notes'] ?? "Pembayaran pesanan {$order->order_number}",
                'referenceable_type' => Order::class,
                'referenceable_id' => $order->id,
                'created_by' => auth()->id(),
            ]);

            // 2. Update Order Paid Amount
            $order->increment('paid_amount', $validated['amount']);

            // 3. Update Order Payment Status
            if ($order->paid_amount >= $order->total_amount) {
                $order->update(['payment_status' => 'PAID']);
            } elseif ($order->paid_amount > 0) {
                $order->update(['payment_status' => 'PARTIAL']);
            }
        });

        return back()->with('success', 'Pembayaran berhasil dicatat.');
    }
}
