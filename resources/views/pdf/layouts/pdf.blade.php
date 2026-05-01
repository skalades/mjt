<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>@yield('title', 'Document MJT')</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 12px;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }
        .header {
            border-bottom: 2px solid #f37021;
            padding-bottom: 15px;
            margin-bottom: 30px;
        }
        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #1e293b;
            text-transform: uppercase;
            margin: 0;
        }
        .company-tagline {
            font-size: 10px;
            color: #64748b;
            font-weight: bold;
            margin-top: -5px;
            text-transform: uppercase;
        }
        .company-info {
            font-size: 10px;
            color: #475569;
            margin-top: 5px;
        }
        .document-title {
            text-align: right;
            font-size: 32px;
            font-weight: bold;
            color: #f37021;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: -1px;
        }
        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 9px;
            color: #94a3b8;
            border-top: 1px solid #f1f5f9;
            padding-top: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th {
            background-color: #f8fafc;
            color: #475569;
            font-weight: bold;
            text-align: left;
            padding: 10px;
            border-bottom: 1px solid #e2e8f0;
            text-transform: uppercase;
            font-size: 9px;
        }
        td {
            padding: 10px;
            border-bottom: 1px solid #f1f5f9;
            vertical-align: top;
        }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
        .mt-4 { margin-top: 20px; }
        .mb-4 { margin-bottom: 20px; }
        
        .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .badge-success { background-color: #dcfce7; color: #166534; }
        
        .signature-sections {
            margin-top: 50px;
        }
        .signature-box {
            width: 30%;
            display: inline-block;
            text-align: center;
        }
        .signature-line {
            margin-top: 60px;
            border-top: 1px solid #000;
            width: 80%;
            margin-left: 10%;
        }
    </style>
</head>
<body>
    <div class="header">
        <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 0;">
            <tr>
                <td style="border: 0; padding: 0;">
                    <h1 class="company-name">{{ App\Models\Setting::get('company_name', 'Mandiri Jaya Teknik') }}</h1>
                    <div class="company-tagline">{{ App\Models\Setting::get('company_tagline', 'Spesialis Pengolahan Karet') }}</div>
                    <div class="company-info">
                        {{ App\Models\Setting::get('company_address') }}<br>
                        Telp: {{ App\Models\Setting::get('company_phone') }} | Email: {{ App\Models\Setting::get('company_email') }}
                    </div>
                </td>
                <td style="border: 0; padding: 0; text-align: right; vertical-align: top;">
                    <h2 class="document-title">@yield('document_type')</h2>
                    <div style="font-weight: bold; color: #64748b;">@yield('document_number')</div>
                </td>
            </tr>
        </table>
    </div>

    @yield('content')

    <div class="footer">
        Dihasilkan secara otomatis oleh Sistem MJT - {{ date('d/m/Y H:i') }}<br>
        {{ App\Models\Setting::get('company_website', 'www.mjt.co.id') }}
    </div>
</body>
</html>
