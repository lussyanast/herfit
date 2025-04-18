<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\TransactionScan;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

// ✅ Route untuk menyimpan hasil scan QR
Route::post('/scan/save', function (Request $request) {
    $url = $request->input('qr');

    preg_match('/\/(\d+)$/', $url, $matches);
    $transactionId = $matches[1] ?? null;

    if (!$transactionId) {
        return response()->json(['success' => false, 'message' => 'QR tidak valid'], 422);
    }

    $transaction = Transaction::find($transactionId);

    if (!$transaction) {
        return response()->json(['success' => false, 'message' => 'Transaksi tidak ditemukan'], 404);
    }

    TransactionScan::create([
        'transaction_id' => $transaction->id,
        'scanned_by' => auth()->id() ?? 11, // fallback kalau belum login
        'scanned_at' => now(),
    ]);

    return response()->json(['success' => true, 'message' => 'Scan berhasil disimpan']);
});
