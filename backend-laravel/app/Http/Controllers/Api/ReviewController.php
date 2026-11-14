<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/** Avis produits : le client écrit, l'admin valide, le public ne voit que les avis approuvés. */
class ReviewController extends Controller
{
    public function index(int $product): JsonResponse
    {
        $rows = Review::with('user:id,nom,image')->where('produit_id', $product)->where('est_approuve', true)
            ->orderByDesc('date_avis')->limit(50)->get();

        return response()->json($rows->map(fn (Review $r) => [
            'id'      => $r->id,
            'author'  => explode(' ', trim($r->user?->nom ?? 'Client'))[0],   // prénom seulement
            'author_image' => $r->user?->image ? asset('images/'.$r->user->image) : null,
            'rating'  => $r->note,
            'comment' => $r->commentaire,
            'date'    => $r->date_avis?->toIso8601String(),
        ]));
    }

    public function mine(Request $request, int $product): JsonResponse|Response
    {
        $r = Review::where('produit_id', $product)->where('utilisateur_id', $request->user()->id)->first();

        // 204 sans corps : response()->json(null) renverrait « {} », que Next.js prendrait pour un avis existant
        return $r
            ? response()->json(['rating' => $r->note, 'comment' => $r->commentaire, 'approved' => $r->est_approuve, 'date' => $r->date_avis?->toIso8601String()])
            : response()->noContent();
    }

    /** POST /api/products/{product}/reviews : un avis par client et produit ; un nouvel envoi repasse en modération */
    public function store(Request $request, int $product): JsonResponse
    {
        Product::findOrFail($product);
        $data = $request->validate([
            'note'        => ['required', 'integer', 'between:1,5'],
            'commentaire' => ['nullable', 'string', 'max:1000'],
        ], ['note.*' => 'Choisissez une note de 1 à 5.', 'commentaire.*' => 'Commentaire trop long (1000 caractères max).']);

        Review::updateOrCreate(
            ['produit_id' => $product, 'utilisateur_id' => $request->user()->id],
            ['note' => $data['note'], 'commentaire' => $data['commentaire'] ?? null, 'est_approuve' => false, 'date_avis' => now()],
        );

        return response()->json(['message' => 'Merci ! Votre avis sera visible après validation par notre équipe.'], 201);
    }

    public function adminIndex(): JsonResponse
    {
        $rows = Review::with(['user:id,nom,email', 'product:id,nom'])->orderBy('est_approuve')->orderByDesc('date_avis')->limit(300)->get();

        return response()->json($rows->map(fn (Review $r) => [
            'id'       => $r->id,
            'product'  => $r->product?->nom,
            'author'   => $r->user?->nom,
            'email'    => $r->user?->email,
            'rating'   => $r->note,
            'comment'  => $r->commentaire,
            'date'     => $r->date_avis?->toIso8601String(),
            'approved' => $r->est_approuve,
        ]));
    }

    public function adminUpdate(Request $request, Review $review): JsonResponse
    {
        $review->update(['est_approuve' => $request->validate(['approved' => ['required', 'boolean']])['approved']]);

        return response()->json(['message' => $review->est_approuve ? 'Avis approuvé : il est visible sur le site.' : 'Avis retiré du site.']);
    }

    /** DELETE /api/products/{product}/reviews/mine : le client retire son propre avis (jamais celui d'un autre) */
    public function destroyMine(Request $request, int $product): JsonResponse
    {
        $deleted = Review::where('produit_id', $product)->where('utilisateur_id', $request->user()->id)->delete();

        return $deleted
            ? response()->json(['message' => 'Votre avis a été supprimé.'])
            : response()->json(['message' => "Vous n'avez pas d'avis sur ce produit."], 404);
    }

    public function adminDestroy(Review $review): JsonResponse
    {
        $review->delete();

        return response()->json(['message' => 'Avis supprimé.']);
    }
}
