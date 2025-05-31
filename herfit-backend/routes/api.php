<?php

use App\Http\Controllers\API\ListingController;
use App\Http\Controllers\API\TransactionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ProfileController;
use App\Http\Controllers\WorkoutTemplateController;
use App\Http\Controllers\FoodConsumedController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return response()->json([
        'success' => true,
        'message' => 'Detail akun yang terdaftar.',
        'data' => $request->user()
    ]);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/workout-templates', [WorkoutTemplateController::class, 'index']);
    Route::post('/workout-templates', [WorkoutTemplateController::class, 'store']);
    Route::get('/workout-templates/{id}', [WorkoutTemplateController::class, 'show']);
    Route::delete('/workout-templates/{id}', [WorkoutTemplateController::class, 'destroy']);

    Route::get('/food-consumed', [FoodConsumedController::class, 'index']);
    Route::post('/food-consumed', [FoodConsumedController::class, 'store']);
    Route::delete('/food-consumed/{id}', [FoodConsumedController::class, 'destroy']);
});

Route::resource('listing', ListingController::class)->only(['index', 'show']);
Route::middleware(['auth:sanctum'])->post('/update-profile', [ProfileController::class, 'update']);
Route::post('transaction/is-available', [TransactionController::class, 'isAvailable'])->middleware(['auth:sanctum']);
Route::resource('transaction', TransactionController::class)->only(['store', 'index', 'show'])->middleware(['auth:sanctum']);

require __DIR__ . '/auth.php';