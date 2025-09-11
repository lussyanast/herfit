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

    public function getAuthPassword()
    {
        return $this->kata_sandi;
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->peran_pengguna === 'admin';
    }

    public function getNameAttribute(): string
    {
        return $this->nama_lengkap ?? 'Pengguna';
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->id_pengguna) {
                $prefix = strtoupper(substr($model->peran_pengguna, 0, 3)); // ADM / MBR

                $last = static::where('id_pengguna', 'like', $prefix . '%')
                    ->orderBy('id_pengguna', 'desc')
                    ->first();

                if ($last) {
                    $number = (int) substr($last->id_pengguna, strlen($prefix));
                    $number++;
                } else {
                    $number = 1;
                }

                $model->id_pengguna = $prefix . str_pad($number, 3, '0', STR_PAD_LEFT);
            }
        });
    }
}
