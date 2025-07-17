<?php

namespace App\Filament\Resources;

use App\Models\Transaksi;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Actions\Action;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use App\Filament\Resources\TransactionResource\Pages;
use Filament\Notifications\Notification;

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

            Forms\Components\Select::make('id_produk')
                ->label('Produk')
                ->relationship('produk', 'nama_produk')
                ->searchable()
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

            Forms\Components\Select::make('status_transaksi')
                ->label('Status')
                ->options([
                    'waiting' => 'Menunggu',
                    'approved' => 'Disetujui',
                    'rejected' => 'Ditolak',
                ])
                ->required(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('pengguna.nama_lengkap')
                    ->label('Pengguna')
                    ->sortable()
                    ->searchable()
                    ->weight(FontWeight::Bold),

                Tables\Columns\TextColumn::make('produk.nama_produk')
                    ->label('Produk')
                    ->sortable()
                    ->searchable()
                    ->weight(FontWeight::Bold),

                Tables\Columns\TextColumn::make('bukti_pembayaran')
                    ->label('Bukti Bayar')
                    ->html()
                    ->formatStateUsing(fn($state, $record) => $record->bukti_pembayaran
                        ? '<span class="text-primary underline hover:text-blue-700 font-medium">👁️ Lihat Bukti</span>'
                        : '<span class="text-gray-400 italic">Tidak ada</span>')
                    ->action(
                        Action::make('lihat_bukti')
                            ->icon('heroicon-o-eye')
                            ->modalHeading('Bukti Pembayaran')
                            ->modalSubmitAction(false)
                            ->modalCancelActionLabel('Tutup')
                            ->modalContent(fn($record) => view('filament.preview-bukti', [
                                'url' => asset('storage/' . $record->bukti_pembayaran),
                            ]))
                            ->visible(fn($record) => filled($record->bukti_pembayaran))
                    ),

                Tables\Columns\TextColumn::make('tanggal_mulai')->label('Mulai')->sortable(),
                Tables\Columns\TextColumn::make('tanggal_selesai')->label('Selesai')->sortable(),
                Tables\Columns\TextColumn::make('jumlah_hari')->label('Durasi')->sortable(),

                Tables\Columns\TextColumn::make('jumlah_bayar')
                    ->label('Jumlah Bayar')
                    ->getStateUsing(fn($record) => 'Rp. ' . number_format($record->jumlah_bayar, 0, ',', '.')),

                Tables\Columns\BadgeColumn::make('status_transaksi')
                    ->label('Status')
                    ->colors([
                        'gray' => 'waiting',
                        'success' => 'approved',
                        'danger' => 'rejected',
                    ])
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')->label('Dibuat')->dateTime()->sortable(),

                Tables\Columns\TextColumn::make('updated_at')->label('Diperbarui')->dateTime()->sortable(),
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
                    ->label('Approved')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(fn(Transaksi $record) => $record->update(['status_transaksi' => 'approved']))
                    ->after(fn() => Notification::make()
                        ->title('Transaksi Disetujui')
                        ->body('Status transaksi berhasil diubah menjadi Approved.')
                        ->success()
                        ->send())
                    ->visible(fn(Transaksi $record) => $record->status_transaksi === 'waiting'),

                Action::make('reject')
                    ->label('Rejected')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->action(fn(Transaksi $record) => $record->update(['status_transaksi' => 'rejected']))
                    ->after(fn() => Notification::make()
                        ->title('Transaksi Ditolak')
                        ->body('Status transaksi berhasil diubah menjadi Rejected.')
                        ->warning()
                        ->send())
                    ->visible(fn(Transaksi $record) => $record->status_transaksi === 'waiting'),

                EditAction::make()
                    ->label('Edit')
                    ->icon('heroicon-o-pencil')
                    ->color('warning'),

                DeleteAction::make()
                    ->label('Hapus')
                    ->icon('heroicon-o-trash')
                    ->color('danger')
                    ->requiresConfirmation(),
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