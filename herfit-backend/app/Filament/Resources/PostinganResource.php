<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PostinganResource\Pages;
use App\Models\Postingan;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class PostinganResource extends Resource
{
    protected static ?string $model = Postingan::class;
    protected static ?string $slug = 'postingan';
    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $navigationLabel = 'Kelola Postingan';
    protected static ?string $navigationGroup = 'Manajemen Konten Member';

    public static function getPluralModelLabel(): string
    {
        return 'Kelola Postingan';
    }

    public static function getModelLabel(): string
    {
        return 'Postingan';
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('id_postingan')
                ->label('ID Postingan')
                ->disabledOn('edit')
                ->required()
                ->maxLength(50),

            Forms\Components\Textarea::make('caption')
                ->label('Caption')
                ->rows(4)
                ->maxLength(500),

            Forms\Components\FileUpload::make('gambar')
                ->label('Gambar')
                ->image()
                ->directory('postingan-images')
                ->maxSize(2048)
                ->nullable(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id_postingan')
                    ->label('ID Postingan')
                    ->sortable()
                    ->searchable(),

                Tables\Columns\TextColumn::make('caption')
                    ->label('Caption')
                    ->limit(60)
                    ->wrap()
                    ->tooltip(fn($record) => $record->caption)
                    ->searchable(),

                Tables\Columns\ImageColumn::make('gambar')
                    ->label('Gambar')
                    ->square(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\Filter::make('rentang_waktu')
                    ->form([
                        Forms\Components\DatePicker::make('from')->label('Dari'),
                        Forms\Components\DatePicker::make('until')->label('Sampai'),
                    ])
                    ->query(function (Builder $query, $data) {
                        if ($data['from'] ?? null)
                            $query->whereDate('created_at', '>=', $data['from']);
                        if ($data['until'] ?? null)
                            $query->whereDate('created_at', '<=', $data['until']);
                        return $query;
                    }),
            ])
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
            'index' => Pages\ListPostingans::route('/'),
            'create' => Pages\CreatePostingan::route('/create'),
            'edit' => Pages\EditPostingan::route('/{record}/edit'),
        ];
    }
}
