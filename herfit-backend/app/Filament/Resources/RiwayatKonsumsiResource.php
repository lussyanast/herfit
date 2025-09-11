<?php

namespace App\Filament\Resources;

use App\Filament\Resources\RiwayatKonsumsiResource\Pages;
use App\Models\Aktivitas;
use App\Models\Pengguna;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class RiwayatKonsumsiResource extends Resource
{
    protected static ?string $model = Aktivitas::class;
    protected static ?string $slug = 'riwayat-konsumsi';
    protected static ?string $navigationIcon = 'heroicon-o-sparkles';
    protected static ?string $navigationLabel = 'Kelola Riwayat Konsumsi';
    protected static ?string $navigationGroup = 'Manajemen Konten Member';

    public static function getPluralModelLabel(): string
    {
        return 'Kelola Riwayat Konsumsi';
    }

    public static function getModelLabel(): string
    {
        return 'Riwayat Konsumsi';
    }

    /** filter resource ke jenis_aktivitas = 'makanan' */
    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->where('jenis_aktivitas', 'makanan');
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            // lock jenis_aktivitas
            Forms\Components\Hidden::make('jenis_aktivitas')->default('makanan'),

            Forms\Components\Section::make('Info Pengguna')
                ->schema([
                    Forms\Components\Select::make('id_pengguna')
                        ->label('Pengguna (cari: ID / Email / Nama)')
                        ->searchable()
                        ->native(false)
                        ->getSearchResultsUsing(function (string $search): array {
                            return Pengguna::query()
                                ->when($search !== '', function ($q) use ($search) {
                                    $q->where('id_pengguna', 'like', "%{$search}%")
                                        ->orWhere('email', 'like', "%{$search}%")
                                        ->orWhere('nama_lengkap', 'like', "%{$search}%");
                                })
                                ->limit(25)
                                ->get()
                                ->mapWithKeys(
                                    fn(Pengguna $u) =>
                                    [$u->id_pengguna => "({$u->id_pengguna}) {$u->nama_lengkap} — {$u->email}"]
                                )
                                ->toArray();
                        })
                        ->getOptionLabelUsing(function ($value): ?string {
                            if (!$value)
                                return null;
                            $u = Pengguna::find($value);
                            return $u ? "({$u->id_pengguna}) {$u->nama_lengkap} — {$u->email}" : null;
                        })
                        ->required()
                        ->reactive(),

                    Forms\Components\Grid::make(3)->schema([
                        Forms\Components\Placeholder::make('user_id_display')
                            ->label('ID Pengguna')
                            ->content(fn(Forms\Get $get) => optional(Pengguna::find($get('id_pengguna')))->id_pengguna ?? '—'),
                        Forms\Components\Placeholder::make('user_name_display')
                            ->label('Nama')
                            ->content(fn(Forms\Get $get) => optional(Pengguna::find($get('id_pengguna')))->nama_lengkap ?? '—'),
                        Forms\Components\Placeholder::make('user_email_display')
                            ->label('Email')
                            ->content(fn(Forms\Get $get) => optional(Pengguna::find($get('id_pengguna')))->email ?? '—'),
                    ]),
                ])
                ->collapsible(),

            Forms\Components\Section::make('Detail Konsumsi')
                ->schema([
                    Forms\Components\TextInput::make('nama_aktivitas')
                        ->label('Nama Makanan/Minuman')
                        ->required()
                        ->maxLength(150),
                    Forms\Components\TextInput::make('kalori')
                        ->label('Kalori')
                        ->numeric()
                        ->minValue(0)
                        ->suffix(' kcal')
                        ->required(),
                ])
                ->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id_aktivitas')
                    ->label('ID Aktivitas')->sortable()->toggleable()->searchable(),
                Tables\Columns\TextColumn::make('pengguna.id_pengguna')
                    ->label('ID Pengguna')->sortable()->toggleable(),
                Tables\Columns\TextColumn::make('pengguna.nama_lengkap')
                    ->label('Nama')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('pengguna.email')
                    ->label('Email')->searchable()->toggleable(),
                Tables\Columns\TextColumn::make('nama_aktivitas')
                    ->label('Nama Konsumsi')->searchable(),
                Tables\Columns\TextColumn::make('kalori')
                    ->label('Kalori')->suffix(' kcal')->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Dibuat')->dateTime('d M Y H:i')->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('id_pengguna')
                    ->label('Pengguna')->relationship('pengguna', 'nama_lengkap')->searchable(),

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
                Tables\Actions\EditAction::make()->label('Edit')->icon('heroicon-m-pencil-square')->color('warning'),
                Tables\Actions\DeleteAction::make()->label('Hapus')->icon('heroicon-m-trash')->color('danger')->requiresConfirmation(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make()->label('Hapus Terpilih')->color('danger')->requiresConfirmation(),
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
            'index' => Pages\ListRiwayatKonsumsis::route('/'),
            'create' => Pages\CreateRiwayatKonsumsi::route('/create'),
            'edit' => Pages\EditRiwayatKonsumsi::route('/{record}/edit'),
        ];
    }
}