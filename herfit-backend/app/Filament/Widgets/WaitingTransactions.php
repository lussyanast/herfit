<?php

namespace App\Filament\Widgets;

use App\Models\Transaksi;
use Filament\Tables;
use Filament\Tables\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Widgets\TableWidget as BaseWidget;
use App\Services\TransaksiFsm;

class WaitingTransactions extends BaseWidget
{
    protected static ?int $sort = 3;
    protected int|string|array $columnSpan = 'full';
    protected static ?string $heading = 'Transaksi yang Menunggu';

    public function table(Tables\Table $table): Tables\Table
    {
        return $table
            ->query(
                Transaksi::query()
                    ->where('status_transaksi', 'waiting')
                    ->latest()
            )
            ->columns([
                // Identitas transaksi & produk
                Tables\Columns\TextColumn::make('kode_transaksi')
                    ->label('Kode Transaksi')
                    ->searchable()
                    ->sortable()
                    ->copyable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('produk.kode_produk')
                    ->label('Kode Produk')
                    ->searchable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('produk.nama_produk')
                    ->label('Nama Produk')
                    ->searchable(),

                // Pengguna / pemesan
                Tables\Columns\TextColumn::make('id_pengguna')
                    ->label('ID Pengguna')
                    ->sortable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('pengguna.nama_lengkap')
                    ->label('Nama Pengguna')
                    ->sortable()
                    ->searchable(),

                Tables\Columns\TextColumn::make('pengguna.email')
                    ->label('Email Pengguna')
                    ->searchable()
                    ->copyable()
                    ->toggleable(),

                // Bukti pembayaran (modal preview)
                Tables\Columns\TextColumn::make('bukti_pembayaran')
                    ->label('Bukti Bayar')
                    ->html()
                    ->formatStateUsing(fn($state, $record) => $record->bukti_pembayaran
                        ? '<span class="text-primary underline hover:text-blue-700 font-medium">👁️ Lihat Bukti</span>'
                        : '<span class="text-gray-400 italic">Tidak ada</span>')
                    ->action(
                        Action::make('lihat_bukti')
                            ->label('Lihat Bukti')
                            ->icon('heroicon-o-eye')
                            ->modalHeading('Bukti Pembayaran')
                            ->modalSubmitAction(false)
                            ->modalCancelActionLabel('Tutup')
                            ->modalContent(fn($record) => view('filament.preview-bukti', [
                                'url' => $record->bukti_pembayaran
                                    ? asset('storage/' . $record->bukti_pembayaran)
                                    : null,
                            ]))
                            ->visible(fn($record) => filled($record->bukti_pembayaran))
                    ),

                // Harga & status
                Tables\Columns\TextColumn::make('jumlah_bayar')
                    ->label('Jumlah Bayar')
                    ->getStateUsing(fn($record) => 'Rp ' . number_format((int) $record->jumlah_bayar, 0, ',', '.'))
                    ->sortable(),

                Tables\Columns\BadgeColumn::make('status_transaksi')
                    ->label('Status')
                    ->colors([
                        'gray' => 'waiting',
                        'success' => 'approved',
                        'danger' => 'rejected',
                    ])
                    ->sortable(),

                // Periode
                Tables\Columns\TextColumn::make('tanggal_mulai')
                    ->label('Mulai')
                    ->date('d M Y')
                    ->sortable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('tanggal_selesai')
                    ->label('Selesai')
                    ->date('d M Y')
                    ->sortable()
                    ->toggleable(),

                // Waktu dibuat
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime('d M Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->actions([
                Action::make('approve')
                    ->label('Setujui')
                    ->color('success')
                    ->icon('heroicon-o-check')
                    ->requiresConfirmation()
                    ->visible(fn(Transaksi $record) => $record->status_transaksi === 'waiting')
                    ->action(function (Transaksi $record) {
                        app(TransaksiFsm::class)->handle($record, 'approve');

                        Notification::make()
                            ->title('Transaksi Disetujui')
                            ->body('Status transaksi berhasil diubah menjadi approved.')
                            ->success()
                            ->send();
                    }),

                Action::make('reject')
                    ->label('Tolak')
                    ->color('danger')
                    ->icon('heroicon-o-x-circle')
                    ->requiresConfirmation()
                    ->visible(fn(Transaksi $record) => $record->status_transaksi === 'waiting')
                    ->action(function (Transaksi $record) {
                        app(TransaksiFsm::class)->handle($record, 'reject');

                        Notification::make()
                            ->title('Transaksi Ditolak')
                            ->body('Status transaksi berhasil diubah menjadi rejected.')
                            ->warning()
                            ->send();
                    }),
            ])
            ->emptyStateHeading('Tidak ada transaksi menunggu')
            ->emptyStateDescription('Transaksi dengan status waiting akan muncul di sini.');
    }
}