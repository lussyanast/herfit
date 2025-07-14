<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Interaksi extends Model
{
    protected $table = 'interaksi';
    protected $primaryKey = 'id_interaksi';
    public $timestamps = false;

    protected $fillable = [
        'id_pengguna',
        'id_postingan',
        'jenis_interaksi',
        'isi_komentar',
        'waktu_interaksi',
    ];

    public function pengguna()
    {
        return $this->belongsTo(Pengguna::class, 'id_pengguna');
    }

    public function postingan()
    {
        return $this->belongsTo(Postingan::class, 'id_postingan');
    }
}
