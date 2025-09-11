<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Absensi extends Model
{
    protected $table = 'absensi';
    protected $primaryKey = 'kode_absensi';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'kode_absensi',
        'kode_transaksi',
        'id_pengguna',
        'waktu_scan',
    ];

    // Relasi ke pengguna
    public function pengguna()
    {
        return $this->belongsTo(Pengguna::class, 'id_pengguna', 'id_pengguna');
    }

    // Relasi ke transaksi
    public function transaksi()
    {
        return $this->belongsTo(Transaksi::class, 'kode_transaksi', 'kode_transaksi');
    }
}