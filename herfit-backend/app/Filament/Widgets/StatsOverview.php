<?php

namespace App\Filament\Widgets;

use App\Models\Transaksi;
use Carbon\Carbon;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    /**
     * Hitung persentase perubahan dari $prev ke $curr.
     * - return null jika prev = 0 dan curr > 0 (anggap "baru", bukan 100%)
     * - return 0 jika prev = 0 dan curr = 0
     */
    private function percentageDelta(float|int $prev, float|int $curr): ?float
    {
        if ($prev == 0) {
            return $curr == 0 ? 0.0 : null; // null => kita tampilkan "baru"
        }
        return (($curr - $prev) / $prev) * 100;
    }

    /** Format persen rapi: 1 desimal, tanpa trailing .0 */
    private function fmtPercent(?float $pct): string
    {
        if ($pct === null)
            return 'baru';
        $n = round($pct, 1);
        // hilangkan .0
        $s = rtrim(rtrim(number_format($n, 1, '.', ''), '0'), '.');
        return $s . '%';
    }

    /** Format rupiah: "Rp 1.234.567" */
    private function rupiah(int|float $amount): string
    {
        return 'Rp ' . number_format((int) $amount, 0, ',', '.');
    }

    protected function getStats(): array
    {
        $now = Carbon::now();

        // Rentang bulan ini
        $thisStart = $now->copy()->startOfMonth();
        $thisEnd = $now->copy()->endOfMonth();

        // Rentang bulan lalu
        $lastStart = $thisStart->copy()->subMonth()->startOfMonth();
        $lastEnd = $thisStart->copy()->subMonth()->endOfMonth();

        // === Transaksi approved ===
        $currentTransactions = Transaksi::where('status_transaksi', 'approved')
            ->whereBetween('created_at', [$thisStart, $thisEnd])
            ->count();

        $lastTransactions = Transaksi::where('status_transaksi', 'approved')
            ->whereBetween('created_at', [$lastStart, $lastEnd])
            ->count();

        $txPct = $this->percentageDelta($lastTransactions, $currentTransactions);
        $txDesc = match (true) {
            $txPct === null => 'baru',
            $txPct > 0 => $this->fmtPercent($txPct) . ' meningkat',
            $txPct < 0 => $this->fmtPercent(abs($txPct)) . ' menurun',
            default => 'tetap',
        };
        $txIcon = $txPct === null ? 'heroicon-m-sparkles'
            : ($txPct > 0 ? 'heroicon-m-arrow-trending-up'
                : ($txPct < 0 ? 'heroicon-m-arrow-trending-down' : 'heroicon-m-minus-small'));
        $txColor = $txPct === null ? 'info'
            : ($txPct > 0 ? 'success'
                : ($txPct < 0 ? 'danger' : 'gray'));

        // === Revenue (jumlah_bayar) ===
        $currentRevenue = Transaksi::where('status_transaksi', 'approved')
            ->whereBetween('created_at', [$thisStart, $thisEnd])
            ->sum('jumlah_bayar');

        $lastRevenue = Transaksi::where('status_transaksi', 'approved')
            ->whereBetween('created_at', [$lastStart, $lastEnd])
            ->sum('jumlah_bayar');

        $revPct = $this->percentageDelta($lastRevenue, $currentRevenue);
        $revDesc = match (true) {
            $revPct === null => 'baru',
            $revPct > 0 => $this->fmtPercent($revPct) . ' meningkat',
            $revPct < 0 => $this->fmtPercent(abs($revPct)) . ' menurun',
            default => 'tetap',
        };
        $revIcon = $revPct === null ? 'heroicon-m-sparkles'
            : ($revPct > 0 ? 'heroicon-m-arrow-trending-up'
                : ($revPct < 0 ? 'heroicon-m-arrow-trending-down' : 'heroicon-m-minus-small'));
        $revColor = $revPct === null ? 'info'
            : ($revPct > 0 ? 'success'
                : ($revPct < 0 ? 'danger' : 'gray'));

        return [
            Stat::make('Transaksi Bulan Ini', (string) $currentTransactions)
                ->description($txDesc)
                ->icon($txIcon)
                ->color($txColor),

            Stat::make('Revenue Bulan Ini', $this->rupiah($currentRevenue))
                ->description($revDesc)
                ->icon($revIcon)
                ->color($revColor),
        ];
    }
}