<?php

namespace App\Http\Controllers;

use App\Models\FitnessPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FitnessPostController extends Controller
{
    public function index()
    {
        $posts = FitnessPost::with(['user', 'comments.user', 'likes'])->latest()->get();

        $data = $posts->map(function ($post) {
            return [
                'id' => $post->id,
                'user_name' => $post->user->name,
                'caption' => $post->caption,
                'image_url' => $post->image_url,
                'created_at' => $post->created_at,
                'likes_count' => $post->likes->count(),
                'is_liked' => $post->likes->contains('user_id', Auth::id()),
                'comments' => $post->comments->map(function ($comment) {
                    return [
                        'id' => $comment->id,
                        'user_name' => $comment->user->name,
                        'content' => $comment->comment,
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
            'image' => 'nullable|image|max:2048'
        ]);

        $path = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('feeds', 'public');
        }

        FitnessPost::create([
            'user_id' => Auth::id(),
            'caption' => $request->caption,
            'image_url' => $path,
        ]);

        return response()->json(['message' => 'Posted']);
    }

    public function destroy($id)
    {
        $post = FitnessPost::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        $post->delete();

        return response()->json(['message' => 'Deleted']);
    }
}