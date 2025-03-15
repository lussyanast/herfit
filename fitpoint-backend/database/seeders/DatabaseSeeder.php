<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Listing;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin Lussy',
            'email' => 'lussyanast@gmail.com',
            'password' => 'admin',
            'role' => 'admin'
        ]);

        $listings = Listing::factory(10)->create();
    }
}
