<?php

namespace App\Http\Controllers;

use App\Models\FitnessComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FitnessCommentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'fitness_post_id' => 'required|exists:fitness_posts,id',
            'comment' => 'required|string',
        ]);

        $comment = FitnessComment::create([
            'user_id' => Auth::id(),
            'fitness_post_id' => $request->fitness_post_id,
            'comment' => $request->comment,
        ]);

        return response()->json($comment, 201);
    }

    public function destroy($id)
    {
        $comment = FitnessComment::findOrFail($id);

        if ($comment->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment->delete();
        return response()->json(['message' => 'Comment deleted']);
    }
}
