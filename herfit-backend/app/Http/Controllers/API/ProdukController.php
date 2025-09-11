<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Produk;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProdukController extends Controller
{
    /**
     * Ambil semua produk (untuk listing).
     */
    public function index(): JsonResponse
    {
        $produk = Produk::select([
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

    /**
     * Tambah produk baru.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_produk' => 'required|string|max:255',
            'kategori_produk' => 'required|string',
            'deskripsi_produk' => 'nullable|string',
            'maksimum_peserta' => 'required|integer',
            'harga_produk' => 'required|numeric',
            'foto_produk' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // Generate kode otomatis
        $last = Produk::withTrashed()
            ->where('kode_produk', 'like', 'PRD%')
            ->orderByDesc('kode_produk')
            ->first();

        $next = $last ? ((int) substr($last->kode_produk, 3)) + 1 : 1;
        $validated['kode_produk'] = 'PRD' . str_pad($next, 3, '0', STR_PAD_LEFT);

        // Simpan foto ke storage/app/public/produk
        if ($request->hasFile('foto_produk')) {
            $file = $request->file('foto_produk');
            $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('produk', $filename, 'public');
            $validated['foto_produk'] = $path;
        }

        $produk = Produk::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil ditambahkan.',
            'data' => $produk,
        ]);
    }
}