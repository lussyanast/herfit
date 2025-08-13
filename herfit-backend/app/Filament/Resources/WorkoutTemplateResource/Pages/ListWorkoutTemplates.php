<?php

namespace App\Filament\Resources\WorkoutTemplateResource\Pages;

use App\Filament\Resources\WorkoutTemplateResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListWorkoutTemplates extends ListRecords
{
    protected static string $resource = WorkoutTemplateResource::class;

    protected function getHeaderActions(): array
    {
        return [
        ];
    }
}
