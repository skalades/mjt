<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::truncate();

        $products = [
            ['name' => 'ALT SIS', 'price' => 1500],
            ['name' => 'POLE CAP B', 'price' => 2500],
            ['name' => 'POLE CAP D', 'price' => 2500],
            ['name' => 'CONECTING B', 'price' => 3500],
            ['name' => 'CONECTING D', 'price' => 3500],
            ['name' => 'VAKUM A', 'price' => 1250],
            ['name' => 'VAKUM B', 'price' => 1250],
            ['name' => 'VAKUM CUTTING', 'price' => 7000],
            ['name' => 'YAMAHA', 'price' => 10000],
            ['name' => 'RUBBER WHELL LINE', 'price' => 7000],
            ['name' => 'RUBBER MOUNTING', 'price' => 12000],
            ['name' => 'RUBBER BASE PLATE', 'price' => 600000],
            ['name' => 'RUBBER LEAK TESTER', 'price' => 60000],
            ['name' => 'STAINLES', 'price' => 15000],
            ['name' => 'KOIN', 'price' => 4000],
            ['name' => 'PENTIL', 'price' => 8000],
            ['name' => 'SILICON RESIN', 'price' => 15000],
            ['name' => 'DISC PABRIK', 'price' => 15000],
            ['name' => 'RING ASBES', 'price' => 2000],
            ['name' => 'SIDE STOP', 'price' => 7000],
            ['name' => 'MEMBRAN', 'price' => 25000],
            ['name' => 'BUSSING CARBON', 'price' => 40000],
            ['name' => 'ALT NEW', 'price' => 3000],
            ['name' => 'ALT D34', 'price' => 11000],
            ['name' => 'ALT D29', 'price' => 8000],
            ['name' => 'HILLAN', 'price' => 7000],
            ['name' => 'HD 30', 'price' => 2000],
            ['name' => 'ROLLER A', 'price' => 37000],
            ['name' => 'CONECTING MOTOR', 'price' => 3000],
            ['name' => 'HEAD ALT D24', 'price' => 6000],
            ['name' => 'VAKUM WHELL', 'price' => 7000],
            ['name' => 'RUBBER KOTAK', 'price' => 7000],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
