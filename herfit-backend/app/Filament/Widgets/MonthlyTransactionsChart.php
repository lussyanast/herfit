<?php

namespace App\Filament\Widgets;

use App\Models\Transaksi;
use Illuminate\Support\Carbon;
use Filament\Widgets\ChartWidget;
use Flowframe\Trend\Trend;
use Flowframe\Trend\TrendValue;

class MonthlyTransactionsChart extends ChartWidget
{
    protected static ?int $sort = 2;
    protected static ?string $heading = 'Transaksi per Bulan';

    protected function getData(): array
    {
        $data = Trend::model(Transaksi::class)
            ->between(
                start: Carbon::now()->startOfYear(),
                end: Carbon::now()->endOfYear()
            )
            ->perMonth()
            ->count();

        return [
            'datasets' => [
                [
                    'label' => 'Transaksi per Bulan',
                    'data' => $data->map(fn(TrendValue $value) => $value->aggregate)->values(),
                ],
            ],
            'labels' => $data->map(fn(TrendValue $value) => Carbon::parse($value->date)->translatedFormat('F'))->values(),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }

    public function getDescription(): string
    {
        return 'Menampilkan jumlah transaksi per bulan selama tahun ini.';
    }
}
