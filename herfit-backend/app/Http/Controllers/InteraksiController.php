<?php

namespace App\Http\Controllers;

use App\Models\Interaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class InteraksiController extends Controller
{
    /**
     * Toggle like (suka) untuk postingan.
     */
    public function toggleLike(Request $request)
    {
        $request->validate([
            'id_postingan' => 'required|exists:postingan,id_postingan',
        ]);

        $like = Interaksi::where([
            'id_pengguna' => Auth::id(),
            'id_postingan' => $request->id_postingan,
            'jenis_interaksi' => 'like',
        ])->first();

        if ($like) {
            $like->delete();
            return response()->json(['liked' => false]);
        }

        Interaksi::create([
            'id_pengguna' => Auth::id(),
            'id_postingan' => $request->id_postingan,
            'jenis_interaksi' => 'like',
            'waktu_interaksi' => now(),
        ]);

        return response()->json(['liked' => true]);
    }

    /**
     * Tambah komentar ke postingan.
     */
    public function storeKomentar(Request $request)
    {
        $request->validate([
            'id_postingan' => 'required|exists:postingan,id_postingan',
            'isi_komentar' => 'required|string',
        ]);

        $komentar = Interaksi::create([
            'id_pengguna' => Auth::id(),
            'id_postingan' => $request->id_postingan,
            'jenis_interaksi' => 'komentar',
            'isi_komentar' => $request->isi_komentar,
            'waktu_interaksi' => now(),
        ]);

        return response()->json($komentar, 201);
    }

    /**
     * Hapus komentar.
     */
    public function destroyKomentar($id)
    {
        $komentar = Interaksi::where('id_interaksi', $id)
            ->where('jenis_interaksi', 'komentar')
            ->firstOrFail();

        if ($komentar->id_pengguna !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $komentar->delete();

        return response()->json(['message' => 'Komentar dihapus']);
    }
}