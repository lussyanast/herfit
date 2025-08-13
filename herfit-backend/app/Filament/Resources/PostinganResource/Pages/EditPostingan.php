<?php

namespace App\Filament\Resources\PostinganResource\Pages;

use App\Filament\Resources\PostinganResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPostingan extends EditRecord
{
    protected static string $resource = PostinganResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
