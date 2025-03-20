<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;
use App\Models\Transaction;
use Carbon\Carbon;
use Flowframe\Trend\Trend;
use Flowframe\Trend\TrendValue;

class MonthlyTransactionsChart extends ChartWidget
{
    protected static ?int $sort = 2;
    protected static ?string $heading = 'Transaksi per Bulan';

    protected function getData(): array
    {
        $startOfYear = Carbon::now()->startOfYear();
        $endOfYear = Carbon::now()->endOfYear();

        $transactions = Transaction::query()
            ->whereBetween('created_at', [$startOfYear, $endOfYear])
            ->get()
            ->groupBy(function ($date) {
                return Carbon::parse($date->created_at)->format('M');
            });

        $monthlyCounts = $transactions->mapWithKeys(function ($transactions, $month) {
            return [
                $month => count($transactions)
            ];
        });

        $data = Trend::model(Transaction::class)
            ->between(start: now()->startOfYear(), end: now()->endOfYear())
            ->perMonth()
            ->count();

        return [
            'datasets' => [
                [
                    'label' => 'Transaksi per Bulan',
                    'data' => $data->map(fn(TrendValue $value) => $value->aggregate)->values(),
                ],
            ],
            'labels' => $data->map(fn(TrendValue $value) => $value->date)->values(),
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
