<?php

namespace Database\Factories;

use App\Models\Produk;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProdukFactory extends Factory
{
    protected $model = Produk::class;

    public function definition(): array
    {
        return [
            'kode_produk' => strtoupper($this->faker->bothify('PRD###')),
            'nama_produk' => $this->faker->words(2, true),
            'kategori_produk' => $this->faker->randomElement(['latihan', 'makanan']),
            'deskripsi_produk' => $this->faker->sentence(10),
            'maksimum_peserta' => $this->faker->numberBetween(1, 10),
            'harga_produk' => $this->faker->numberBetween(100000, 500000),
            'foto_produk' => null,
        ];
    }
}
