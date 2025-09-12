<?php

namespace App\Filament\Pages;

use App\Models\Transaksi;
use Filament\Pages\Page;
use Filament\Notifications\Notification;

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
        // Ambil kode transaksi dari URL QR
        $kode = basename(trim($this->qrContent));

        $trx = Transaksi::with(['pengguna', 'produk'])
            ->where('kode_transaksi', $kode)
            ->first();

        if (!$trx) {
            Notification::make()
                ->danger()
                ->title('QR Tidak Valid')
                ->body('Transaksi tidak ditemukan.')
                ->send();
            return;
        }

        $res = app(\App\Services\TransaksiFsm::class)->handle($trx, 'scan');

        match ($res) {
            'not_active' => Notification::make()
                ->warning()
                ->title('QR Belum Aktif')
                ->body('QR hanya berlaku mulai tanggal transaksi.')
                ->send(),
            'expired' => Notification::make()
                ->warning()
                ->title('QR Kedaluwarsa')
                ->body('QR sudah tidak berlaku.')
                ->send(),
            'active' => Notification::make()
                ->success()
                ->title('Scan Berhasil')
                ->body('Absensi tercatat.')
                ->send(),
            default => Notification::make()
                ->danger()
                ->title('QR Tidak Valid')
                ->body('QR tidak valid atau transaksi belum disetujui.')
                ->send(),
        };

        if (in_array($res, ['active', 'not_active', 'expired'])) {
            $this->transaksi = $trx;
        }
    }
}