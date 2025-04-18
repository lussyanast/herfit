<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        if ($request->expectsJson()) {
            return response()->json(['error' => 'Gunakan multipart/form-data, bukan JSON'], 422);
        }

        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'no_identitas' => 'required|string|size:16',
            'no_telp' => 'required|string|min:10|max:12',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'photo_profile' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $data = $request->only(['name', 'no_identitas', 'no_telp', 'email']);

        if ($request->hasFile('photo_profile')) {
            // Hapus foto lama jika ada
            if ($user->photo_profile && Storage::disk('public')->exists($user->photo_profile)) {
                Storage::disk('public')->delete($user->photo_profile);
            }

            // Simpan foto baru
            $path = $request->file('photo_profile')->store('profile', 'public');
            $data['photo_profile'] = $path;
        }

        $user->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui.',
            'data' => $user,
        ]);
    }
}