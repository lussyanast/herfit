<?php

namespace App\Filament\Widgets;

use App\Models\Produk;
use App\Models\Transaksi;
use Carbon\Carbon;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    private function getPercentage(int|float $from, int|float $to): float
    {
        if ($from === 0) {
            return $to === 0 ? 0 : 100;
        }

        return (($to - $from) / $from) * 100;
    }

    protected function getStats(): array
    {
        $now = Carbon::now();
        $currentMonth = $now->month;
        $currentYear = $now->year;
        $lastMonth = $now->copy()->subMonth();

        // Item/produk baru bulan ini
        $newListing = Produk::whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->count();

        // Jumlah transaksi disetujui bulan ini
        $currentTransactions = Transaksi::where('status_transaksi', 'approved')
            ->whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->count();

        // Jumlah transaksi disetujui bulan lalu
        $lastTransactions = Transaksi::where('status_transaksi', 'approved')
            ->whereMonth('created_at', $lastMonth->month)
            ->whereYear('created_at', $lastMonth->year)
            ->count();

        $transactionPercentage = $this->getPercentage($lastTransactions, $currentTransactions);

        // Total revenue bulan ini
        $currentRevenue = Transaksi::where('status_transaksi', 'approved')
            ->whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->sum('jumlah_bayar');

        // Total revenue bulan lalu
        $lastRevenue = Transaksi::where('status_transaksi', 'approved')
            ->whereMonth('created_at', $lastMonth->month)
            ->whereYear('created_at', $lastMonth->year)
            ->sum('jumlah_bayar');

        $revenuePercentage = $this->getPercentage($lastRevenue, $currentRevenue);

        return [
            Stat::make('Item Baru Bulan Ini', $newListing),

            Stat::make('Transaksi Bulan Ini', $currentTransactions)
                ->description(abs($transactionPercentage) . '% ' . ($transactionPercentage >= 0 ? 'meningkat' : 'menurun'))
                ->icon($transactionPercentage >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($transactionPercentage >= 0 ? 'success' : 'danger'),

            Stat::make('Revenue Bulan Ini', 'Rp. ' . number_format($currentRevenue, 0, ',', '.'))
                ->description(abs($revenuePercentage) . '% ' . ($revenuePercentage >= 0 ? 'meningkat' : 'menurun'))
                ->icon($revenuePercentage >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($revenuePercentage >= 0 ? 'success' : 'danger'),
        ];
    }
}
