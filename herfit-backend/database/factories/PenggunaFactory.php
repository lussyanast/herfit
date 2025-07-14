<?php

namespace Database\Factories;

use App\Models\Pengguna;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PenggunaFactory extends Factory
{
    protected $model = Pengguna::class;

    public function definition(): array
    {
        return [
            'peran_pengguna' => 'member',
            'nama_lengkap' => $this->faker->name(),
            'email' => substr($this->faker->unique()->safeEmail(), 0, 30),
            'kata_sandi' => Hash::make('password'),
            'no_identitas' => $this->faker->numerify('################'),
            'no_telp' => $this->faker->numerify('08##########'),
            'foto_profil' => null,
        ];
    }
}
