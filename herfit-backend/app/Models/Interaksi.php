<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Interaksi extends Model
{
    protected $table = 'interaksi';
    protected $primaryKey = 'id_interaksi';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'id_interaksi',
        'id_pengguna',
        'id_postingan',
        'jenis_interaksi',
        'isi_komentar',
        'waktu_interaksi',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->id_interaksi) {
                $prefix = match ($model->jenis_interaksi) {
                    'komentar' => 'KOM',
                    'like'     => 'LIK',
                };

                // Cari ID terakhir untuk prefix ini
                $last = static::where('id_interaksi', 'like', $prefix . '%')
                    ->orderBy('id_interaksi', 'desc')
                    ->first();

                if ($last) {
                    $number = (int) substr($last->id_interaksi, strlen($prefix));
                    $number++;
                } else {
                    $number = 1;
                }

                $model->id_interaksi = $prefix . str_pad($number, 4, '0', STR_PAD_LEFT);
            }
        });
    }

    // Relasi
    public function pengguna()
    {
        return $this->belongsTo(Pengguna::class, 'id_pengguna');
    }

    public function postingan()
    {
        return $this->belongsTo(Postingan::class, 'id_postingan');
    }
}