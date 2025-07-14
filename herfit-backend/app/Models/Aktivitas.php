<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Aktivitas extends Model
{
    protected $table = 'aktivitas';
    protected $primaryKey = 'id_aktivitas';

    protected $fillable = [
        'id_pengguna',
        'jenis_aktivitas',
        'nama_aktivitas',
        'kalori',
        'durasi',
        'jadwal',
        'tanggal',
    ];

    protected $casts = [
        'jadwal' => 'array',
        'tanggal' => 'date',
    ];

    public function pengguna()
    {
        return $this->belongsTo(Pengguna::class, 'id_pengguna');
    }
}


