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

    public static function getPluralModelLabel(): string
    {
        return 'Kelola Interaksi Like dan Komentar';
    }

    public static function getModelLabel(): string
    {
        return 'Interaksi';
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('id_interaksi')
                ->label('ID Interaksi')
                ->disabled()
                ->dehydrated(false),

            Forms\Components\Section::make('Identitas')
                ->schema([
                    Forms\Components\Select::make('id_pengguna')
                        ->label('Pengguna (cari: ID / Email / Nama)')
                        ->searchable()
                        ->native(false)
                        ->getSearchResultsUsing(
                            fn(string $search) =>
                            Pengguna::query()
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
                                ->toArray()
                        )
                        ->getOptionLabelUsing(
                            fn($value) =>
                            optional(Pengguna::find($value))
                            ? "({$value}) " . Pengguna::find($value)->nama_lengkap
                            : null
                        )
                        ->required(),

                    Forms\Components\Select::make('id_postingan')
                        ->label('Postingan (cari: ID / Caption)')
                        ->searchable()
                        ->native(false)
                        ->getSearchResultsUsing(
                            fn(string $search) =>
                            Postingan::query()
                                ->when($search !== '', function ($q) use ($search) {
                                    $q->where('id_postingan', 'like', "%{$search}%")
                                        ->orWhere('caption', 'like', "%{$search}%");
                                })
                                ->limit(25)
                                ->get()
                                ->mapWithKeys(
                                    fn(Postingan $p) =>
                                    [$p->id_postingan => "({$p->id_postingan}) " . mb_strimwidth($p->caption, 0, 60, '…')]
                                )
                                ->toArray()
                        )
                        ->getOptionLabelUsing(
                            fn($value) =>
                            optional(Postingan::find($value))
                            ? "({$value}) " . mb_strimwidth(Postingan::find($value)->caption, 0, 60, '…')
                            : null
                        )
                        ->required(),
                ])
                ->columns(2),

            Forms\Components\Section::make('Detail Interaksi')
                ->schema([
                    Forms\Components\Select::make('jenis_interaksi')
                        ->label('Jenis Interaksi')
                        ->options([
                            'like' => 'Like',
                            'komentar' => 'Komentar',
                            'share' => 'Share',
                        ])
                        ->required(),

                    Forms\Components\Textarea::make('isi_komentar')
                        ->label('Isi Komentar')
                        ->rows(3)
                        ->visible(fn(Forms\Get $get) => $get('jenis_interaksi') === 'komentar'),

                    Forms\Components\DateTimePicker::make('waktu_interaksi')
                        ->label('Waktu Interaksi')
                        ->required(),
                ])
                ->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id_interaksi')
                    ->label('ID Interaksi')
                    ->sortable()
                    ->copyable(),

                Tables\Columns\TextColumn::make('pengguna.id_pengguna')
                    ->label('ID Pengguna')->sortable(),
                Tables\Columns\TextColumn::make('pengguna.nama_lengkap')
                    ->label('Nama')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('pengguna.email')
                    ->label('Email')->searchable(),

                Tables\Columns\TextColumn::make('id_postingan')
                    ->label('ID Post')
                    ->sortable(),

                Tables\Columns\TextColumn::make('jenis_interaksi')
                    ->label('Jenis')
                    ->badge()
                    ->color(fn(string $state) => match ($state) {
                        'like' => 'success',
                        'komentar' => 'warning',
                        'share' => 'info',
                        default => 'gray',
                    })
                    ->sortable(),

                Tables\Columns\TextColumn::make('isi_komentar')
                    ->label('Komentar')
                    ->limit(50)
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
                    ->label('Pengguna')->relationship('pengguna', 'nama_lengkap')->searchable(),
                Tables\Filters\SelectFilter::make('id_postingan')
                    ->label('Postingan')->relationship('postingan', 'caption')->searchable(),
                Tables\Filters\Filter::make('rentang_waktu')
                    ->form([
                        Forms\Components\DatePicker::make('from')->label('Dari'),
                        Forms\Components\DatePicker::make('until')->label('Sampai'),
                    ])
                    ->query(function (Builder $query, array $data) {
                        if ($data['from'] ?? null) {
                            $query->whereDate('waktu_interaksi', '>=', $data['from']);
                        }
                        if ($data['until'] ?? null) {
                            $query->whereDate('waktu_interaksi', '<=', $data['until']);
                        }
                        return $query;
                    }),
            ])
            ->actions([
                Tables\Actions\EditAction::make()->label('Edit')->icon('heroicon-m-pencil-square')->color('warning'),
                Tables\Actions\DeleteAction::make()->label('Hapus')->icon('heroicon-m-trash')->color('danger'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make()->label('Hapus Terpilih')->color('danger'),
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