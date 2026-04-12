<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Mold;

class MoldSeeder extends Seeder
{
    public function run(): void
    {
        $molds = [
            [
                'mold_code' => 'MLD-SPK-01',
                'name' => 'Mold Casing Speaker 4 Inch',
                'client_name' => 'PT. Mitra Plastik',
                'status' => 'ACTIVE',
                'location' => 'Rak A-12',
            ],
            [
                'mold_code' => 'MLD-HDL-05',
                'name' => 'Mold Handle Pintu Kulkas V2',
                'client_name' => 'PT. Sumber Jaya',
                'status' => 'MAINTENANCE',
                'location' => 'Area Maintenance',
            ],
            [
                'mold_code' => 'MLD-BPL-09',
                'name' => 'Mold Base Plate Industrial',
                'client_name' => 'CV. Berkah Sentosa',
                'status' => 'ACTIVE',
                'location' => 'Rak B-01',
            ],
        ];

        foreach ($molds as $data) {
            Mold::create($data);
        }
    }
}
