<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Produk extends Model
{
    use HasFactory, SoftDeletes;

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

    public function transaksi()
    {
        return $this->hasMany(Transaksi::class, 'id_produk', 'id_produk');
    }
}
