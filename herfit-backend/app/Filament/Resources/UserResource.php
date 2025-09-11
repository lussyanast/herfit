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
            Forms\Components\Placeholder::make('id_pengguna')
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
                ->maxLength(255),

            Forms\Components\TextInput::make('no_identitas')
                ->label('NIK')
                ->maxLength(16),

            Forms\Components\TextInput::make('no_telp')
                ->label('No. Telepon')
                ->maxLength(15),

            Forms\Components\Select::make('peran_pengguna')
                ->label('Peran')
                ->options([
                    'admin' => 'Admin',
                    'member' => 'Member',
                ])
                ->required(),

            FileUpload::make('foto_profil')
                ->label('Foto Profil')
                ->image()
                ->disk('public')
                ->directory('profil')
                ->visibility('public')
                ->imagePreviewHeight('160')
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

            Forms\Components\TextInput::make('kata_sandi')
                ->label('Kata Sandi')
                ->password()
                ->revealable()
                ->rules(['confirmed'])
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

                Tables\Columns\ImageColumn::make('foto_profil')
                    ->label('Foto')
                    ->disk('public')
                    ->state(fn($record) => $record->foto_profil
                        ? preg_replace('#^storage/#', '', (string) $record->foto_profil)
                        : null)
                    ->url(fn($record) => $record->foto_profil
                        ? Storage::disk('public')->url(preg_replace('#^storage/#', '', $record->foto_profil))
                        : null)
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
                EditAction::make()->label('Edit')->icon('heroicon-o-pencil')->color('warning'),
                DeleteAction::make()->label('Hapus')->icon('heroicon-o-trash')->color('danger'),
            ])
            ->bulkActions([
                DeleteBulkAction::make()->label('Hapus Massal'),
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