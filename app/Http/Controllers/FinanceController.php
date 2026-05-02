<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFinanceTransactionRequest;
use App\Models\FinanceTransaction;
use App\Services\FinanceService;
use Inertia\Inertia;
use Inertia\Response;

class FinanceController extends Controller
{
    protected $financeService;

    public function __construct(FinanceService $financeService)
    {
        $this->financeService = $financeService;
    }

    public function index(): Response
    {
        $transactions = FinanceTransaction::with(['creator', 'referenceable'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Finance/Index', [
            'transactions' => $transactions,
            'stats' => $this->financeService->getSummary(),
        ]);
    }

    public function store(StoreFinanceTransactionRequest $request)
    {
        $this->financeService->createTransaction($request->validated());

        return redirect()->route('finance.index')->with('success', 'Transaksi berhasil dicatat.');
    }

    public function destroy(FinanceTransaction $finance)
    {
        $this->financeService->deleteTransaction($finance);

        return redirect()->route('finance.index')->with('success', 'Transaksi berhasil dihapus.');
    }
}


