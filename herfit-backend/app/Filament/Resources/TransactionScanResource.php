<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TransactionScanResource\Pages;
use App\Models\TransactionScan;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;

class TransactionScanResource extends Resource
{
    protected static ?string $model = TransactionScan::class;

    protected static ?string $navigationIcon = 'heroicon-o-qr-code';
    protected static ?string $navigationLabel = 'Riwayat Scan QR';
    protected static ?string $pluralModelLabel = 'Riwayat Scan QR';
    protected static ?string $navigationGroup = 'Transaksi';

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('transaction.id')
                    ->label('ID Transaksi')
                    ->sortable(),

                Tables\Columns\TextColumn::make('transaction.user.name')
                    ->label('Nama User')
                    ->searchable(),

                Tables\Columns\TextColumn::make('scannedBy.name')
                    ->label('Discan Oleh')
                    ->searchable(),

                Tables\Columns\TextColumn::make('scanned_at')
                    ->label('Waktu Scan')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('scanned_at', 'desc')
            ->filters([])
            ->actions([])
            ->bulkActions([]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListTransactionScans::route('/'),
        ];
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function canEdit(Model $record): bool
    {
        return false;
    }

    public static function canDelete(Model $record): bool
    {
        return false;
    }
}