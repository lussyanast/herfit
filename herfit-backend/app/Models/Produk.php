<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Produk extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'produk';
    protected $primaryKey = 'kode_produk';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'kode_produk',
        'nama_produk',
        'kategori_produk',
        'deskripsi_produk',
        'maksimum_peserta',
        'harga_produk',
        'foto_produk',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->kode_produk) {
                $last = static::withTrashed()
                    ->where('kode_produk', 'like', 'PRD%')
                    ->orderByDesc('kode_produk')
                    ->first();

                if ($last) {
                    $number = (int) substr($last->kode_produk, 3);
                    $number++;
                } else {
                    $number = 1;
                }

                $model->kode_produk = 'PRD' . str_pad($number, 3, '0', STR_PAD_LEFT);
            }
        });
    }

    public function transaksi()
    {
        return $this->hasMany(Transaksi::class, 'kode_produk', 'kode_produk');
    }
}