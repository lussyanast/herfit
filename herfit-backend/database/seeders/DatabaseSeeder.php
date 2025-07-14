<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pengguna;
use App\Models\Produk;
use App\Models\Transaksi;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ✅ Admin user
        Pengguna::create([
            'peran_pengguna' => 'admin',
            'nama_lengkap' => 'Admin Lussy',
            'email' => 'adminlussy@gmail.com',
            'kata_sandi' => Hash::make('admin123'),
            'no_telp' => '085772492505',
            'no_identitas' => '1234567890123456',
        ]);

        // ✅ Member users dummy
        Pengguna::factory()->count(10)->create([
            'peran_pengguna' => 'member',
        ]);

        // ✅ Produk dummy
        Produk::factory()->count(10)->create();
    }
}
