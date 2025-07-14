<?php

use App\Models\Postingan;

class PostinganController extends Controller
{
    public function index()
    {
        $posts = Postingan::with([
            'pengguna',
            'interaksi' => function ($q) {
                $q->where('jenis_interaksi', 'komentar')->with('pengguna');
            }
        ])->latest()->get();

        $data = $posts->map(function ($post) {
            return [
                'id' => $post->id_postingan,
                'user_name' => $post->pengguna->nama_lengkap,
                'caption' => $post->caption,
                'image_url' => $post->foto_postingan,
                'created_at' => $post->created_at,
                'likes_count' => $post->interaksi->where('jenis_interaksi', 'like')->count(),
                'is_liked' => $post->interaksi->where('jenis_interaksi', 'like')->contains('id_pengguna', Auth::id()),
                'comments' => $post->interaksi->where('jenis_interaksi', 'komentar')->map(function ($comment) {
                    return [
                        'id' => $comment->id_interaksi,
                        'user_name' => $comment->pengguna->nama_lengkap,
                        'content' => $comment->isi_komentar,
                    ];
                }),
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

        $path = $request->hasFile('image') ? $request->file('image')->store('feeds', 'public') : null;

        Postingan::create([
            'id_pengguna' => Auth::id(),
            'caption' => $request->caption,
            'foto_postingan' => $path,
        ]);

        return response()->json(['message' => 'Posted']);
    }

    public function destroy($id)
    {
        $post = Postingan::where('id_postingan', $id)->where('id_pengguna', Auth::id())->firstOrFail();
        $post->delete();

        return response()->json(['message' => 'Deleted']);
    }
}