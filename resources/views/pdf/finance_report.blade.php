@extends('pdf.layouts.pdf')

@section('title', 'Laporan Kuangan - MJT')
@section('document_type', 'Buku Besar Keuangan')
@section('document_number', 'Periode: ' . date('F Y'))

@section('content')
    <div class="mb-4">
        <table border="0">
            <tr>
                <td style="width: 50%; border: 0;">
                    <div class="font-bold uppercase text-gray-500" style="font-size: 9px;">Ringkasan Saldo Berjalan:</div>
                    <div style="font-size: 20px; font-weight: bold; margin-top: 5px; color: #1e293b;">
                        Rp {{ number_format(\App\Models\FinanceTransaction::where('status', 'SUCCESS')->where('type', 'IN')->sum('amount') - \App\Models\FinanceTransaction::where('status', 'SUCCESS')->where('type', 'OUT')->sum('amount'), 0, ',', '.') }}
                    </div>
                </td>
                <td style="width: 50%; border: 0; text-align: right;">
                    <div class="font-bold uppercase text-gray-500" style="font-size: 9px;">Tanggal Cetak:</div>
                    <div style="font-weight: bold; margin-top: 5px;">{{ \App\Helpers\DateHelper::formatIndonesian(date('Y-m-d')) }}</div>
                </td>
            </tr>
        </table>
    </div>

    <table>
        <thead>
            <tr>
                <th>TANGGAL</th>
                <th>KATEGORI</th>
                <th>KETERANGAN</th>
                <th class="text-right">NOMINAL</th>
            </tr>
        </thead>
        <tbody>
            @foreach($transactions as $tx)
                <tr>
                    <td>{{ \App\Helpers\DateHelper::formatIndonesian($tx->transaction_date) }}</td>
                    <td class="font-bold">{{ str_replace('_', ' ', $tx->category) }}</td>
                    <td>{{ $tx->notes ?: '-' }}</td>
                    <td class="text-right font-bold {{ $tx->type == 'IN' ? 'text-success' : '' }}" style="{{ $tx->type == 'OUT' ? 'color: #ef4444;' : 'color: #166534;' }}">
                        {{ $tx->type == 'IN' ? '+' : '-' }} {{ number_format($tx->amount, 0, ',', '.') }}
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div style="margin-top: 40px; text-align: right; padding-right: 50px;">
        <div style="font-size: 10px; font-weight: bold; margin-bottom: 60px;">Disetujui Oleh (Direktur),</div>
        <div class="signature-line" style="margin-left: auto; width: 200px;"></div>
        <div style="font-size: 9px; margin-top: 5px;">{{ App\Models\Setting::get('company_name') }}</div>
    </div>
@endsection
