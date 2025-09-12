<?php

namespace App\Http\Controllers;

use App\Models\Aktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MakananController extends Controller
{
    public function index(Request $request)
    {
        $query = Aktivitas::makanan()->where('id_pengguna', Auth::user()->id_pengguna ?? Auth::id());

        if ($request->has('tanggal')) {
            $query->whereDate('tanggal', $request->tanggal);
        }

        $items = $query->orderBy('tanggal', 'desc')->get();
        $totalCalories = $items->sum('kalori');

        return response()->json([
            'data' => $items,
            'total_calories' => $totalCalories,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nama_aktivitas' => 'required|string|max:30',
            'kalori' => 'required|integer|min:0',
            'tanggal' => 'nullable|date',
        ]);

        $data['id_pengguna'] = Auth::user()->id_pengguna ?? Auth::id();
        $data['jenis_aktivitas'] = 'makanan';
        $data['tanggal'] = $data['tanggal'] ?? now()->toDateString();

        // Generate id_aktivitas otomatis MKN001, MKN002, dst.
        $lastId = Aktivitas::where('jenis_aktivitas', 'makanan')->max('id_aktivitas'); // contoh: MKN020
        $num = $lastId ? (int) substr($lastId, 3) + 1 : 1;
        $data['id_aktivitas'] = 'MKN' . str_pad($num, 3, '0', STR_PAD_LEFT);

        try {
            $aktivitas = Aktivitas::create($data);
            return response()->json($aktivitas, 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menyimpan data aktivitas',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $aktivitas = Aktivitas::makanan()
            ->where('id_aktivitas', $id)
            ->where('id_pengguna', Auth::user()->id_pengguna ?? Auth::id())
            ->firstOrFail();

        $data = $request->validate([
            'nama_aktivitas' => 'sometimes|required|string|max:30',
            'kalori' => 'sometimes|required|integer|min:0',
            'tanggal' => 'sometimes|required|date',
        ]);

        $aktivitas->update($data);

        return response()->json($aktivitas);
    }

    public function destroy($id)
    {
        $aktivitas = Aktivitas::makanan()
            ->where('id_aktivitas', $id)
            ->where('id_pengguna', Auth::user()->id_pengguna ?? Auth::id())
            ->firstOrFail();

        $aktivitas->delete();

        return response()->json(['message' => 'Data konsumsi dihapus.']);
    }
}