<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Produk;
use Illuminate\Http\JsonResponse;

class ProdukController extends Controller
{
    public function index(): JsonResponse
    {
        $produk = Produk::withCount('transaksi')->orderBy('transaksi_count', 'desc')->paginate();

        return response()->json([
            'success' => true,
            'message' => 'Mengambil semua produk.',
            'data' => $produk,
        ]);
    }

    public function show(Produk $produk): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Mengambil detail produk.',
            'data' => $produk,
        ]);
    }
}


