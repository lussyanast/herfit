<?php

namespace App\Http\Controllers;

use App\Models\Postingan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostinganController extends Controller
{
    public function index()
    {
        $posts = Postingan::with(['pengguna', 'interaksi.pengguna'])
            ->orderByDesc('created_at')
            ->get();

        $data = $posts->map(function ($post) {
            return [
                'id_postingan' => $post->id_postingan,
                'user_name' => $post->pengguna->nama_lengkap,
                'caption' => $post->caption,
                'foto_postingan' => $post->foto_postingan,
                'created_at' => $post->created_at,
                'likes_count' => $post->interaksi->where('jenis_interaksi', 'like')->count(),
                'is_liked' => $post->interaksi
                    ->where('jenis_interaksi', 'like')
                    ->contains('id_pengguna', Auth::id()),
                'comments' => $post->interaksi
                    ->where('jenis_interaksi', 'komentar')
                    ->map(function ($comment) {
                        return [
                            'id_interaksi' => $comment->id_interaksi,
                            'user_name' => $comment->pengguna->nama_lengkap,
                            'isi_komentar' => $comment->isi_komentar,
                        ];
                    })->values(),
            ];
        });

        return response()->json(['success' => true, 'data' => $data]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'caption' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        $path = $request->hasFile('image')
            ? $request->file('image')->store('feeds', 'public')
            : null;

        Postingan::create([
            'id_pengguna' => Auth::id(),
            'caption' => $request->caption,
            'foto_postingan' => $path,
        ]);

        return response()->json(['message' => 'Posted']);
    }

    public function destroy($id)
    {
        $post = Postingan::where('id_postingan', $id)
            ->where('id_pengguna', Auth::id())
            ->firstOrFail();

        $post->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
