<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // Company Info
            ['key' => 'company_name', 'value' => 'Mandiri Jaya Teknik', 'group' => 'company'],
            ['key' => 'company_tagline', 'value' => 'Precision Plastic Injection & Mold Specialist', 'group' => 'company'],
            ['key' => 'company_address', 'value' => 'Jl. Industri Utama No. 45, Kawasan Industri Jababeka, Cikarang, Bekasi, Jawa Barat 17530', 'group' => 'company'],
            ['key' => 'company_phone', 'value' => '+62 21 8900 1234', 'group' => 'company'],
            ['key' => 'company_email', 'value' => 'info@mjt.co.id', 'group' => 'company'],
            ['key' => 'company_website', 'value' => 'www.mjt.co.id', 'group' => 'company'],
            
            // Financial Info
            ['key' => 'bank_name', 'value' => 'Bank Mandiri', 'group' => 'finance'],
            ['key' => 'bank_account_number', 'value' => '123-00-0456-7890', 'group' => 'finance'],
            ['key' => 'bank_account_name', 'value' => 'PT. MANDIRI JAYA TEKNIK', 'group' => 'finance'],
            
            // System Config
            ['key' => 'invoice_prefix', 'value' => 'INV/', 'group' => 'system'],
            ['key' => 'do_prefix', 'value' => 'DO/', 'group' => 'system'],
        ];

        foreach ($settings as $s) {
            Setting::updateOrCreate(['key' => $s['key']], $s);
        }
    }
}
