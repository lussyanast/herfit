<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Postingan extends Model
{
    protected $table = 'postingan';
    protected $primaryKey = 'id_postingan';

    protected $fillable = [
        'id_pengguna',
        'caption',
        'foto_postingan',
    ];

    public function pengguna()
    {
        return $this->belongsTo(Pengguna::class, 'id_pengguna');
    }

    public function interaksi()
    {
        return $this->hasMany(Interaksi::class, 'id_postingan');
    }
}
