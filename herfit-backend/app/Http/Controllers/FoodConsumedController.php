<?php

namespace App\Http\Controllers;

use App\Models\FoodConsumed;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FoodConsumedController extends Controller
{
    // Ambil semua data makanan user, bisa difilter berdasarkan tanggal
    public function index(Request $request)
    {
        $query = FoodConsumed::where('user_id', Auth::id());

        if ($request->has('date')) {
            $query->whereDate('date', $request->date);
        }

        $foods = $query->orderBy('date', 'desc')->get();

        $totalCalories = $foods->sum('calories');

        return response()->json([
            'data' => $foods,
            'total_calories' => $totalCalories,
        ]);
    }

    // Tambah makanan
    public function store(Request $request)
    {
        $validated = $request->validate([
            'food_name' => 'required|string|max:255',
            'calories' => 'required|integer|min:0',
            'date' => 'nullable|date',
        ]);

        $validated['user_id'] = Auth::id();
        $validated['date'] = $validated['date'] ?? now()->toDateString();

        $food = FoodConsumed::create($validated);

        return response()->json($food, 201);
    }

    // Update data makanan
    public function update(Request $request, $id)
    {
        $food = FoodConsumed::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        $validated = $request->validate([
            'food_name' => 'sometimes|required|string|max:255',
            'calories' => 'sometimes|required|integer|min:0',
            'date' => 'sometimes|required|date',
        ]);

        $food->update($validated);

        return response()->json($food);
    }

    // Hapus data makanan
    public function destroy($id)
    {
        $food = FoodConsumed::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        $food->delete();

        return response()->json(['message' => 'Data berhasil dihapus.']);
    }
}