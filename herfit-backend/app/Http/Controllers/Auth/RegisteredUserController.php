<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
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
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'no_identitas' => ['required', 'string', 'max:20'],
            'no_telp' => ['required', 'string', 'max:15'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
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
