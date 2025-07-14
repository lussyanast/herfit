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
            Forms\Components\TextInput::make('nama_produk')
                ->label('Nama Produk')
                ->required()
                ->afterStateUpdated(fn($state, callable $set) => $set('slug', Str::slug($state)))
                ->live(debounce: 250)
                ->maxLength(255),

            Forms\Components\TextInput::make('slug')
                ->disabled()
                ->maxLength(255),

            Forms\Components\Select::make('kategori_produk')
                ->label('Kategori')
                ->required()
                ->options([
                    'latihan' => 'Latihan',
                    'makanan' => 'Makanan',
                ])
                ->columnSpanFull(),

            Forms\Components\Textarea::make('deskripsi_produk')
                ->label('Deskripsi')
                ->required()
                ->columnSpanFull(),

            Forms\Components\TextInput::make('maksimum_peserta')
                ->numeric()
                ->required()
                ->label('Maksimum Peserta'),

            Forms\Components\TextInput::make('harga_produk')
                ->numeric()
                ->required()
                ->label('Harga'),

            FileUpload::make('foto_produk')
                ->label('Foto Produk')
                ->image()
                ->directory('produk')
                ->openable()
                ->columnSpanFull()
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            Tables\Columns\TextColumn::make('nama_produk')
                ->label('Nama')
                ->weight(FontWeight::Bold),

            Tables\Columns\TextColumn::make('kategori_produk')
                ->label('Kategori')
                ->searchable(),

            Tables\Columns\TextColumn::make('maksimum_peserta')
                ->label('Max')
                ->weight(FontWeight::Bold),

            Tables\Columns\TextColumn::make('harga_produk')
                ->label('Harga')
                ->getStateUsing(fn($record) => 'Rp. ' . number_format($record->harga_produk, 0, ',', '.'))
                ->weight(FontWeight::Bold),

            Tables\Columns\TextColumn::make('created_at')
                ->dateTime()
                ->label('Dibuat')
                ->sortable()
                ->toggleable(isToggledHiddenByDefault: true),

            Tables\Columns\TextColumn::make('updated_at')
                ->dateTime()
                ->label('Diperbarui')
                ->sortable()
                ->toggleable(isToggledHiddenByDefault: true),
        ])
            ->filters([
                Tables\Filters\TrashedFilter::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
                Tables\Actions\ForceDeleteAction::make(),
                Tables\Actions\RestoreAction::make(),
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
