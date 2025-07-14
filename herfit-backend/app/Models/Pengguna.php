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
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
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

    /**
     * Laravel uses this to get the password field name
     */
    public function getAuthPassword()
    {
        return $this->kata_sandi;
    }

    /**
     * Allow admin role to access Filament
     */
    public function canAccessPanel(Panel $panel): bool
    {
        return $this->peran_pengguna === 'admin';
    }

    /**
     * Used by Filament to show user name in UI
     */
    public function getNameAttribute(): string
    {
        return $this->nama_lengkap ?? 'Pengguna';
    }
}
