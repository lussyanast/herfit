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

    public function scopeMakanan($query)
    {
        return $query->where('jenis_aktivitas', 'makanan');
    }

    public function scopeLatihan($query)
    {
        return $query->where('jenis_aktivitas', 'latihan');
    }

    public function pengguna()
    {
        return $this->belongsTo(Pengguna::class, 'id_pengguna');
    }
}