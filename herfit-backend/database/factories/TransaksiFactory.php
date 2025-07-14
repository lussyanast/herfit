<?php

namespace Database\Factories;

use App\Models\Transaksi;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;

class TransaksiFactory extends Factory
{
    protected $model = Transaksi::class;

    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('-10 days', '+1 days');
        $endDate = (clone $startDate)->modify('+' . mt_rand(1, 3) . ' days');

        return [
            'kode_transaksi' => strtoupper(Str::random(10)),
            'tanggal_mulai' => $startDate->format('Y-m-d'),
            'tanggal_selesai' => $endDate->format('Y-m-d'),
            'jumlah_hari' => $startDate->diff($endDate)->days + 1,
            'jumlah_bayar' => $this->faker->numberBetween(100000, 500000),
            'status_transaksi' => $this->faker->randomElement(['waiting', 'approved', 'rejected']),
            'bukti_pembayaran' => null,
            'kode_qr' => null,
        ];
    }
}
