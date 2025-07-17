<?php

namespace App\Filament\Resources;

use App\Models\Absensi;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;
use App\Filament\Resources\TransactionScanResource\Pages;

class TransactionScanResource extends Resource
{
    protected static ?string $model = Absensi::class;

    protected static ?string $navigationIcon = 'heroicon-o-qr-code';
    protected static ?string $navigationLabel = 'Riwayat Scan QR';
    protected static ?string $pluralModelLabel = 'Riwayat Scan QR';
    protected static ?string $navigationGroup = 'Manajemen Transaksi';
    protected static ?int $navigationSort = 2;

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id_transaksi')
                    ->label('ID Transaksi')
                    ->sortable(),

                Tables\Columns\TextColumn::make('transaksi.produk.nama_produk')
                    ->label('Nama Produk')
                    ->searchable(),

                Tables\Columns\TextColumn::make('transaksi.pengguna.nama_lengkap')
                    ->label('Pemesan')
                    ->searchable(),

                Tables\Columns\TextColumn::make('pengguna.nama_lengkap')
                    ->label('Discan Oleh')
                    ->searchable(),

                Tables\Columns\TextColumn::make('waktu_scan')
                    ->label('Waktu Scan')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('waktu_scan', 'desc')
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
