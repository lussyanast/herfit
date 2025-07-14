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

class UserResource extends Resource
{
    protected static ?string $model = Pengguna::class;

    protected static ?string $navigationIcon = 'heroicon-o-user';
    protected static ?string $navigationLabel = 'Data Pengguna';
    protected static ?string $pluralModelLabel = 'Pengguna';
    protected static ?string $navigationGroup = 'Manajemen Internal';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('nama_lengkap')
                ->label('Nama Lengkap')
                ->required()
                ->maxLength(255),

            Forms\Components\TextInput::make('email')
                ->email()
                ->required()
                ->maxLength(255),

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
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            Tables\Columns\TextColumn::make('nama_lengkap')
                ->label('Nama')
                ->sortable()
                ->searchable()
                ->weight(FontWeight::Bold),

            Tables\Columns\TextColumn::make('email')
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
                ]),

            Tables\Columns\TextColumn::make('created_at')
                ->label('Dibuat')
                ->dateTime()
                ->sortable(),
        ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
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
