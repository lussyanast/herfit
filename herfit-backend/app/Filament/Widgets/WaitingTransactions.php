<?php

namespace App\Filament\Widgets;

use App\Models\Transaction;
use Filament\Tables;
use Filament\Tables\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Widgets\TableWidget as BaseWidget;

class WaitingTransactions extends BaseWidget
{
    protected static ?int $sort = 3;

    public function table(Tables\Table $table): Tables\Table
    {
        return $table
            ->query(
                Transaction::query()->whereStatus('waiting')
            )
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->sortable()
                    ->extraAttributes(['style' => 'font-weight: bold;']),

                Tables\Columns\TextColumn::make('listing_id')
                    ->sortable()
                    ->hidden(),

                Tables\Columns\TextColumn::make('listing.listing_name')
                    ->label('Listing Name')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('price')
                    ->getStateUsing(function ($record) {
                        return 'Rp. ' . number_format($record->price, 0, ',', '.');
                    })
                    ->extraAttributes(['style' => 'font-weight: bold;']),

                Tables\Columns\TextColumn::make('status')->badge()->color(fn(string $state): string => match ($state) {
                    'waiting' => 'gray',
                    'approved' => 'info',
                    'canceled' => 'danger',
                }),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),

                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->actions([
                Action::make('approve')
                    ->button()
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(function (Transaction $transaction) {
                        $transaction->update(['status' => 'approved']);
                        Notification::make()
                            ->success()
                            ->title('Transaksi Disetujui!')
                            ->body('Transaksi berhasil disetujui.')
                            ->icon('heroicon-o-check')
                            ->send();
                    })
                    ->hidden(fn(Transaction $transaction) => $transaction->status !== 'waiting')
            ])
        ;
    }
}
