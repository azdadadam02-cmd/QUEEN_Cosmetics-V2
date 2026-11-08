<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $request->merge(['sujet' => trim((string) $request->input('sujet')), 'message' => trim((string) $request->input('message'))]);
        $data = $request->validate([
            'sujet'   => ['required', 'string', 'max:150'],
            'message' => ['required', 'string', 'max:2000'],
        ], [
            'sujet.*'   => 'Indiquez le sujet (150 caractères maximum).',
            'message.*' => 'Écrivez votre message (2000 caractères maximum).',
        ]);

        Report::create($data + ['utilisateur_id' => $request->user()->id]);

        return response()->json(['message' => 'Votre report a été envoyé.'], 201);
    }

    public function adminIndex(): JsonResponse
    {
        $rows = Report::with('user:id,nom,email')->orderByDesc('id')->limit(300)->get();

        return response()->json($rows->map(fn (Report $r) => [
            'id'      => $r->id,
            'author'  => $r->user?->nom ?? 'Compte supprimé',
            'email'   => $r->user?->email,
            'subject' => $r->sujet,
            'message' => $r->message,
            'date'    => $r->date_reclamation?->toIso8601String(),
        ]));
    }
}
