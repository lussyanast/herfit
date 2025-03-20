<?php

namespace App\Filament\Widgets;

use App\Models\Listing;
use App\Models\Transaction;
use Carbon\Carbon;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    private function getPercentage(int $from, int $to): float
    {
        // Prevent division by zero
        if ($from == 0) {
            return 0;
        }

        return ($to - $from) / $from * 100;
    }

    protected function getStats(): array
    {
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        // Fetch transaction counts for the current and previous month
        $newListing = Listing::whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->count();
        $transactions = Transaction::whereStatus('approved')->whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->count();
        $prevTransactions = Transaction::whereStatus('approved')->whereMonth('created_at', Carbon::now()->subMonth()->month)
            ->whereYear('created_at', $currentYear)
            ->count();

        // Calculate the percentage change
        $transactionPercentage = $this->getPercentage($prevTransactions, $transactions);
        $revenue = Transaction::whereStatus('approved')->whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->sum('price');
        $prevRevenue = Transaction::whereStatus('approved')->whereMonth('created_at', Carbon::now()->subMonth()->month)
            ->whereYear('created_at', $currentYear)
            ->sum('price');

        // Calculate the revenue percentage change
        $revenuePercentage = $this->getPercentage($prevRevenue, $revenue);

        // Set color and icon based on transaction percentage
        $color = $transactionPercentage > 0 ? 'success' : 'danger';
        $icon = $transactionPercentage > 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down';

        $revenueColor = $revenuePercentage > 0 ? 'success' : 'danger';
        $revenueIcon = $revenuePercentage > 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down';

        return [
            Stat::make('Item baru per bulan', $newListing),
            Stat::make('Transaksi per bulan', $transactions)
                ->description($transactionPercentage > 0
                    ? "{$transactionPercentage}% meningkat"
                    : "{$transactionPercentage}% menurun")
                ->color($color)
                ->icon($icon),
            Stat::make('Revenue per bulan', 'Rp. ' . number_format($revenue, 0, ',', '.'))
                ->description($revenuePercentage > 0
                    ? "{$revenuePercentage}% meningkat"
                    : "{$revenuePercentage}% menurun")
                ->descriptionIcon($revenuePercentage > 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($revenuePercentage > 0 ? 'success' : 'danger')
                ->icon($revenuePercentage > 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down'),

        ];
    }
}