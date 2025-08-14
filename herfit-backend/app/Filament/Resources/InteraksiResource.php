<?php

namespace App\Filament\Resources;

use App\Filament\Resources\InteraksiResource\Pages;
use App\Models\Interaksi;
use App\Models\Pengguna;
use App\Models\Postingan;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class InteraksiResource extends Resource
{
    protected static ?string $model = Interaksi::class;
    protected static ?string $slug = 'interaksi';

    protected static ?string $navigationIcon = 'heroicon-o-chat-bubble-left-right';
    protected static ?string $navigationGroup = 'Manajemen Konten Member';
    protected static ?string $navigationLabel = 'Kelola Interaksi';

    // (opsional) ubah judul list page & breadcrumb
    public static function getPluralModelLabel(): string
    {
        return 'Kelola Interaksi Like dan Komentar';
    }

    // (opsional) label singular di form/create/edit
    public static function getModelLabel(): string
    {
        return 'Interaksi';
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            // ========== IDENTITAS ==========
            Forms\Components\Section::make('Identitas')
                ->schema([
                    // Pengguna (cari ID / Email / Nama)
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

                    // Info pengguna (read-only)
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

                    // Postingan (cari ID / Caption)
                    Forms\Components\Select::make('id_postingan')
                        ->label('Postingan (cari: ID / Caption)')
                        ->searchable()
                        ->native(false)
                        ->getSearchResultsUsing(function (string $search): array {
                            return Postingan::query()
                                ->when($search !== '', function ($q) use ($search) {
                                    $q->where('id_postingan', 'like', "%{$search}%")
                                        ->orWhere('caption', 'like', "%{$search}%");
                                })
                                ->limit(25)
                                ->get()
                                ->mapWithKeys(function (Postingan $p) {
                                    $caption = mb_strimwidth((string) $p->caption, 0, 60, '…');
                                    $label = "({$p->id_postingan}) {$caption}";
                                    return [$p->id_postingan => $label];
                                })
                                ->toArray();
                        })
                        ->getOptionLabelUsing(function ($value): ?string {
                            if (!$value)
                                return null;
                            $p = Postingan::find($value);
                            if (!$p)
                                return null;
                            $caption = mb_strimwidth((string) $p->caption, 0, 60, '…');
                            return "({$p->id_postingan}) {$caption}";
                        })
                        ->required(),
                ])
                ->columns(1)
                ->collapsible(),

            // ========== DETAIL INTERAKSI ==========
            Forms\Components\Section::make('Detail Interaksi')
                ->schema([
                    Forms\Components\Select::make('jenis_interaksi')
                        ->label('Jenis Interaksi')
                        ->options([
                            'like' => 'Like',
                            'komentar' => 'Komentar',
                            'share' => 'Share',
                        ])
                        ->native(false)
                        ->required()
                        ->reactive(),

                    Forms\Components\Textarea::make('isi_komentar')
                        ->label('Isi Komentar')
                        ->rows(3)
                        ->visible(fn(Forms\Get $get) => $get('jenis_interaksi') === 'komentar')
                        ->required(fn(Forms\Get $get) => $get('jenis_interaksi') === 'komentar'),

                    Forms\Components\DateTimePicker::make('waktu_interaksi')
                        ->label('Waktu Interaksi')
                        ->native(false)
                        ->required(),
                ])
                ->columns(2)
                ->collapsible(),
        ])->columns(1);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                // ID Interaksi
                Tables\Columns\TextColumn::make('id_interaksi')
                    ->label('ID Interaksi')
                    ->sortable()
                    ->copyable()
                    ->toggleable(),

                // Pengguna
                Tables\Columns\TextColumn::make('pengguna.id_pengguna')
                    ->label('ID Pengguna')->sortable()->toggleable(),
                Tables\Columns\TextColumn::make('pengguna.nama_lengkap')
                    ->label('Nama')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('pengguna.email')
                    ->label('Email')->searchable()->toggleable(),

                // Postingan
                Tables\Columns\TextColumn::make('id_postingan')
                    ->label('ID Post')
                    ->sortable()
                    ->toggleable(),

                // Jenis
                Tables\Columns\TextColumn::make('jenis_interaksi')
                    ->label('Jenis')
                    ->badge()
                    ->color(fn(string $state) => match ($state) {
                        'like' => 'success',
                        'komentar' => 'warning',
                        'share' => 'info',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn(string $state) => ucfirst($state))
                    ->sortable(),

                // Komentar & waktu
                Tables\Columns\TextColumn::make('isi_komentar')
                    ->label('Komentar')
                    ->limit(50)
                    ->toggleable()
                    ->tooltip(fn($record) => $record->isi_komentar),

                Tables\Columns\TextColumn::make('waktu_interaksi')
                    ->label('Waktu')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('jenis_interaksi')
                    ->options(['like' => 'Like', 'komentar' => 'Komentar', 'share' => 'Share']),

                Tables\Filters\SelectFilter::make('id_pengguna')
                    ->label('Pengguna')
                    ->relationship('pengguna', 'nama_lengkap')
                    ->searchable(),

                Tables\Filters\SelectFilter::make('id_postingan')
                    ->label('Postingan')
                    ->relationship('postingan', 'caption')
                    ->searchable(),

                Tables\Filters\Filter::make('rentang_waktu')
                    ->form([
                        Forms\Components\DatePicker::make('from')->label('Dari'),
                        Forms\Components\DatePicker::make('until')->label('Sampai'),
                    ])
                    ->query(function (Builder $query, array $data) {
                        $from = $data['from'] ?? null;
                        $until = $data['until'] ?? null;
                        if ($from)
                            $query->whereDate('waktu_interaksi', '>=', $from);
                        if ($until)
                            $query->whereDate('waktu_interaksi', '<=', $until);
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
            'index' => Pages\ListInteraksis::route('/'),
            'create' => Pages\CreateInteraksi::route('/create'),
            'edit' => Pages\EditInteraksi::route('/{record}/edit'),
        ];
    }
}