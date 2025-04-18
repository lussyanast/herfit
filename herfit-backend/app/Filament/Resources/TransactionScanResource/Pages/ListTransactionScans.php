<?php

namespace App\Filament\Resources\TransactionScanResource\Pages;

use App\Filament\Resources\TransactionScanResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListTransactionScans extends ListRecords
{
    protected static string $resource = TransactionScanResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
