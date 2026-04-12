<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FinanceTransaction;
use Carbon\Carbon;

class FinanceSeeder extends Seeder
{
    public function run(): void
    {
        $transactions = [
            [
                'type' => 'IN',
                'category' => 'CAPITAL',
                'amount' => 100000000,
                'payment_method' => 'TRANSFER_MANDIRI',
                'status' => 'SUCCESS',
                'transaction_date' => Carbon::now()->subMonths(1),
                'notes' => 'Injeksi modal awal Tahun 2024',
            ],
            [
                'type' => 'OUT',
                'category' => 'OPERATIONAL',
                'amount' => 2500000,
                'payment_method' => 'CASH',
                'status' => 'SUCCESS',
                'transaction_date' => Carbon::now()->subDays(5),
                'notes' => 'Pembayaran tagihan listrik workshop (Januari)',
            ],
            [
                'type' => 'OUT',
                'category' => 'SALARY',
                'amount' => 15000000,
                'payment_method' => 'TRANSFER_BCA',
                'status' => 'SUCCESS',
                'transaction_date' => Carbon::now()->subDays(10),
                'notes' => 'Gaji 5 operator produksi',
            ],
        ];

        foreach ($transactions as $data) {
            FinanceTransaction::create($data);
        }
    }
}
