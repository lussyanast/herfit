<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produk extends Model
{
    protected $table = 'produk';
    protected $primaryKey = 'id_produk';

    protected $fillable = [
        'kode_produk',
        'nama_produk',
        'kategori_produk',
        'deskripsi_produk',
        'maksimum_peserta',
        'harga_produk',
        'foto_produk',
    ];
}
