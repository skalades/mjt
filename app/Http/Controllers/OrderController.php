<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\RecordPaymentRequest;
use App\Models\Order;
use App\Models\InventoryItem;
use App\Models\Product;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

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
        return Inertia::render('Orders/Create', [
            'products' => Product::where('is_active', true)->orderBy('name')->get(),
        ]);
    }

    public function store(StoreOrderRequest $request)
    {
        $this->orderService->createOrder($request->validated());

        return redirect()->route('orders.index')->with('success', 'Pesanan berhasil dibuat.');
    }

    public function show(Order $order): Response
    {
        return Inertia::render('Orders/Show', [
            'order' => $order->load(['items', 'materialUsages.inventoryItem', 'financeTransactions' => fn($q) => $q->latest()]),
            'inventoryItems' => InventoryItem::all(),
        ]);
    }

    /**
     * Record a payment for an order and sync with Finance Ledger.
     */
    public function recordPayment(RecordPaymentRequest $request, Order $order)
    {
        $this->orderService->recordPayment($order, $request->validated());

        return back()->with('success', 'Pembayaran berhasil dicatat.');
    }

    /**
     * Update order status.
     */
    public function update(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|string',
        ]);

        $this->orderService->updateStatus($order, $request->status);

        return back()->with('success', 'Status pesanan berhasil diperbarui.');
    }
}


