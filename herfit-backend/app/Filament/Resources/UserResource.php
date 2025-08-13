<?php

namespace App\Filament\Resources;

use App\Models\Pengguna;
use Filament\Forms;
use Filament\Tables;
use Filament\Forms\Form;
use Filament\Tables\Table;
use Filament\Resources\Resource;
use Filament\Support\Enums\FontWeight;
use App\Filament\Resources\UserResource\Pages;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\DeleteBulkAction;
use Filament\Tables\Filters\SelectFilter;
use Filament\Forms\Components\FileUpload;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UserResource extends Resource
{
    protected static ?string $model = Pengguna::class;

    protected static ?string $navigationIcon = 'heroicon-o-user';
    protected static ?string $navigationLabel = 'Kelola Data Pengguna';
    protected static ?string $pluralModelLabel = 'Kelola Data Pengguna';
    protected static ?string $navigationGroup = 'Manajemen Internal';

    public static function form(Form $form): Form
    {
        return $form->schema([
            // ID (read-only saat edit)
            Forms\Components\Placeholder::make('id_info')
                ->label('ID Pengguna')
                ->content(fn(Forms\Get $get) => $get('id_pengguna') ?? '—')
                ->hidden(fn(string $context) => $context === 'create'),

            Forms\Components\TextInput::make('nama_lengkap')
                ->label('Nama Lengkap')
                ->required()
                ->maxLength(50),

            Forms\Components\TextInput::make('email')
                ->label('Email')
                ->email()
                ->required()
                ->maxLength(30),

            Forms\Components\TextInput::make('no_identitas')
                ->label('NIK')
                ->required()
                ->maxLength(16),

            Forms\Components\TextInput::make('no_telp')
                ->label('No. Telepon')
                ->required()
                ->maxLength(15),

            Forms\Components\Select::make('peran_pengguna')
                ->label('Peran')
                ->options([
                    'admin' => 'Admin',
                    'member' => 'Member',
                ])
                ->required(),

            // ===== Foto Profil (pakai multiple + konversi array<->string untuk hindari foreach error) =====
            FileUpload::make('foto_profil')
                ->label('Foto Profil')
                ->image()
                ->disk('public')          // storage/app/public
                ->directory('profil')     // storage/app/public/profil   (sesuai data kamu)
                ->visibility('public')    // URL => /storage/profil/xxx
                ->imagePreviewHeight('160')
                ->openable()
                ->downloadable()
                ->maxSize(4096)
                ->nullable()
                ->multiple()              // <— bikin state selalu array

                // Saat form di-load: string -> array [string]
                ->afterStateHydrated(function (FileUpload $component, $state) {
                    if (is_string($state)) {
                        // normalisasi "storage/profil/xxx" -> "profil/xxx"
                        $state = preg_replace('#^storage/#', '', $state);
                    }
                    if (is_string($state) && $state !== '') {
                        $component->state([$state]);
                    }
                })

                // Saat submit: array -> string (ambil file pertama), atau null jika kosong
                ->dehydrateStateUsing(function ($state) {
                    if (is_array($state)) {
                        $first = $state[0] ?? null;
                        return $first ? preg_replace('#^storage/#', '', (string) $first) : null;
                    }
                    return $state ?: null;
                })
                ->dehydrated(true),

            // ===== Ganti Kata Sandi (hash otomatis) =====
            Forms\Components\TextInput::make('kata_sandi')
                ->label('Kata Sandi')
                ->password()
                ->revealable()
                ->rules(['confirmed']) // butuh field 'kata_sandi_confirmation'
                ->required(fn(string $context) => $context === 'create')
                ->dehydrated(fn($state) => filled($state))
                ->dehydrateStateUsing(fn($state) => filled($state) ? Hash::make($state) : null),

            Forms\Components\TextInput::make('kata_sandi_confirmation')
                ->label('Konfirmasi Kata Sandi')
                ->password()
                ->revealable()
                ->dehydrated(false),
        ])->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id_pengguna')
                    ->label('ID')
                    ->sortable()
                    ->toggleable(),

                // Avatar
                Tables\Columns\ImageColumn::make('foto_profil')
                    ->label('Foto')
                    ->disk('public')
                    ->state(
                        fn($record) => $record->foto_profil
                        ? preg_replace('#^storage/#', '', (string) $record->foto_profil)
                        : null
                    )
                    ->url(function ($record) {
                        $val = (string) ($record->foto_profil ?? '');
                        if ($val === '')
                            return null;
                        if (Str::startsWith($val, ['http://', 'https://']))
                            return $val;
                        $path = preg_replace('#^storage/#', '', $val);
                        return Storage::disk('public')->url($path);
                    })
                    ->openUrlInNewTab()
                    ->circular()
                    ->height(36)
                    ->width(36),

                Tables\Columns\TextColumn::make('nama_lengkap')
                    ->label('Nama')
                    ->sortable()
                    ->searchable()
                    ->weight(FontWeight::Bold),

                Tables\Columns\TextColumn::make('email')
                    ->label('Email')
                    ->sortable()
                    ->searchable(),

                Tables\Columns\TextColumn::make('no_identitas')
                    ->label('NIK')
                    ->searchable(),

                Tables\Columns\TextColumn::make('no_telp')
                    ->label('No. Telepon')
                    ->searchable(),

                Tables\Columns\BadgeColumn::make('peran_pengguna')
                    ->label('Peran')
                    ->colors([
                        'primary' => 'admin',
                        'gray' => 'member',
                    ])
                    ->formatStateUsing(fn($state) => ucfirst($state)),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('peran_pengguna')
                    ->label('Peran')
                    ->options([
                        'admin' => 'Admin',
                        'member' => 'Member',
                    ]),
            ])
            ->actions([
                EditAction::make()
                    ->label('Edit')
                    ->icon('heroicon-o-pencil')
                    ->color('warning'),

                DeleteAction::make()
                    ->label('Hapus')
                    ->icon('heroicon-o-trash')
                    ->color('danger'),
            ])
            ->bulkActions([
                DeleteBulkAction::make()
                    ->label('Hapus Massal'),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}