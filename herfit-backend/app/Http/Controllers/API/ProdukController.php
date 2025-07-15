<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Produk;
use Illuminate\Http\JsonResponse;

class ProdukController extends Controller
{
    /**
     * Ambil semua produk (untuk listing).
     */
    public function index(): JsonResponse
    {
        $produk = Produk::select([
            'id_produk',
            'kode_produk',
            'nama_produk',
            'harga_produk',
            'kategori_produk',
            'foto_produk'
        ])->get();

        return response()->json([
            'success' => true,
            'message' => 'Mengambil semua produk.',
            'data' => $produk,
        ]);
    }

    /**
     * Ambil detail produk berdasarkan kode_produk.
     */
    public function show($kode): JsonResponse
    {
        $produk = Produk::where('kode_produk', $kode)->firstOrFail();

        return response()->json([
            'success' => true,
            'message' => 'Mengambil detail produk.',
            'data' => $produk,
        ]);
    }
}
