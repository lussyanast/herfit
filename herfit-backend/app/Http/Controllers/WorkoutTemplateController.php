<?php

namespace App\Http\Controllers;

use App\Models\WorkoutTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WorkoutTemplateController extends Controller
{
    public function index()
    {
        $templates = WorkoutTemplate::where('user_id', Auth::id())->get();

        return response()->json($templates);
    }

    public function show($id)
    {
        $template = WorkoutTemplate::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        return response()->json($template);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'template_name' => 'required|string',
            'type' => 'required|in:harian,mingguan',
            'days' => 'required|array'
        ]);

        $template = WorkoutTemplate::create([
            'template_name' => $validated['template_name'],
            'type' => $validated['type'],
            'days' => $validated['days'],
            'user_id' => Auth::id(),
        ]);

        return response()->json($template, 201);
    }

    public function destroy($id)
    {
        $template = WorkoutTemplate::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        $template->delete();

        return response()->json(['message' => 'Template dihapus']);
    }
}