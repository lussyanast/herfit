<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        if ($request->expectsJson()) {
            return response()->json(['error' => 'Gunakan multipart/form-data, bukan JSON'], 422);
        }

        $user = $request->user();

        $request->validate([
            'nama_lengkap' => 'required|string|max:50',
            'no_identitas' => 'required|string|size:16',
            'no_telp' => 'required|string|min:10|max:15',
            'email' => 'required|email|unique:pengguna,email,' . $user->id_pengguna . ',id_pengguna',
            'foto_profil' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $data = $request->only(['nama_lengkap', 'no_identitas', 'no_telp', 'email']);

        if ($request->hasFile('foto_profil')) {
            // Hapus foto lama jika ada
            if ($user->foto_profil && file_exists(public_path($user->foto_profil))) {
                unlink(public_path($user->foto_profil));
            }

            $file = $request->file('foto_profil');
            $filename = time() . '_' . Str::random(20) . '.' . $file->getClientOriginalExtension();
            $destination = public_path('storage/profil');

            // Buat folder jika belum ada
            if (!File::exists($destination)) {
                File::makeDirectory($destination, 0755, true);
            }

            // Simpan di public/storage/profil
            $file->move($destination, $filename);

            // Copy ke public_html/storage/profil (agar bisa diakses oleh URL)
            $sourcePath = public_path("storage/profil/{$filename}");
            $publicHtmlPath = base_path("public_html/storage/profil/{$filename}");

            if (!File::exists(dirname($publicHtmlPath))) {
                File::makeDirectory(dirname($publicHtmlPath), 0755, true);
            }

            File::copy($sourcePath, $publicHtmlPath);

            // Simpan path relatif
            $data['foto_profil'] = 'storage/profil/' . $filename;
        }

        $user->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui.',
            'data' => $user,
        ]);
    }
}