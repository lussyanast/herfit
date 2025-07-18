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
        // Hitung total produk atau ambil ID terakhir (yang lebih aman)
        $lastProduk = \App\Models\Produk::latest('id_produk')->first();
        $nextId = $lastProduk ? $lastProduk->id_produk + 1 : 1;

        $data['kode_produk'] = 'PRD' . $nextId;

        return $data;
    }
}
