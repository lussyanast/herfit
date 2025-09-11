<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PostinganResource\Pages;
use App\Models\Postingan;
use App\Models\Pengguna;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Components\FileUpload;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
            // ID otomatis digenerate → tampil read-only
            Forms\Components\TextInput::make('id_postingan')
                ->label('ID Postingan')
                ->disabled()
                ->dehydrated(false)
                ->default(null),

            Forms\Components\Textarea::make('caption')
                ->label('Caption')
                ->rows(4)
                ->maxLength(500),

            // ===== File gambar =====
            FileUpload::make('foto_postingan')
                ->label('Gambar')
                ->image()
                ->disk('public')           // storage/app/public
                ->directory('feeds')       // storage/app/public/feeds
                ->visibility('public')     // bisa diakses via /storage/feeds/...
                ->imagePreviewHeight('200')
                ->openable()
                ->downloadable()
                ->maxSize(4096)
                ->nullable()
                ->multiple()
                ->afterStateHydrated(function (FileUpload $component, $state) {
                    if (is_string($state)) {
                        $state = preg_replace('#^storage/#', '', $state);
                    }
                    if (is_string($state) && $state !== '') {
                        $component->state([$state]);
                    }
                })
                ->dehydrateStateUsing(function ($state) {
                    if (is_array($state)) {
                        $first = $state[0] ?? null;
                        return $first ? preg_replace('#^storage/#', '', (string) $first) : null;
                    }
                    return $state ?: null;
                })
                ->dehydrated(true),
        ])->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id_postingan')
                    ->label('ID Postingan')
                    ->sortable()
                    ->searchable(),

                // ====== Info Pengguna ======
                Tables\Columns\TextColumn::make('pengguna.id_pengguna')
                    ->label('ID Pengguna')
                    ->sortable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('pengguna.nama_lengkap')
                    ->label('Nama Pengguna')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('pengguna.email')
                    ->label('Email')
                    ->searchable()
                    ->toggleable(),

                // ====== Konten ======
                Tables\Columns\TextColumn::make('caption')
                    ->label('Caption')
                    ->limit(60)
                    ->wrap()
                    ->tooltip(fn($record) => $record->caption)
                    ->searchable(),

                Tables\Columns\ImageColumn::make('foto_postingan')
                    ->label('Gambar')
                    ->disk('public')
                    ->state(
                        fn($record) => $record->foto_postingan
                        ? preg_replace('#^storage/#', '', (string) $record->foto_postingan)
                        : null
                    )
                    ->url(function ($record) {
                        $val = (string) ($record->foto_postingan ?? '');
                        if ($val === '')
                            return null;

                        if (Str::startsWith($val, ['http://', 'https://'])) {
                            return $val;
                        }
                        $path = preg_replace('#^storage/#', '', $val);
                        return Storage::disk('public')->url($path);
                    })
                    ->openUrlInNewTab()
                    ->square(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('id_pengguna')
                    ->label('Pengguna')
                    ->relationship('pengguna', 'nama_lengkap')
                    ->searchable(),

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
