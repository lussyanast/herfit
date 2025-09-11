<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProdukResource\Pages;
use App\Models\Produk;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Forms\Components\FileUpload;
use Illuminate\Support\Str;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\ForceDeleteAction;
use Filament\Tables\Actions\RestoreAction;
use Filament\Tables\Filters\TrashedFilter;

class ProdukResource extends Resource
{
    protected static ?string $model = Produk::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $navigationLabel = 'Kelola Produk';
    protected static ?string $pluralModelLabel = 'Kelola Produk';
    protected static ?string $navigationGroup = 'Manajemen Internal';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('kode_produk')
                ->label('Kode Produk')
                ->disabled()
                ->dehydrated(false)
                ->visibleOn('edit')
                ->required(false),

            Forms\Components\TextInput::make('nama_produk')
                ->label('Nama Produk')
                ->required()
                ->maxLength(50),

            Forms\Components\Select::make('kategori_produk')
                ->label('Kategori')
                ->required()
                ->options([
                    'Membership' => 'Membership',
                    'Lainnya' => 'Lainnya',
                ]),

            Forms\Components\Textarea::make('deskripsi_produk')
                ->label('Deskripsi')
                ->required()
                ->columnSpanFull(),

            Forms\Components\TextInput::make('maksimum_peserta')
                ->label('Maksimum Peserta')
                ->numeric()
                ->required(),

            Forms\Components\TextInput::make('harga_produk')
                ->label('Harga')
                ->prefix('Rp')
                ->numeric()
                ->required(),

            FileUpload::make('foto_produk')
                ->label('Foto Produk')
                ->image()
                ->disk('public')
                ->directory('produk')
                ->preserveFilenames()
                ->getUploadedFileNameForStorageUsing(function ($file) {
                    return time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                })
                ->openable()
                ->downloadable()
                ->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('kode_produk')
                    ->label('Kode Produk')
                    ->searchable()
                    ->sortable()
                    ->weight(FontWeight::Bold),

                Tables\Columns\TextColumn::make('nama_produk')
                    ->label('Nama')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('kategori_produk')
                    ->label('Kategori')
                    ->sortable(),

                Tables\Columns\TextColumn::make('maksimum_peserta')
                    ->label('Max Peserta'),

                Tables\Columns\TextColumn::make('harga_produk')
                    ->label('Harga')
                    ->sortable()
                    ->getStateUsing(fn($record) => 'Rp ' . number_format($record->harga_produk, 0, ',', '.')),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime('d M Y H:i')
                    ->sortable(),

                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Diperbarui')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
            ])
            ->filters([
                TrashedFilter::make(),
            ])
            ->actions([
                EditAction::make()->label('Edit')->icon('heroicon-o-pencil')->color('warning'),
                DeleteAction::make()->label('Hapus')->icon('heroicon-o-trash')->color('danger'),
                ForceDeleteAction::make()->label('Hapus Permanen'),
                RestoreAction::make()->label('Pulihkan'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\ForceDeleteBulkAction::make(),
                    Tables\Actions\RestoreBulkAction::make(),
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
            'index' => Pages\ListProduk::route('/'),
            'create' => Pages\CreateProduk::route('/create'),
            'edit' => Pages\EditProduk::route('/{record}/edit'),
        ];
    }

    public static function getSlug(): string
    {
        return 'produk';
    }
}