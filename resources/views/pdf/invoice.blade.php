@extends('pdf.layouts.pdf')

@section('title', 'Invoice - ' . $order->order_number)
@section('document_type', 'Proforma Invoice')
@section('document_number', $order->order_number)

@section('content')
    <div class="mb-4">
        <table border="0">
            <tr>
                <td style="width: 50%; border: 0;">
                    <div class="font-bold uppercase text-gray-500" style="font-size: 9px;">Ditagihkan Kepada:</div>
                    <div style="font-size: 16px; font-weight: bold; margin-top: 5px;">{{ $order->client_name }}</div>
                </td>
                <td style="width: 50%; border: 0; text-align: right;">
                    <div class="font-bold uppercase text-gray-500" style="font-size: 9px;">Tanggal Dokumen:</div>
                    <div style="font-weight: bold; margin-top: 5px;">{{ \App\Helpers\DateHelper::formatIndonesian($order->created_at) }}</div>
                    <div class="font-bold uppercase text-gray-500" style="font-size: 9px; margin-top: 10px;">Jatuh Tempo:</div>
                    <div style="color: #f37021; font-weight: bold;">{{ \App\Helpers\DateHelper::formatIndonesian($order->due_date) }}</div>
                </td>
            </tr>
        </table>
    </div>

    <table>
        <thead>
            <tr>
                <th>Deskripsi Produk / Item Produksi</th>
                <th class="text-center">QTY</th>
                <th class="text-right">Harga Satuan</th>
                <th class="text-right">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
                <tr>
                    <td class="font-bold">{{ $item->item_name }}</td>
                    <td class="text-center">{{ $item->quantity }}</td>
                    <td class="text-right">{{ number_format($item->unit_price, 0, ',', '.') }}</td>
                    <td class="text-right font-bold">{{ number_format($item->subtotal, 0, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td colspan="3" class="text-right font-bold" style="text-transform: uppercase; font-size: 10px; color: #64748b;">Total Tagihan</td>
                <td class="text-right font-bold" style="font-size: 16px; color: #f37021;">
                    Rp {{ number_format($order->total_amount, 0, ',', '.') }}
                </td>
            </tr>
            <tr>
                <td colspan="3" class="text-right font-bold" style="text-transform: uppercase; font-size: 9px;">Sudah Dibayar</td>
                <td class="text-right font-bold text-success" style="color: #166534;">
                    Rp {{ number_format($order->paid_amount, 0, ',', '.') }}
                </td>
            </tr>
            <tr style="background-color: #fffaf5;">
                <td colspan="3" class="text-right font-bold" style="text-transform: uppercase;">Sisa Tagihan (Balance)</td>
                <td class="text-right font-bold" style="font-size: 14px; border-top: 2px solid #f37021;">
                    Rp {{ number_format($order->total_amount - $order->paid_amount, 0, ',', '.') }}
                </td>
            </tr>
        </tfoot>
    </table>

    <div class="mt-4" style="background-color: #f8fafc; padding: 15px; border-radius: 8px;">
        <div class="font-bold uppercase" style="font-size: 9px; color: #64748b; margin-bottom: 5px;">Instruksi Pembayaran:</div>
        <div style="font-size: 11px;">
            Silakan melakukan transfer ke rekening berikut:<br>
            <span class="font-bold text-mjt-orange">{{ App\Models\Setting::get('bank_name') }}</span><br>
            Nomor Rekening: <span class="font-bold">{{ App\Models\Setting::get('bank_account_number') }}</span><br>
            Atas Nama: <span class="font-bold">{{ App\Models\Setting::get('bank_account_name') }}</span>
        </div>
    </div>

    <div class="signature-sections">
        <div class="signature-box" style="float: left;">
            <div style="font-size: 10px; font-weight: bold; margin-bottom: 50px;">Disiapkan Oleh,</div>
            <div class="signature-line"></div>
            <div style="font-size: 9px;">Administrasi MJT</div>
        </div>
        <div class="signature-box" style="float: right;">
            <div style="font-size: 10px; font-weight: bold; margin-bottom: 50px;">Penerima / Klien,</div>
            <div class="signature-line"></div>
            <div style="font-size: 9px;">(Stempel & Tanda Tangan)</div>
        </div>
        <div style="clear: both;"></div>
    </div>
@endsection
