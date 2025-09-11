<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Postingan extends Model
{
    protected $table = 'postingan';
    protected $primaryKey = 'id_postingan';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id_postingan',
        'id_pengguna',
        'caption',
        'foto_postingan',
    ];

    // relasi
    public function pengguna()
    {
        return $this->belongsTo(Pengguna::class, 'id_pengguna');
    }

    public function interaksi()
    {
        return $this->hasMany(Interaksi::class, 'id_postingan');
    }

    // generate ID otomatis
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->id_postingan) {
                $prefix = "PST";
                $last = static::orderBy('id_postingan', 'desc')->first();

                if ($last) {
                    $num = (int) filter_var($last->id_postingan, FILTER_SANITIZE_NUMBER_INT);
                    $num++;
                } else {
                    $num = 1;
                }

                $model->id_postingan = $prefix . str_pad($num, 4, '0', STR_PAD_LEFT);
            }
        });
    }
}