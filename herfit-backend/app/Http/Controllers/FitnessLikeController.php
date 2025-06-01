<?php

namespace App\Http\Controllers;

use App\Models\FitnessLikes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FitnessLikeController extends Controller
{
    public function toggle(Request $request)
    {
        $request->validate([
            'fitness_post_id' => 'required|exists:fitness_posts,id',
        ]);

        $like = FitnessLikes::where('user_id', Auth::id())
            ->where('fitness_post_id', $request->fitness_post_id)
            ->first();

        if ($like) {
            $like->delete();
            return response()->json(['liked' => false]);
        } else {
            FitnessLikes::create([
                'user_id' => Auth::id(),
                'fitness_post_id' => $request->fitness_post_id,
            ]);
            return response()->json(['liked' => true]);
        }
    }
}