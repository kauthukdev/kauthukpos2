<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Anoop Joy',
            'email' => 'anoopjoy@gmail.com',
            'password' => Hash::make('Anoop@123'),
        ]);

        $this->call([
            RoleSeeder::class,
        ]);
    }
}
