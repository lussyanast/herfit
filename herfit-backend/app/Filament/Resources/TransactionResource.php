<?php

namespace App\Filament\Resources;

use App\Models\Transaction;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Actions\Action;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use App\Filament\Resources\TransactionResource\Pages;

class TransactionResource extends Resource
{
    protected static ?string $model = Transaction::class;
    protected static ?string $navigationIcon = 'heroicon-o-credit-card';
    protected static ?string $navigationLabel = 'Kelola Transaksi';
    protected static ?string $pluralModelLabel = 'Kelola Transaksi';
    protected static ?string $navigationGroup = 'Manajemen Transaksi';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Select::make('user_id')
                ->relationship('user', 'name')
                ->required(),
            Forms\Components\TextInput::make('listing_id')
                ->required()
                ->numeric(),
            Forms\Components\TextInput::make('start_date')
                ->numeric(),
            Forms\Components\TextInput::make('end_date')
                ->numeric(),
            Forms\Components\TextInput::make('total_days')
                ->numeric(),
            Forms\Components\TextInput::make('price')
                ->required()
                ->numeric()
                ->default(0)
                ->prefix('$'),
            Forms\Components\TextInput::make('status')
                ->required(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            Tables\Columns\TextColumn::make('user.name')
                ->sortable()
                ->weight(FontWeight::Bold),
            Tables\Columns\TextColumn::make('listing_id')
                ->sortable()
                ->hidden(),
            Tables\Columns\TextColumn::make('listing.listing_name')
                ->label('Listing Name')
                ->searchable()
                ->sortable()
                ->weight(FontWeight::Bold),
            Tables\Columns\TextColumn::make('start_date')
                ->weight(FontWeight::Bold),
            Tables\Columns\TextColumn::make('end_date')
                ->weight(FontWeight::Bold),
            Tables\Columns\TextColumn::make('total_days')
                ->weight(FontWeight::Bold),
            Tables\Columns\TextColumn::make('price')
                ->getStateUsing(fn($record) => 'Rp. ' . number_format($record->price, 0, ',', '.'))
                ->weight(FontWeight::Bold),
            Tables\Columns\TextColumn::make('status')
                ->badge()
                ->color(fn(string $state) => match ($state) {
                    'waiting' => 'gray',
                    'approved' => 'info',
                    'rejected' => 'danger',
                }),
            Tables\Columns\TextColumn::make('created_at')
                ->dateTime()
                ->sortable(),
            Tables\Columns\TextColumn::make('updated_at')
                ->dateTime()
                ->sortable()
                ->toggleable(isToggledHiddenByDefault: true),
        ])
            ->filters([
                SelectFilter::make('status')->options([
                    'waiting' => 'Menunggu',
                    'approved' => 'Disetujui',
                    'rejected' => 'Ditolak',
                ]),
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
                    ->hidden(fn(Transaction $transaction) => $transaction->status !== 'waiting'),

                Action::make('reject')
                    ->button()
                    ->color('danger')
                    ->requiresConfirmation()
                    ->action(function (Transaction $transaction) {
                        $transaction->update(['status' => 'rejected']);
                        Notification::make()
                            ->warning()
                            ->title('Transaksi Dibatalkan')
                            ->body('Transaksi telah dibatalkan.')
                            ->icon('heroicon-o-x-circle')
                            ->send();
                    })
                    ->hidden(fn(Transaction $transaction) => $transaction->status !== 'waiting'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            // Tentukan relasi di sini jika diperlukan
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListTransactions::route('/'),
            'create' => Pages\CreateTransaction::route('/create'),
            'edit' => Pages\EditTransaction::route('/{record}/edit'),
        ];
    }

    public static function canCreate(): bool
    {
        return false;
    }
}
