<?php

namespace App\Filament\Resources\AktivitasResource\Pages;

use App\Filament\Resources\AktivitasResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditAktivitas extends EditRecord
{
    protected static string $resource = AktivitasResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make()
                ->label('Hapus')
                ->icon('heroicon-m-trash')
                ->color('danger'),
        ];
    }

    // Footer form: tombol berwarna
    protected function getFormActions(): array
    {
        return [
            Actions\Action::make('cancel')
                ->label('Batal')
                ->url($this->getResource()::getUrl('index'))
                ->icon('heroicon-m-arrow-uturn-left')
                ->color('gray'),
            $this->getSaveFormAction()
                ->label('Simpan')
                ->color('primary')
                ->icon('heroicon-m-check'),
        ];
    }

    /** ===== Normalisasi JADWAL sebelum render & sebelum simpan ===== */
    protected function mutateFormDataBeforeFill(array $data): array
    {
        $data['jadwal'] = $this->normalizeSchedule($data['jadwal'] ?? []);
        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        $clean = [];
        $rows = $data['jadwal'] ?? [];
        if (is_array($rows)) {
            foreach ($rows as $row) {
                if (!is_array($row)) {
                    $decoded = $this->safeJsonToArray($row);
                    if (!is_array($decoded))
                        continue;
                    $row = $decoded;
                }

                $day = $row['day'] ?? ($row['hari'] ?? null);
                $workouts = $row['workouts'] ?? [];
                if (!is_array($workouts))
                    $workouts = $this->safeJsonToArray($workouts);

                $wClean = [];
                foreach ((array) $workouts as $w) {
                    if (is_string($w))
                        $w = $this->safeJsonToArray($w);
                    if (!is_array($w))
                        continue;

                    $wClean[] = [
                        'name' => $w['name'] ?? null,
                        'reps' => $w['reps'] ?? ($w['repetisi'] ?? null),
                    ];
                }

                $clean[] = ['day' => $day, 'workouts' => $wClean];
            }
        }
        $data['jadwal'] = $clean;

        return $data;
    }

    /* ================= Helpers ================= */

    private function normalizeSchedule($raw): array
    {
        $arr = $this->safeJsonToArray($raw);

        $out = [];
        foreach ($arr as $item) {
            if (!is_array($item)) {
                $decoded = $this->safeJsonToArray($item);
                if (!is_array($decoded))
                    continue;
                $item = $decoded;
            }

            $day = $item['day'] ?? ($item['hari'] ?? null);

            $workouts = $item['workouts'] ?? [];
            if (!is_array($workouts))
                $workouts = $this->safeJsonToArray($workouts);
            if ($this->isNumericKeyObject($workouts))
                $workouts = array_values($workouts);

            $wClean = [];
            foreach ((array) $workouts as $w) {
                if (is_string($w))
                    $w = $this->safeJsonToArray($w);
                if (!is_array($w))
                    continue;

                $wClean[] = [
                    'name' => $w['name'] ?? null,
                    'reps' => $w['reps'] ?? ($w['repetisi'] ?? null),
                ];
            }

            $out[] = ['day' => $day, 'workouts' => $wClean];
        }

        return $out;
    }

    /** Decode string/array/object → array; coba hingga 5x (double/triple-encoded) */
    private function safeJsonToArray($val): array
    {
        if (is_array($val))
            return $val;

        if (is_string($val)) {
            $tmp = $val;
            for ($i = 0; $i < 5; $i++) {
                $decoded = json_decode($tmp, true);
                if (is_array($decoded))
                    return $decoded;
                if (is_string($decoded)) {
                    $tmp = $decoded;
                    continue;
                }
                break;
            }
            return [];
        }

        if (is_object($val))
            return (array) $val;

        return [];
    }

    /** Deteksi object dengan key numerik ("0","1",...) */
    private function isNumericKeyObject($arr): bool
    {
        if (!is_array($arr) || $arr === [])
            return false;
        foreach (array_keys($arr) as $k) {
            if (!ctype_digit((string) $k))
                return false;
        }
        return true;
    }
}