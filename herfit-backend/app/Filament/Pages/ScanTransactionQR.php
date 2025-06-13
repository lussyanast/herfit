<?php

namespace App\Filament\Pages;

use App\Models\Transaction;
use App\Models\TransactionScan;
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
    protected static ?int $navigationSort = 2;

    public ?Transaction $transaction = null;

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

        // Ambil ID transaksi dari URL QR (misal /transaksi/123)
        preg_match('/\/(\d+)$/', $qrContent, $matches);
        $transactionId = $matches[1] ?? null;

        if (!$transactionId) {
            Notification::make()
                ->danger()
                ->title('QR Tidak Valid')
                ->body('QR tidak mengandung ID transaksi.')
                ->send();
            return;
        }

        $transaction = Transaction::find($transactionId);

        if (!$transaction) {
            Notification::make()
                ->danger()
                ->title('Transaksi Tidak Ditemukan')
                ->body("Transaksi dengan ID $transactionId tidak ditemukan.")
                ->send();
            return;
        }

        // Log untuk debugging
        \Log::info('Waktu sekarang:', [Carbon::now()]);
        \Log::info('End date transaksi:', [$transaction->end_date]);

        // Cek apakah transaksi sudah kadaluarsa
        if ($this->isExpired($transaction)) {
            Notification::make()
                ->warning()
                ->title('QR Kadaluwarsa')
                ->body('QR code sudah tidak berlaku karena melebihi tanggal selesai transaksi.')
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

        // Simpan hasil scan ke tabel
        TransactionScan::create([
            'transaction_id' => $transaction->id,
            'scanned_by' => Auth::id(),
            'scanned_at' => now()
        ]);

        $this->transaction = $transaction;

        Notification::make()
            ->success()
            ->title('Scan Berhasil')
            ->body('Data transaksi berhasil dicatat.')
            ->send();
    }

    protected function isExpired(Transaction $transaction): bool
    {
        return Carbon::now()->gt(Carbon::parse($transaction->end_date));
    }
}