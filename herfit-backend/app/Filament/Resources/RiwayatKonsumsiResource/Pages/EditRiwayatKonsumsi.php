<?php

namespace App\Filament\Resources\RiwayatKonsumsiResource\Pages;

use App\Filament\Resources\RiwayatKonsumsiResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditRiwayatKonsumsi extends EditRecord
{
    protected static string $resource = RiwayatKonsumsiResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
