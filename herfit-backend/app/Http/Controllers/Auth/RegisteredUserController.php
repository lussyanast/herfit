<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Pengguna;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'nama_lengkap' => ['required', 'string', 'max:50'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:pengguna,email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'no_identitas' => ['nullable', 'string', 'max:16'],
            'no_telp' => ['nullable', 'string', 'max:15'],
        ]);

        $user = Pengguna::create([
            'nama_lengkap' => $request->nama_lengkap,
            'email' => $request->email,
            'kata_sandi' => Hash::make($request->password),
            'no_identitas' => $request->no_identitas,
            'no_telp' => $request->no_telp,
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ]);

        event(new Registered($user));
        Auth::login($user);

        $user['token'] = $user->createToken('auth')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Anda berhasil mendaftar!',
            'data' => $user,
        ]);
    }
}