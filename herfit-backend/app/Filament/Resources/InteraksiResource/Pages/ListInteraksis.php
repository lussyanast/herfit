<?php

namespace App\Filament\Resources\InteraksiResource\Pages;

use App\Filament\Resources\InteraksiResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListInteraksis extends ListRecords
{
    protected static string $resource = InteraksiResource::class;

    protected function getHeaderActions(): array
    {
        return [
        ];
    }
}
