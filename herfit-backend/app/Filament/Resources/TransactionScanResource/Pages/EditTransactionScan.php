<?php

namespace App\Filament\Resources\TransactionScanResource\Pages;

use App\Filament\Resources\TransactionScanResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditTransactionScan extends EditRecord
{
    protected static string $resource = TransactionScanResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
