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
    protected static ?int $navigationSort = 1;

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

        $now = Carbon::now();
        $startDate = Carbon::parse($transaction->start_date);
        $endDate = Carbon::parse($transaction->end_date);

        if ($now->lt($startDate)) {
            Notification::make()
                ->warning()
                ->title('QR Belum Aktif')
                ->body('QR code hanya bisa digunakan mulai ' . $startDate->format('d M Y') . '.')
                ->send();
            return;
        }

        if ($now->gt($endDate)) {
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

        // Simpan hasil scan HANYA jika valid
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