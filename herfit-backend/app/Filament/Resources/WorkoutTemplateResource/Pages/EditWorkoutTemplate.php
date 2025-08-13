<?php

namespace App\Filament\Resources\WorkoutTemplateResource\Pages;

use App\Filament\Resources\WorkoutTemplateResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditWorkoutTemplate extends EditRecord
{
    protected static string $resource = WorkoutTemplateResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
