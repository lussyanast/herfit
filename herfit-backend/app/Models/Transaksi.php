<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Transaksi extends Model
{
    protected $table = 'transaksi';
    protected $primaryKey = 'kode_transaksi';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'kode_transaksi',
        'id_pengguna',
        'kode_produk',
        'tanggal_mulai',
        'tanggal_selesai',
        'jumlah_hari',
        'jumlah_bayar',
        'status_transaksi',
        'bukti_pembayaran',
        'kode_qr',
    ];

    protected $casts = [
        'tanggal_mulai' => 'datetime',
        'tanggal_selesai' => 'datetime',
        'jumlah_hari' => 'integer',
        'jumlah_bayar' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $appends = ['qr_code_url'];

    public function getQrCodeUrlAttribute(): ?string
    {
        return $this->kode_qr ? Storage::url($this->kode_qr) : null;
    }

    public function pengguna(): BelongsTo
    {
        return $this->belongsTo(Pengguna::class, 'id_pengguna');
    }

    public function produk(): BelongsTo
    {
        return $this->belongsTo(Produk::class, 'kode_produk', 'kode_produk');
    }

    public function scopeByKode($q, string $kode)
    {
        return $q->where('kode_transaksi', $kode);
    }

    public function scopeOwnedBy($q, string $userId)
    {
        return $q->where('id_pengguna', $userId);
    }

    public function scopeApproved($q)
    {
        return $q->where('status_transaksi', 'approved');
    }
}