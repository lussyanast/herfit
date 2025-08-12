<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AktivitasResource\Pages;
use App\Models\Aktivitas;
use App\Models\Pengguna;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class AktivitasResource extends Resource
{
    protected static ?string $model = Aktivitas::class;
    protected static ?string $navigationIcon = 'heroicon-o-clipboard-document-check';
    protected static ?string $navigationGroup = 'Herfit Admin';

    public static function form(Form $form): Form
    {
        return $form->schema([
            // ========== SECTION: PENGGUNA ==========
            Forms\Components\Section::make('Info Pengguna')
                ->description('Pilih pengguna berdasarkan ID atau email. Data lain akan mengikuti otomatis.')
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
                                ->mapWithKeys(function (Pengguna $u) {
                                    $label = "({$u->id_pengguna}) {$u->nama_lengkap} — {$u->email}";
                                    return [$u->id_pengguna => $label];
                                })
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
                ->collapsible()
                ->columns(1),

            // ========== SECTION: DETAIL ==========
            Forms\Components\Section::make('Detail Aktivitas')
                ->schema([
                    Forms\Components\Select::make('jenis_aktivitas')
                        ->label('Jenis aktivitas')
                        ->options(['makanan' => 'Makanan', 'latihan' => 'Latihan'])
                        ->native(false)
                        ->required(),
                    Forms\Components\TextInput::make('nama_aktivitas')
                        ->label('Nama aktivitas')
                        ->required()
                        ->maxLength(150),
                ])
                ->columns(2),

            // ========== SECTION: JADWAL ==========
            Forms\Components\Section::make('Jadwal Latihan')
                ->visible(fn(Forms\Get $get) => $get('jenis_aktivitas') === 'latihan')
                ->schema([
                    Forms\Components\Repeater::make('jadwal')
                        ->label('Jadwal')
                        ->schema([
                            Forms\Components\Select::make('day')
                                ->label('Hari')
                                ->options([
                                    'Senin' => 'Senin',
                                    'Selasa' => 'Selasa',
                                    'Rabu' => 'Rabu',
                                    'Kamis' => 'Kamis',
                                    'Jumat' => 'Jumat',
                                    'Sabtu' => 'Sabtu',
                                    'Minggu' => 'Minggu',
                                ])
                                ->required()
                                ->native(false),

                            Forms\Components\Repeater::make('workouts')
                                ->label('Daftar Latihan')
                                ->schema([
                                    Forms\Components\TextInput::make('name')
                                        ->label('Nama latihan')->required()->maxLength(100),
                                    Forms\Components\TextInput::make('reps')
                                        ->label('Reps (mis. 3×12)')->maxLength(30),
                                ])
                                // 🔹 Hindari bentrok nama action → pakai label saja
                                ->addActionLabel('Tambah Latihan')
                                ->default([])
                                ->columns(2)
                                ->collapsed(false),
                        ])
                        // 🔹 Hindari bentrok nama action → pakai label saja
                        ->addActionLabel('Tambah Hari')
                        ->default([])
                        ->reorderable()
                        ->collapsed(false)
                        ->columnSpanFull(),
                ])
                ->collapsible(),

            // NOTE: Kolom KALORI & TANGGAL disembunyikan dari form edit.
        ])->columns(1);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('pengguna.id_pengguna')
                    ->label('ID Pengguna')->sortable()->toggleable(),
                Tables\Columns\TextColumn::make('pengguna.nama_lengkap')
                    ->label('Nama')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('pengguna.email')
                    ->label('Email')->searchable()->toggleable(),
                Tables\Columns\TextColumn::make('jenis_aktivitas')
                    ->badge()->sortable(),
                Tables\Columns\TextColumn::make('nama_aktivitas')
                    ->label('Nama Aktivitas')->searchable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Dibuat')->dateTime('d M Y H:i')->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('jenis_aktivitas')
                    ->options(['makanan' => 'Makanan', 'latihan' => 'Latihan']),
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
                        $from = $data['from'] ?? null;
                        $until = $data['until'] ?? null;
                        if ($from)
                            $query->whereDate('created_at', '>=', $from);
                        if ($until)
                            $query->whereDate('created_at', '<=', $until);
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
            'index' => Pages\ListAktivitas::route('/'),
            'edit' => Pages\EditAktivitas::route('/{record}/edit'),
        ];
    }
}