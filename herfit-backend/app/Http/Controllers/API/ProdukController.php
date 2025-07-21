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

    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\File;
    use Illuminate\Support\Str;

    public function store(Request $request): JsonResponse
    {
        if ($request->expectsJson()) {
            return response()->json(['error' => 'Gunakan multipart/form-data, bukan JSON'], 422);
        }

        $validated = $request->validate([
            'nama_produk' => 'required|string|max:255',
            'kategori_produk' => 'required|string',
            'deskripsi_produk' => 'nullable|string',
            'maksimum_peserta' => 'required|integer',
            'harga_produk' => 'required|numeric',
            'foto_produk' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // Ambil ID terakhir
        $lastProduk = Produk::latest('id_produk')->first();
        $nextId = $lastProduk ? $lastProduk->id_produk + 1 : 1;
        $validated['kode_produk'] = 'PRD' . $nextId;

        // Simpan file foto jika ada
        if ($request->hasFile('foto_produk')) {
            $file = $request->file('foto_produk');
            $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $destination = public_path('../storage/produk');

            // Pastikan direktori ada
            if (!File::exists($destination)) {
                File::makeDirectory($destination, 0755, true);
            }

            // Simpan ke public/storage/produk
            $file->move($destination, $filename);

            // Simpan path relatif
            $validated['foto_produk'] = "storage/produk/" . $filename;
        }

        $produk = Produk::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil ditambahkan.',
            'data' => $produk,
        ]);
    }
}
