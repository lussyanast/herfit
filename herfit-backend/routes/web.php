<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\TransactionScan;
use Carbon\Carbon;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

// ✅ Route untuk menyimpan hasil scan QR
Route::post('/scan/save', function (Request $request) {
    $url = $request->input('qr');

    // Ambil ID dari akhir URL QR
    preg_match('/\/(\d+)$/', $url, $matches);
    $transactionId = $matches[1] ?? null;

    if (!$transactionId) {
        return response()->json(['success' => false, 'message' => 'QR tidak valid'], 422);
    }

    $transaction = Transaction::find($transactionId);

    if (!$transaction) {
        return response()->json(['success' => false, 'message' => 'Transaksi tidak ditemukan'], 404);
    }

    // ❗ Validasi apakah end_date sudah lewat
    $now = Carbon::now();
    $endDate = Carbon::parse($transaction->end_date);

    if ($now->gt($endDate)) {
        return response()->json([
            'success' => false,
            'message' => 'QR code sudah tidak berlaku karena melewati tanggal selesai transaksi.'
        ]);
    }

    // Simpan data scan
    TransactionScan::create([
        'transaction_id' => $transaction->id,
        'scanned_by' => auth()->id() ?? 11, // fallback ID user jika belum login
        'scanned_at' => now(),
    ]);

    return response()->json(['success' => true, 'message' => 'Scan berhasil disimpan']);
});