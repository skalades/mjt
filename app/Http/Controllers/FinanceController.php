<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\FinanceTransaction;
use Inertia\Inertia;
use Inertia\Response;

class FinanceController extends Controller
{
    public function index(): Response
    {
        $transactions = FinanceTransaction::with(['creator', 'referenceable'])
            ->latest()
            ->paginate(15);

        // Basic stats for the dashboard
        $balance = FinanceTransaction::where('status', 'SUCCESS')
            ->selectRaw("SUM(CASE WHEN type = 'IN' THEN amount ELSE -amount END) as total")
            ->value('total') ?? 0;

        $pendingGiro = FinanceTransaction::where('status', 'PENDING')
            ->whereIn('payment_method', ['CHEQUE', 'GIRO'])
            ->sum('amount');

        return Inertia::render('Finance/Index', [
            'transactions' => $transactions,
            'stats' => [
                'total_balance' => (int) $balance,
                'pending_giro' => (int) $pendingGiro,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:IN,OUT',
            'category' => 'required|in:CAPITAL,OPERATIONAL,SALARY,OTHER',
            'amount' => 'required|numeric|min:1',
            'payment_method' => 'required|in:CASH,TRANSFER_MANDIRI,TRANSFER_BCA,CHEQUE,GIRO',
            'transaction_date' => 'required|date',
            'maturity_date' => 'nullable|date|required_if:payment_method,CHEQUE,GIRO',
            'source' => 'nullable|string',
            'reference_number' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        FinanceTransaction::create([
            ...$validated,
            'status' => in_array($validated['payment_method'], ['CHEQUE', 'GIRO']) ? 'PENDING' : 'SUCCESS',
            'created_by' => auth()->id(),
        ]);

        return redirect()->route('finance.index')->with('success', 'Transaksi berhasil dicatat.');
    }
}
