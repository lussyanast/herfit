<?php

namespace App\Filament\Resources\ProdukResource\Pages;

use App\Filament\Resources\ProdukResource;
use Filament\Resources\Pages\CreateRecord;

class CreateProduk extends CreateRecord
{
    protected static string $resource = ProdukResource::class;
    protected static ?string $title = 'Buat Produk';

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $max = \App\Models\Produk::withTrashed()
            ->selectRaw("MAX(CAST(SUBSTRING(kode_produk, 4) AS UNSIGNED)) as max_num")
            ->value('max_num');

        $next = ((int) $max) + 1;
        $kode = 'PRD' . str_pad($next, 3, '0', STR_PAD_LEFT);

        while (\App\Models\Produk::withTrashed()->where('kode_produk', $kode)->exists()) {
            $next++;
            $kode = 'PRD' . str_pad($next, 3, '0', STR_PAD_LEFT);
        }

        $data['kode_produk'] = $kode;
        return $data;
    }
}