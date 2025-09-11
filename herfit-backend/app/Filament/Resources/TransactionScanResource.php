<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TransactionScanResource\Pages;
use App\Models\Absensi;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class TransactionScanResource extends Resource
{
    protected static ?string $model = Absensi::class;

    protected static ?string $navigationIcon = 'heroicon-o-qr-code';
    protected static ?string $navigationLabel = 'Riwayat Scan QR';
    protected static ?string $pluralModelLabel = 'Riwayat Scan QR';
    protected static ?string $navigationGroup = 'Manajemen Transaksi';
    protected static ?int $navigationSort = 2;

    public static function getRecordRouteKeyName(): string
    {
        return 'kode_absensi';
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Detail Scan')
                ->schema([
                    // tampilkan kode_absensi (readonly)
                    Forms\Components\TextInput::make('kode_absensi')
                        ->label('Kode Absensi')
                        ->disabled()
                        ->dehydrated(false),

                    Forms\Components\TextInput::make('kode_transaksi')
                        ->label('Kode Transaksi')
                        ->disabled()
                        ->dehydrated(false),

                    Forms\Components\Select::make('id_pengguna')
                        ->label('Discan Oleh')
                        ->relationship('pengguna', 'nama_lengkap')
                        ->searchable()
                        ->preload()
                        ->required(),

                    Forms\Components\DateTimePicker::make('waktu_scan')
                        ->label('Waktu Scan')
                        ->native(false)
                        ->required(),
                ])
                ->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('kode_absensi')
                    ->label('Kode Absensi')
                    ->copyable()
                    ->sortable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('kode_transaksi')
                    ->label('Kode Transaksi')
                    ->searchable()
                    ->copyable()
                    ->sortable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('transaksi.produk.kode_produk')
                    ->label('Kode Produk')
                    ->searchable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('transaksi.produk.nama_produk')
                    ->label('Nama Produk')
                    ->searchable(),

                Tables\Columns\TextColumn::make('transaksi.pengguna.nama_lengkap')
                    ->label('Pemesan')
                    ->searchable(),

                Tables\Columns\TextColumn::make('pengguna.nama_lengkap')
                    ->label('Discan Oleh')
                    ->searchable(),

                Tables\Columns\TextColumn::make('transaksi.tanggal_mulai')
                    ->label('Mulai')
                    ->date('d M Y')
                    ->sortable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('transaksi.tanggal_selesai')
                    ->label('Selesai')
                    ->date('d M Y')
                    ->sortable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('waktu_scan')
                    ->label('Waktu Scan')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('waktu_scan', 'desc')
            ->filters([])
            ->actions([
                Tables\Actions\EditAction::make()
                    ->label('Edit')
                    ->icon('heroicon-m-pencil-square')
                    ->color('warning'),

                Tables\Actions\DeleteAction::make()
                    ->label('Hapus')
                    ->icon('heroicon-m-trash')
                    ->color('danger')
                    ->requiresConfirmation(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make()
                        ->label('Hapus Terpilih')
                        ->color('danger')
                        ->requiresConfirmation(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListTransactionScans::route('/'),
            'edit' => Pages\EditTransactionScan::route('/{record}/edit'),
        ];
    }

    public static function canCreate(): bool
    {
        return false;
    }
}