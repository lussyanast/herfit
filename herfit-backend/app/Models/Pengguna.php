<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;

class Pengguna extends Authenticatable implements FilamentUser
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'pengguna';
    protected $primaryKey = 'id_pengguna';

    // Karena PK string (bukan auto increment)
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id_pengguna',
        'peran_pengguna',
        'nama_lengkap',
        'email',
        'kata_sandi',
        'no_identitas',
        'no_telp',
        'foto_profil',
    ];

    protected $hidden = [
        'kata_sandi',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // Supaya Laravel Auth tetap jalan pakai kolom kata_sandi
    public function getAuthPassword()
    {
        return $this->kata_sandi;
    }

    // Hak akses ke Filament
    public function canAccessPanel(Panel $panel): bool
    {
        return $this->peran_pengguna === 'admin';
    }

    // Untuk tampilan nama di Filament
    public function getNameAttribute(): string
    {
        return $this->nama_lengkap ?? 'Pengguna';
    }

    // Auto generate ID Pengguna dengan prefix sesuai peran
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->id_pengguna) {
                // ambil 3 huruf pertama dari peran (biar lebih jelas: ADM / MBR / DST)
                $prefix = strtoupper(substr($model->peran_pengguna, 0, 3));

                $lastId = static::where('peran_pengguna', $model->peran_pengguna)
                    ->orderBy('id_pengguna', 'desc')
                    ->first();

                if ($lastId) {
                    $number = (int)substr($lastId->id_pengguna, strlen($prefix));
                    $number++;
                } else {
                    $number = 1;
                }

                $model->id_pengguna = $prefix . str_pad($number, 3, '0', STR_PAD_LEFT);
            }
        });
    }
}