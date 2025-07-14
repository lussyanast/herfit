<?php

namespace App\Filament\Resources;

use App\Models\Transaksi;
use App\Models\Pengguna;
use App\Models\Produk;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Actions\Action;
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

            Forms\Components\TextInput::make('total_hari')
                ->numeric()
                ->required()
                ->label('Total Hari'),

            Forms\Components\TextInput::make('harga')
                ->numeric()
                ->prefix('Rp')
                ->label('Harga'),

            Forms\Components\Select::make('status')
                ->options([
                    'waiting' => 'Menunggu',
                    'approved' => 'Disetujui',
                    'rejected' => 'Ditolak',
                ])
                ->required()
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            Tables\Columns\TextColumn::make('pengguna.nama_lengkap')
                ->label('Pengguna')
                ->sortable()
                ->weight(FontWeight::Bold),

            Tables\Columns\TextColumn::make('produk.nama_produk')
                ->label('Produk')
                ->searchable()
                ->sortable()
                ->weight(FontWeight::Bold),

            Tables\Columns\TextColumn::make('bukti_bayar')
                ->label('Bukti Bayar')
                ->html()
                ->formatStateUsing(fn($state, $record) => $record->bukti_bayar
                    ? '<span class="text-primary underline hover:text-blue-700 font-medium">👁️ Lihat Bukti</span>'
                    : '<span class="text-gray-400 italic">Tidak ada</span>')
                ->action(
                    Action::make('preview-bukti')
                        ->modalHeading('Bukti Pembayaran')
                        ->modalSubmitAction(false)
                        ->modalCancelActionLabel('Tutup')
                        ->modalContent(fn($record) => view('filament.preview-bukti', [
                            'url' => asset('storage/' . $record->bukti_bayar),
                        ]))
                        ->visible(fn($record) => filled($record->bukti_bayar))
                ),

            Tables\Columns\TextColumn::make('tanggal_mulai')
                ->label('Mulai')
                ->sortable(),

            Tables\Columns\TextColumn::make('tanggal_selesai')
                ->label('Selesai')
                ->sortable(),

            Tables\Columns\TextColumn::make('total_hari')
                ->label('Durasi')
                ->sortable(),

            Tables\Columns\TextColumn::make('harga')
                ->label('Harga')
                ->getStateUsing(fn($record) => 'Rp. ' . number_format($record->harga, 0, ',', '.')),

            Tables\Columns\TextColumn::make('status')
                ->badge()
                ->color(fn(string $state) => match ($state) {
                    'waiting' => 'gray',
                    'approved' => 'success',
                    'rejected' => 'danger',
                    default => 'secondary'
                }),

            Tables\Columns\TextColumn::make('created_at')
                ->label('Dibuat')
                ->dateTime()
                ->sortable(),

            Tables\Columns\TextColumn::make('updated_at')
                ->label('Diperbarui')
                ->dateTime()
                ->sortable()
                ->toggleable(isToggledHiddenByDefault: true),
        ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'waiting' => 'Menunggu',
                        'approved' => 'Disetujui',
                        'rejected' => 'Ditolak',
                    ]),
            ])
            ->actions([
                Action::make('approve')
                    ->label('Setujui')
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(function (Transaksi $transaksi) {
                        $transaksi->update(['status' => 'approved']);
                        Notification::make()
                            ->success()
                            ->title('Transaksi Disetujui')
                            ->body('Transaksi berhasil disetujui.')
                            ->send();
                    })
                    ->visible(fn(Transaksi $transaksi) => $transaksi->status === 'waiting'),

                Action::make('reject')
                    ->label('Tolak')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->action(function (Transaksi $transaksi) {
                        $transaksi->update(['status' => 'rejected']);
                        Notification::make()
                            ->warning()
                            ->title('Transaksi Ditolak')
                            ->body('Transaksi telah ditolak.')
                            ->send();
                    })
                    ->visible(fn(Transaksi $transaksi) => $transaksi->status === 'waiting'),
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
