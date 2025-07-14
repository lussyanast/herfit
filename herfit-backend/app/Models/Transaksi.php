<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaksi extends Model
{
    protected $table = 'transaksi';
    protected $primaryKey = 'id_transaksi';

    protected $fillable = [
        'kode_transaksi',
        'id_pengguna',
        'id_produk',
        'tanggal_mulai',
        'tanggal_selesai',
        'jumlah_hari',
        'jumlah_bayar',
        'status_transaksi',
        'bukti_pembayaran',
        'kode_qr',
    ];

    public function pengguna(): BelongsTo
    {
        return $this->belongsTo(Pengguna::class, 'id_pengguna');
    }

    public function produk(): BelongsTo
    {
        return $this->belongsTo(Produk::class, 'id_produk');
    }
}
