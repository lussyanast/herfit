<?php

namespace App\Filament\Resources;

use App\Models\Transaksi;
use App\Services\TransaksiFsm;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Actions\Action;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use App\Filament\Resources\TransactionResource\Pages;
use Illuminate\Database\Eloquent\Builder;

class TransactionResource extends Resource
{
    protected static ?string $model = Transaksi::class;

    protected static ?string $navigationIcon = 'heroicon-o-credit-card';
    protected static ?string $navigationLabel = 'Kelola Transaksi';
    protected static ?string $pluralModelLabel = 'Kelola Transaksi';
    protected static ?string $navigationGroup = 'Manajemen Transaksi';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Select::make('id_pengguna')
                ->label('Pengguna')
                ->relationship('pengguna', 'nama_lengkap')
                ->searchable()
                ->required(),

            Forms\Components\Select::make('kode_produk')
                ->label('Produk')
                ->relationship('produk', 'nama_produk')
                ->searchable()
                ->required(),

            Forms\Components\TextInput::make('kode_transaksi')
                ->label('Kode Transaksi')
                ->disabledOn('create')
                ->required(),

            Forms\Components\DatePicker::make('tanggal_mulai')
                ->label('Tanggal Mulai')
                ->required(),

            Forms\Components\DatePicker::make('tanggal_selesai')
                ->label('Tanggal Selesai')
                ->required(),

            Forms\Components\TextInput::make('jumlah_hari')
                ->label('Jumlah Hari')
                ->numeric()
                ->required(),

            Forms\Components\TextInput::make('jumlah_bayar')
                ->label('Jumlah Bayar')
                ->prefix('Rp')
                ->numeric()
                ->required(),

            Forms\Components\FileUpload::make('bukti_pembayaran')
                ->label('Bukti Pembayaran')
                ->disk('public')
                ->directory('bukti')
                ->image()
                ->openable()
                ->downloadable()
                ->nullable(),

            Forms\Components\Select::make('status_transaksi')
                ->label('Status')
                ->options([
                    'waiting' => 'Menunggu',
                    'approved' => 'Disetujui',
                    'rejected' => 'Ditolak',
                ])
                ->required(),
        ])->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(
                fn(Builder $query): Builder =>
                $query->orderByDesc('created_at')->orderByDesc('kode_transaksi')
            )
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('kode_transaksi')
                    ->label('Kode Transaksi')
                    ->searchable()
                    ->copyable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('produk.kode_produk')
                    ->label('Kode Produk')
                    ->searchable(),

                Tables\Columns\TextColumn::make('produk.nama_produk')
                    ->label('Nama Produk')
                    ->sortable()
                    ->searchable()
                    ->weight(FontWeight::Bold),

                Tables\Columns\TextColumn::make('id_pengguna')
                    ->label('ID Pengguna')
                    ->sortable(),

                Tables\Columns\TextColumn::make('pengguna.nama_lengkap')
                    ->label('Nama Pengguna')
                    ->sortable()
                    ->searchable()
                    ->weight(FontWeight::Bold),

                Tables\Columns\TextColumn::make('pengguna.email')
                    ->label('Email Pengguna')
                    ->searchable()
                    ->copyable(),

                Tables\Columns\TextColumn::make('tanggal_mulai')
                    ->label('Mulai')->date('d M Y')->sortable(),

                Tables\Columns\TextColumn::make('tanggal_selesai')
                    ->label('Selesai')->date('d M Y')->sortable(),

                Tables\Columns\TextColumn::make('jumlah_hari')
                    ->label('Durasi (hari)')->sortable(),

                Tables\Columns\TextColumn::make('jumlah_bayar')
                    ->label('Jumlah Bayar')
                    ->getStateUsing(
                        fn($record) =>
                        'Rp ' . number_format((int) $record->jumlah_bayar, 0, ',', '.')
                    ),

                Tables\Columns\BadgeColumn::make('status_transaksi')
                    ->label('Status')
                    ->colors([
                        'gray' => 'waiting',
                        'success' => 'approved',
                        'danger' => 'rejected',
                    ])
                    ->formatStateUsing(fn(string $state) => match ($state) {
                        'waiting' => 'Menunggu',
                        'approved' => 'Disetujui',
                        'rejected' => 'Ditolak',
                        default => ucfirst($state),
                    })
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Dibuat')->dateTime('d M Y H:i')->sortable(),
            ])
            ->filters([
                SelectFilter::make('status_transaksi')
                    ->label('Status')
                    ->options([
                        'waiting' => 'Menunggu',
                        'approved' => 'Disetujui',
                        'rejected' => 'Ditolak',
                    ]),
            ])
            ->actions([
                Action::make('approve')
                    ->label('Setujui')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->visible(fn(Transaksi $record) => $record->status_transaksi === 'waiting')
                    ->action(
                        fn(Transaksi $record) =>
                        app(TransaksiFsm::class)->handle($record, 'approve')
                    )
                    ->after(fn() => Notification::make()
                        ->title('Transaksi Disetujui')
                        ->success()->send()),

                Action::make('reject')
                    ->label('Tolak')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->visible(fn(Transaksi $record) => $record->status_transaksi === 'waiting')
                    ->action(
                        fn(Transaksi $record) =>
                        app(TransaksiFsm::class)->handle($record, 'reject')
                    )
                    ->after(fn() => Notification::make()
                        ->title('Transaksi Ditolak')
                        ->warning()->send()),

                EditAction::make()
                    ->label('Edit')
                    ->icon('heroicon-o-pencil')
                    ->color('warning'),

                DeleteAction::make()
                    ->label('Hapus')
                    ->icon('heroicon-o-trash')
                    ->color('danger'),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
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
