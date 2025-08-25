<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;

class Transaksi extends Model
{
    protected $table = 'transaksi';
    protected $primaryKey = 'id_transaksi';

    /** Status sebagai konstanta biar konsisten */
    public const ST_WAITING = 'waiting';
    public const ST_APPROVED = 'approved';
    public const ST_REJECTED = 'rejected';

    /** Peta transisi legal (FSM) */
    public const TRANSITIONS = [
        self::ST_WAITING => [self::ST_APPROVED, self::ST_REJECTED],
        self::ST_APPROVED => [],
        self::ST_REJECTED => [],
    ];

    protected $fillable = [
        'kode_transaksi',
        'id_pengguna',
        'id_produk',
        'tanggal_mulai',
        'tanggal_selesai',
        'jumlah_hari',
        'jumlah_bayar',
        'status_transaksi',
        'bukti_pembayaran',
        'kode_qr',
    ];

    /** Casting tanggal & angka */
    protected $casts = [
        'tanggal_mulai' => 'datetime',
        'tanggal_selesai' => 'datetime',
        'jumlah_hari' => 'integer',
        'jumlah_bayar' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /** Accessor URL QR siap pakai */
    protected $appends = ['qr_code_url'];

    public function getQrCodeUrlAttribute(): ?string
    {
        return $this->kode_qr ? Storage::url($this->kode_qr) : null;
    }

    /** Relasi */
    public function pengguna(): BelongsTo
    {
        return $this->belongsTo(Pengguna::class, 'id_pengguna');
    }

    public function produk(): BelongsTo
    {
        return $this->belongsTo(Produk::class, 'id_produk');
    }

    /** Guard transisi status di level Model (hard guard) */
    protected static function booted(): void
    {
        static::updating(function (Transaksi $trx) {
            if ($trx->isDirty('status_transaksi')) {
                $from = $trx->getOriginal('status_transaksi');
                $to = $trx->status_transaksi;

                $allowed = self::TRANSITIONS[$from] ?? [];
                if (!in_array($to, $allowed, true)) {
                    throw ValidationException::withMessages([
                        'status_transaksi' => "Transisi tidak valid ($from → $to).",
                    ]);
                }
            }
        });
    }

    /** Helper: cek boleh transisi? */
    public function canTransitionTo(string $to): bool
    {
        return in_array($to, self::TRANSITIONS[$this->status_transaksi] ?? [], true);
    }

    /** Helper: lakukan transisi aman (opsional, kalau mau dipakai di service) */
    public function transitionTo(string $to): void
    {
        if (!$this->canTransitionTo($to)) {
            throw ValidationException::withMessages([
                'status_transaksi' => "Transisi tidak valid ({$this->status_transaksi} → $to).",
            ]);
        }
        $this->update(['status_transaksi' => $to]);
    }

    /** Scope berguna */
    public function scopeByKode($q, string $kode)
    {
        return $q->where('kode_transaksi', $kode);
    }

    public function scopeOwnedBy($q, int $userId)
    {
        return $q->where('id_pengguna', $userId);
    }

    public function scopeApproved($q)
    {
        return $q->where('status_transaksi', self::ST_APPROVED);
    }
}