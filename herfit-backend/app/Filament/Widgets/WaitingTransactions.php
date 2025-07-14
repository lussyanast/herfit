<?php

namespace App\Filament\Widgets;

use App\Models\Transaksi;
use Filament\Tables;
use Filament\Tables\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Widgets\TableWidget as BaseWidget;

class WaitingTransactions extends BaseWidget
{
    protected static ?int $sort = 3;
    protected int|string|array $columnSpan = 'full';

    public function table(Tables\Table $table): Tables\Table
    {
        return $table
            ->query(
                Transaksi::query()->where('status_transaksi', 'waiting')->latest()
            )
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Nama Pengguna')
                    ->sortable()
                    ->searchable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('listing.listing_name')
                    ->label('Nama Produk')
                    ->sortable()
                    ->searchable(),

                Tables\Columns\TextColumn::make('price')
                    ->label('Harga')
                    ->getStateUsing(fn($record) => 'Rp. ' . number_format($record->price, 0, ',', '.'))
                    ->weight('bold'),

                Tables\Columns\BadgeColumn::make('status_transaksi')
                    ->label('Status')
                    ->colors([
                        'gray' => 'waiting',
                        'info' => 'approved',
                        'danger' => 'rejected',
                    ])
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime('d M Y H:i')
                    ->sortable(),

                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Diperbarui')
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
                    ->action(fn(Transaksi $record) => $record->update(['status_transaksi' => 'approved']))
                    ->after(function () {
                        Notification::make()
                            ->title('Transaksi Disetujui')
                            ->body('Status transaksi berhasil diubah menjadi "approved".')
                            ->success()
                            ->send();
                    })
                    ->visible(fn(Transaksi $record) => $record->status_transaksi === 'waiting'),

                Action::make('reject')
                    ->label('Tolak')
                    ->color('danger')
                    ->icon('heroicon-o-x-circle')
                    ->requiresConfirmation()
                    ->action(fn(Transaksi $record) => $record->update(['status_transaksi' => 'rejected']))
                    ->after(function () {
                        Notification::make()
                            ->title('Transaksi Ditolak')
                            ->body('Status transaksi berhasil diubah menjadi "rejected".')
                            ->warning()
                            ->send();
                    })
                    ->visible(fn(Transaksi $record) => $record->status_transaksi === 'waiting'),
            ]);
    }
}
