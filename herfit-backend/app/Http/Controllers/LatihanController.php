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
            ->where('id_pengguna', Auth::id())
            ->orderBy('tanggal', 'desc')
            ->get();

        return response()->json($latihan);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nama_aktivitas' => 'required|string|max:30',
            'durasi' => 'required|integer|min:1',
            'jadwal' => 'required|array',
            'tanggal' => 'nullable|date',
        ]);

        $data['id_pengguna'] = Auth::id();
        $data['jenis_aktivitas'] = 'latihan';
        $data['tanggal'] = $data['tanggal'] ?? now()->toDateString();

        $aktivitas = Aktivitas::create($data);

        return response()->json($aktivitas, 201);
    }

    public function show($id)
    {
        $aktivitas = Aktivitas::latihan()
            ->where('id_aktivitas', $id)
            ->where('id_pengguna', Auth::id())
            ->firstOrFail();

        return response()->json($aktivitas);
    }

    public function destroy($id)
    {
        $aktivitas = Aktivitas::latihan()
            ->where('id_aktivitas', $id)
            ->where('id_pengguna', Auth::id())
            ->firstOrFail();

        $aktivitas->delete();

        return response()->json(['message' => 'Latihan dihapus']);
    }
}