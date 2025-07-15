<?php

namespace App\Filament\Pages;

use App\Models\Transaksi;
use App\Models\Absensi;
use Carbon\Carbon;
use Filament\Pages\Page;
use Filament\Notifications\Notification;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\On;

class ScanTransactionQR extends Page
{
    public static ?string $navigationIcon = 'heroicon-o-qr-code';
    public static string $view = 'filament.pages.scan-transaction-q-r';
    protected static ?string $navigationLabel = 'Scan QR';
    protected static ?string $pluralModelLabel = 'Scan QR';
    protected static ?string $navigationGroup = 'Manajemen Transaksi';
    protected static ?int $navigationSort = 1;

    public ?Transaksi $transaksi = null;

    #[On('qrScanned')]
    public function handleQrScanned($qrContent = null)
    {
        if (!is_string($qrContent)) {
            \Log::error('QR gagal diparse', ['data' => $qrContent]);

            Notification::make()
                ->danger()
                ->title('QR Error')
                ->body('QR code tidak valid.')
                ->send();
            return;
        }

        $this->scanQR($qrContent);
    }

    public function scanQR(?string $qrContent = null)
    {
        if (!$qrContent) {
            Notification::make()
                ->danger()
                ->title('QR Kosong')
                ->body('QR code tidak berisi data.')
                ->send();
            return;
        }

        preg_match('/\/(\d+)$/', $qrContent, $matches);
        $idTransaksi = $matches[1] ?? null;

        if (!$idTransaksi) {
            Notification::make()
                ->danger()
                ->title('QR Tidak Valid')
                ->body('QR tidak mengandung ID transaksi.')
                ->send();
            return;
        }

        $transaksi = Transaksi::find($idTransaksi);

        if (!$transaksi) {
            Notification::make()
                ->danger()
                ->title('Transaksi Tidak Ditemukan')
                ->body("Transaksi dengan ID $idTransaksi tidak ditemukan.")
                ->send();
            return;
        }

        $now = Carbon::now();
        $start = Carbon::parse($transaksi->tanggal_mulai);
        $end = Carbon::parse($transaksi->tanggal_selesai);

        if ($now->lt($start)) {
            Notification::make()
                ->warning()
                ->title('QR Belum Aktif')
                ->body('QR hanya dapat digunakan mulai ' . $start->format('d M Y') . '.')
                ->send();
            return;
        }

        if ($now->gt($end)) {
            Notification::make()
                ->warning()
                ->title('QR Kadaluwarsa')
                ->body('QR code sudah tidak berlaku.')
                ->send();
            return;
        }

        if (!Auth::check()) {
            Notification::make()
                ->danger()
                ->title('Belum Login')
                ->body('Silakan login terlebih dahulu.')
                ->send();
            return;
        }

        Absensi::create([
            'id_transaksi' => $transaksi->id_transaksi,
            'id_pengguna' => Auth::id(),
            'kode_absensi' => 'ABS' . now()->format('YmdHis'),
            'waktu_scan' => now(),
        ]);

        $this->transaksi = $transaksi;

        Notification::make()
            ->success()
            ->title('Scan Berhasil')
            ->body('Transaksi berhasil diverifikasi dan dicatat.')
            ->send();
    }

    protected function isExpired(Transaksi $transaksi): bool
    {
        return Carbon::now()->gt(Carbon::parse($transaksi->tanggal_selesai));
    }
}
