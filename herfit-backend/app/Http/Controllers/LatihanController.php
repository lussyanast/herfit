<?php

namespace App\Http\Controllers;

use App\Models\Aktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LatihanController extends Controller
{
    public function index()
    {
        $latihan = Aktivitas::latihan()
            ->where('id_pengguna', Auth::user()->id_pengguna ?? Auth::id())
            ->orderBy('tanggal', 'desc')
            ->get();

        return response()->json($latihan);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nama_aktivitas' => 'required|string|max:30',
            'durasi' => 'required|integer|min:1',
            'jadwal' => 'required|string',
            'tanggal' => 'nullable|date',
        ]);

        $data['id_pengguna'] = Auth::user()->id_pengguna ?? Auth::id();
        $data['jenis_aktivitas'] = 'latihan';
        $data['tanggal'] = $data['tanggal'] ?? now()->toDateString();

        $lastId = Aktivitas::where('jenis_aktivitas', 'latihan')->max('id_aktivitas'); // contoh LAT023
        $num = $lastId ? (int) substr($lastId, 3) + 1 : 1;
        $data['id_aktivitas'] = 'LAT' . str_pad($num, 3, '0', STR_PAD_LEFT);

        try {
            $aktivitas = Aktivitas::create($data);
            return response()->json($aktivitas, 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menyimpan template latihan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        $aktivitas = Aktivitas::latihan()
            ->where('id_aktivitas', $id)
            ->where('id_pengguna', Auth::user()->id_pengguna ?? Auth::id())
            ->firstOrFail();

        return response()->json($aktivitas);
    }

    public function destroy($id)
    {
        $aktivitas = Aktivitas::latihan()
            ->where('id_aktivitas', $id)
            ->where('id_pengguna', Auth::user()->id_pengguna ?? Auth::id())
            ->firstOrFail();

        $aktivitas->delete();

        return response()->json(['message' => 'Latihan dihapus']);
    }
}