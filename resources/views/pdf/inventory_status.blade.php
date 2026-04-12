@extends('pdf.layouts.pdf')

@section('title', 'Laporan Stok - MJT')
@section('document_type', 'Status Stok Gudang')
@section('document_number', 'Kondisi Per: ' . date('d/m/Y'))

@section('content')
    <div class="mb-4">
        <div style="background-color: #fefce8; padding: 15px; border: 1px solid #fef08a; border-radius: 8px;">
            <div class="font-bold uppercase" style="font-size: 9px; color: #854d0e;">Peringatan Stok Rendah:</div>
            <div style="font-size: 11px; margin-top: 5px;">
                Terdapat {{ $items->filter(fn($i) => $i->total_stock <= $i->min_stock_threshold)->count() }} item yang memerlukan pengadaan segera (di bawah ambang batas minimal).
            </div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>SKU</th>
                <th>NAMA BARANG</th>
                <th class="text-center">STOK SAAT INI</th>
                <th class="text-center">MINIMAL</th>
                <th class="text-center">SATUAN</th>
                <th>STATUS</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $item)
                @php $isLow = $item->total_stock <= $item->min_stock_threshold; @endphp
                <tr>
                    <td class="font-bold">{{ $item->sku }}</td>
                    <td>{{ $item->name }}</td>
                    <td class="text-center font-bold {{ $isLow ? 'text-danger' : '' }}" style="{{ $isLow ? 'color: #ef4444;' : '' }}">
                        {{ number_format($item->total_stock, 0, ',', '.') }}
                    </td>
                    <td class="text-center text-gray-500">{{ number_format($item->min_stock_threshold, 0, ',', '.') }}</td>
                    <td class="text-center">{{ $item->unit }}</td>
                    <td>
                        <span class="badge {{ $isLow ? 'badge-danger' : 'badge-success' }}" style="{{ $isLow ? 'background-color: #fee2e2; color: #b91c1c;' : '' }}">
                            {{ $isLow ? 'RE-STOCK' : 'AMAN' }}
                        </span>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div style="margin-top: 50px;">
        <table border="0">
            <tr>
                <td style="width: 50%; border: 0;">
                    <div style="font-size: 10px; font-weight: bold; margin-bottom: 60px;">Disiapkan Oleh (Gudang),</div>
                    <div class="signature-line" style="margin-left: 0; width: 200px;"></div>
                </td>
                <td style="width: 50%; border: 0; text-align: right;">
                    <div style="font-size: 10px; font-weight: bold; margin-bottom: 60px;">Diketahui Oleh (Manajer),</div>
                    <div class="signature-line" style="margin-left: auto; width: 200px;"></div>
                </td>
            </tr>
        </table>
    </div>
@endsection
