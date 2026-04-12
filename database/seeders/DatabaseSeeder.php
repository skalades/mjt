<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin MJT',
            'email' => 'admin@mjt.co.id',
            'password' => bcrypt('password'),
        ]);

        $this->call([
            InventoryItemSeeder::class,
            MoldSeeder::class,
            OrderSeeder::class,
            FinanceSeeder::class,
            SettingSeeder::class,
        ]);
    }
}
