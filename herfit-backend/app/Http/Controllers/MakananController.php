<?php

namespace App\Http\Controllers;

use App\Models\Aktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MakananController extends Controller
{
    public function index(Request $request)
    {
        $query = Aktivitas::makanan()->where('id_pengguna', Auth::id());

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

        $data['id_pengguna'] = Auth::id();
        $data['jenis_aktivitas'] = 'makanan';
        $data['tanggal'] = $data['tanggal'] ?? now()->toDateString();

        $aktivitas = Aktivitas::create($data);

        return response()->json($aktivitas, 201);
    }

    public function update(Request $request, $id)
    {
        $aktivitas = Aktivitas::makanan()
            ->where('id_aktivitas', $id)
            ->where('id_pengguna', Auth::id())
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
            ->where('id_pengguna', Auth::id())
            ->firstOrFail();

        $aktivitas->delete();

        return response()->json(['message' => 'Data konsumsi dihapus.']);
    }
}