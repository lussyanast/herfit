<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    public function store(LoginRequest $request): JsonResponse
    {
        $request->authenticate();
        $request->session()->regenerate();

        $user = Auth::user();
        $token = $user->createToken('auth')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Anda berhasil login!',
            'data' => [
                'id_pengguna' => $user->id_pengguna,
                'nama_lengkap' => $user->nama_lengkap,
                'email' => $user->email,
                'foto_profil' => $user->foto_profil,
                'token' => $token,
            ]
        ]);
    }

    public function destroy(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Anda berhasil logout!'
        ]);
    }
}