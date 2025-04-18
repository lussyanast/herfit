<?php

namespace App\Filament\Pages;

use App\Models\Transaction;
use Carbon\Carbon;
use Filament\Forms;
use Filament\Pages\Page;
use Filament\Notifications\Notification;
use Livewire\Attributes\Reactive;
use App\Models\TransactionScan;
use Illuminate\Support\Facades\Auth;

class ScanTransactionQR extends Page
{
    public static ?string $navigationIcon = 'heroicon-o-qr-code';
    public static string $view = 'filament.pages.scan-transaction-q-r';

    #[Reactive]
    public ?string $qrContent = null;

    public ?Transaction $transaction = null;

    public function scanQR()
    {
        if (!$this->qrContent) {
            Notification::make()
                ->danger()
                ->title('QR Kosong')
                ->body('Silakan scan QR code terlebih dahulu.')
                ->send();
            return;
        }

        $transaction = Transaction::find($this->qrContent);

        if (!$transaction) {
            Notification::make()
                ->danger()
                ->title('QR Tidak Ditemukan')
                ->body('Transaksi dengan QR tersebut tidak ditemukan.')
                ->send();
            return;
        }

        if (Carbon::now()->gt(Carbon::parse($transaction->end_date))) {
            Notification::make()
                ->warning()
                ->title('QR Kadaluwarsa')
                ->body('QR Code sudah melewati tanggal berlakunya.')
                ->send();
            return;
        }

        // ✅ Set transaksi yang ditemukan
        $this->transaction = $transaction;

        // ✅ Simpan log ke database
        TransactionScan::create([
            'transaction_id' => $transaction->id,
            'scanned_by' => Auth::id(),
            'scanned_at' => now()
        ]);

        Notification::make()
            ->success()
            ->title('QR Valid')
            ->body('Transaksi ditemukan dan dicatat.')
            ->send();
    }
}
