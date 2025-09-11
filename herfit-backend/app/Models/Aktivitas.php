<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Aktivitas extends Model
{
    protected $table = 'aktivitas';
    protected $primaryKey = 'id_aktivitas';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id_aktivitas',
        'id_pengguna',
        'jenis_aktivitas',
        'nama_aktivitas',
        'kalori',
        'durasi',
        'jadwal',
        'tanggal',
    ];

    protected $casts = [
        'tanggal' => 'date',
    ];

    /** Accessor jadwal */
    public function getJadwalAttribute($value)
    {
        if (is_array($value))
            return $value;

        $first = is_string($value) ? json_decode($value, true) : $value;
        if (is_array($first))
            return $first;

        if (is_string($first)) {
            $second = json_decode($first, true);
            if (is_array($second))
                return $second;
        }

        return [];
    }

    /** Mutator jadwal */
    public function setJadwalAttribute($value): void
    {
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $value = $decoded;
            }
        }
        if (!is_array($value))
            $value = [];

        $this->attributes['jadwal'] = json_encode($value, JSON_UNESCAPED_UNICODE);
    }

    // Scopes
    public function scopeMakanan($q)
    {
        return $q->where('jenis_aktivitas', 'makanan');
    }
    public function scopeLatihan($q)
    {
        return $q->where('jenis_aktivitas', 'latihan');
    }

    // Relasi
    public function pengguna()
    {
        return $this->belongsTo(Pengguna::class, 'id_pengguna');
    }
}
