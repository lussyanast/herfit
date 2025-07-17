<?php

namespace App\Filament\Pages;

use App\Models\Transaksi;
use App\Models\Absensi;
use Carbon\Carbon;
use Filament\Pages\Page;
use Filament\Notifications\Notification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ScanTransactionQR extends Page
{
    public static ?string $navigationIcon = 'heroicon-o-qr-code';
    public static string $view = 'filament.pages.scan-transaction-q-r';
    protected static ?string $navigationLabel = 'Scan QR';
    protected static ?string $pluralModelLabel = 'Scan QR';
    protected static ?string $navigationGroup = 'Manajemen Transaksi';
    protected static ?int $navigationSort = 1;

    public string $qrContent = '';
    public ?Transaksi $transaksi = null;

    public function scanQR()
    {
        $kode = trim($this->qrContent);

        $transaksi = Transaksi::with(['pengguna', 'produk'])
            ->where('kode_transaksi', $kode)
            ->where('status_transaksi', 'approved')
            ->first();

        if (!$transaksi) {
            Notification::make()
                ->danger()
                ->title('QR Tidak Valid')
                ->body("QR tidak valid atau transaksi belum disetujui.")
                ->send();
            return;
        }

        $now = Carbon::now();
        $mulai = Carbon::parse($transaksi->tanggal_mulai);
        $selesai = Carbon::parse($transaksi->tanggal_selesai);

        if ($now->lt($mulai)) {
            Notification::make()
                ->warning()
                ->title('QR Belum Aktif')
                ->body('QR hanya berlaku mulai tanggal transaksi.')
                ->send();
            return;
        }

        if ($now->gt($selesai)) {
            Notification::make()
                ->warning()
                ->title('QR Kedaluwarsa')
                ->body('QR sudah tidak berlaku.')
                ->send();
            return;
        }

        // Buat kode absensi unik dengan format ABS + tanggal + 3 digit increment
        $prefix = 'ABS' . $now->format('Ymd');

        $lastKode = Absensi::where('kode_absensi', 'like', $prefix . '%')
            ->orderByDesc('kode_absensi')
            ->value('kode_absensi');

        $lastIncrement = $lastKode ? (int) substr($lastKode, -3) : 0;
        $nextIncrement = str_pad($lastIncrement + 1, 3, '0', STR_PAD_LEFT);
        $kodeAbsensi = $prefix . $nextIncrement;

        Absensi::create([
            'id_transaksi' => $transaksi->id_transaksi,
            'id_pengguna' => Auth::id(),
            'kode_absensi' => $kodeAbsensi,
            'waktu_scan' => $now,
        ]);

        $this->transaksi = $transaksi;

        Notification::make()
            ->success()
            ->title('Scan Berhasil')
            ->body("Absensi dicatat dengan kode: {$kodeAbsensi}.")
            ->send();
    }
}
