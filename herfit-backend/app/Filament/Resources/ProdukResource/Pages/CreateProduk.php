<?php

namespace App\Filament\Resources\ProdukResource\Pages;

use App\Filament\Resources\ProdukResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateProduk extends CreateRecord
{
    protected static string $resource = ProdukResource::class;
    protected static ?string $title = 'Buat Produk';

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        // Ambil angka terbesar dari kolom kode_produk: "PRD123" -> 123
        $max = \App\Models\Produk::withTrashed()
            ->selectRaw("MAX(CAST(SUBSTRING(kode_produk, 4) AS UNSIGNED)) as max_num")
            ->value('max_num');

        $next = ((int) $max) + 1;

        // Kalau mau tetap 3 digit (PRD001..PRD999), pakai str_pad:
        // $kode = 'PRD' . str_pad($next, 3, '0', STR_PAD_LEFT);
        $kode = 'PRD' . $next;

        // Jaga-jaga kalau tetap bentrok karena race condition
        while (\App\Models\Produk::withTrashed()->where('kode_produk', $kode)->exists()) {
            $next++;
            // $kode = 'PRD' . str_pad($next, 3, '0', STR_PAD_LEFT);
            $kode = 'PRD' . $next;
        }

        $data['kode_produk'] = $kode;

        return $data;
    }
}
