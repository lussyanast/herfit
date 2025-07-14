<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Absensi extends Model
{
    protected $table = 'absensi';
    protected $primaryKey = 'id_absensi';
    public $timestamps = false;

    protected $fillable = [
        'kode_absensi',
        'id_transaksi',
        'id_pengguna',
        'waktu_scan',
    ];

    public function pengguna()
    {
        return $this->belongsTo(Pengguna::class, 'id_pengguna');
    }

    public function transaksi()
    {
        return $this->belongsTo(Transaksi::class, 'id_transaksi');
    }
}
