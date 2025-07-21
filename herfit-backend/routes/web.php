<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\TransactionScan;
use Carbon\Carbon;
use Illuminate\Support\Facades\Response;
// use Illuminate\Support\Facades\Artisan;

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

    // ❗ Validasi status harus 'approved'
    if ($transaction->status !== 'approved') {
        return response()->json([
            'success' => false,
            'message' => 'QR code hanya berlaku untuk transaksi dengan status APPROVED.'
        ]);
    }

    // ❗ Validasi apakah QR sudah kadaluarsa
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
        'scanned_by' => auth()->id() ?? 11,
        'scanned_at' => now(),
    ]);

    return response()->json(['success' => true, 'message' => 'Scan berhasil disimpan']);
});

Route::get('/public-file/{path}', function ($path) {
    $fullPath = storage_path('app/public/' . $path);

    if (!file_exists($fullPath)) {
        abort(404);
    }

    $mimeType = mime_content_type($fullPath);
    return Response::make(file_get_contents($fullPath), 200)->header("Content-Type", $mimeType);
})->where('path', '.*');

// ✅ Route sementara untuk clear cache
// Route::get('/__fix-cache', function () {
//     Artisan::call('optimize:clear');
//     Artisan::call('config:clear');
//     Artisan::call('route:clear');
//     Artisan::call('cache:clear');
//     Artisan::call('view:clear');
//     return '✅ Semua cache Laravel berhasil dibersihkan!';
// });

// Route::get('/storage-link', function () {
//     Artisan::call('storage:link');
//     return 'Storage link berhasil dibuat!';
// });