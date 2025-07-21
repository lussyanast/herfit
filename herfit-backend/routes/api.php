<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\API\ProdukController;
use App\Http\Controllers\API\TransaksiController;
use App\Http\Controllers\API\ProfileController;
use App\Http\Controllers\PostinganController;
use App\Http\Controllers\InteraksiController;
use App\Http\Controllers\MakananController;
use App\Http\Controllers\LatihanController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json([
        'success' => true,
        'message' => 'Detail akun yang terdaftar.',
        'data' => $request->user()
    ]);
});

// ✅ Profil
Route::middleware('auth:sanctum')->post('/update-profile', [ProfileController::class, 'update']);

// ✅ Produk
Route::get('/produk', [ProdukController::class, 'index']);
Route::get('/produk/{kode}', [ProdukController::class, 'show']);

// ✅ Transaksi
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/transaksi/is-available', [TransaksiController::class, 'isAvailable']);
    Route::post('/transaksi/kode/{kode}/upload-bukti', [TransaksiController::class, 'uploadBukti'])->name('transaksi.upload-bukti');
    Route::resource('transaksi', TransaksiController::class)
        ->only(['index', 'store', 'show'])
        ->names([
            'index' => 'transaksi.index',
            'store' => 'transaksi.store',
            'show' => 'transaction.show'
        ]);
    Route::get('/transaksi/kode/{kode}', [TransaksiController::class, 'showByKode'])->name('transaksi.show-by-kode');
});

// ✅ HerFeed: Postingan
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/herfeed-posts', [PostinganController::class, 'index']);
    Route::post('/herfeed-posts', [PostinganController::class, 'store']);
    Route::delete('/herfeed-posts/{id}', [PostinganController::class, 'destroy']);
});

// ✅ HerFeed: Interaksi (like + komentar)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/herfeed-comments', [InteraksiController::class, 'storeKomentar']);
    Route::delete('/herfeed-comments/{id}', [InteraksiController::class, 'destroyKomentar']);
    Route::post('/herfeed-likes/toggle', [InteraksiController::class, 'toggleLike']);
});

// ✅ Aktivitas: Makanan
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/makanan', [MakananController::class, 'index']);
    Route::post('/makanan', [MakananController::class, 'store']);
    Route::put('/makanan/{id}', [MakananController::class, 'update']);
    Route::delete('/makanan/{id}', [MakananController::class, 'destroy']);
});

// ✅ Aktivitas: Latihan
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/latihan', [LatihanController::class, 'index']);
    Route::post('/latihan', [LatihanController::class, 'store']);
    Route::get('/latihan/{id}', [LatihanController::class, 'show']);
    Route::delete('/latihan/{id}', [LatihanController::class, 'destroy']);
});

// ✅ Absensi: Scan Transaksi
Route::get('/transaksi/scan/{kode}', [TransaksiController::class, 'scanByKode']);

require __DIR__ . '/auth.php';