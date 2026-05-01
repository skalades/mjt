@extends('pdf.layouts.pdf')

@section('title', 'Surat Jalan - ' . $order->order_number)
@section('document_type', 'Surat Jalan (DO)')
@section('document_number', str_replace('ORD', 'DO', $order->order_number))

@section('content')
    <div class="mb-4">
        <table border="0">
            <tr>
                <td style="width: 50%; border: 0;">
                    <div class="font-bold uppercase text-gray-500" style="font-size: 9px;">Penerima / Ship To:</div>
                    <div style="font-size: 16px; font-weight: bold; margin-top: 5px;">{{ $order->client_name }}</div>
                </td>
                <td style="width: 50%; border: 0; text-align: right;">
                    <div class="font-bold uppercase text-gray-500" style="font-size: 9px;">Tanggal Kirim:</div>
                    <div style="font-weight: bold; margin-top: 5px;">{{ \App\Helpers\DateHelper::formatIndonesian(date('Y-m-d')) }}</div>
                    <div class="font-bold uppercase text-gray-500" style="font-size: 9px; margin-top: 10px;">No. Referensi Pesanan:</div>
                    <div style="color: #f37021; font-weight: bold;">{{ $order->order_number }}</div>
                </td>
            </tr>
        </table>
    </div>

    <div style="padding: 10px; background-color: #f8fafc; border-radius: 8px; margin-bottom: 20px; font-size: 11px;">
        Harap diterima barang-barang tersebut di bawah ini dalam keadaan baik dan cukup menurut pesanan kami.
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 10%;">NO</th>
                <th>Deskripsi Produk / Item</th>
                <th class="text-center">KUANTITAS (QTY)</th>
                <th class="text-center">SATUAN</th>
                <th class="text-center">KETERANGAN</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td class="font-bold">{{ $item->item_name }}</td>
                    <td class="text-center font-bold">{{ $item->quantity }}</td>
                    <td class="text-center">PCS / UNIT</td>
                    <td class="text-center">-</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="signature-sections" style="margin-top: 80px;">
        <div class="signature-box" style="float: left;">
            <div style="font-size: 10px; font-weight: bold; margin-bottom: 60px;">Dikeluarkan Oleh,</div>
            <div class="signature-line"></div>
            <div style="font-size: 9px;">Gudang MJT</div>
        </div>
        <div class="signature-box" style="float: right;">
            <div style="font-size: 10px; font-weight: bold; margin-bottom: 60px;">Diterima Oleh,</div>
            <div class="signature-line"></div>
            <div style="font-size: 9px;">(Stempel & Tanda Tangan)</div>
        </div>
        <div style="clear: both;"></div>
    </div>

    <div style="margin-top: 40px; font-size: 9px; color: #64748b; font-style: italic;">
        * Barang yang sudah dibeli/diterima tidak dapat dikembalikan tanpa persetujuan terlebih dahulu.
    </div>
@endsection
