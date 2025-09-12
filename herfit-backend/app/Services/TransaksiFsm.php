<?php

namespace App\Services;

use App\Models\Transaksi;
use App\Models\Absensi;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class TransaksiFsm
{
    public function handle(Transaksi $trx, string $event): string
    {
        $cur = $trx->status_transaksi;

        switch ($cur) {
            case 'waiting':
                if ($event === 'approve') {
                    $this->setStatus($trx, 'approved');
                    return 'approved';
                }
                if ($event === 'reject') {
                    $this->setStatus($trx, 'rejected');
                    return 'rejected';
                }
                return 'invalid';

            case 'approved':
                if ($event !== 'scan') {
                    return 'invalid';
                }

                $now = Carbon::now();
                $start = Carbon::parse($trx->tanggal_mulai);
                $end = Carbon::parse($trx->tanggal_selesai);

                if ($now->lt($start)) {
                    return 'not_active';
                }
                if ($now->gt($end)) {
                    return 'expired';
                }

                // ✅ simpan absensi
                Absensi::create([
                    'kode_absensi' => 'ABS' . $now->format('YmdHis'),
                    'kode_transaksi' => $trx->kode_transaksi,
                    'id_pengguna' => Auth::id(),
                    'waktu_scan' => $now,
                ]);

                return 'active';

            default:
                return 'invalid';
        }
    }

    private function setStatus(Transaksi $trx, string $new): void
    {
        $allowed = [
            'waiting' => ['approved', 'rejected'],
            'approved' => [],
            'rejected' => [],
        ];

        $cur = $trx->status_transaksi;
        if (!in_array($new, $allowed[$cur] ?? [], true)) {
            abort(422, "Transisi tidak valid ($cur → $new).");
        }

        $trx->update(['status_transaksi' => $new]);
    }
}