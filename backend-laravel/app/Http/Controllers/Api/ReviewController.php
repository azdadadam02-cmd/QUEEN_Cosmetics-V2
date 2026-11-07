<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/** Avis produits : le client écrit, l'admin valide, le public ne voit que les avis approuvés. */
class ReviewController extends Controller
{
    /** GET /api/products/{product}/reviews : approuvés seulement */
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

    /** GET /api/products/{product}/reviews/mine : l'avis du client connecté, même en attente de validation */
    public function mine(Request $request, int $product): JsonResponse
    {
        $r = Review::where('produit_id', $product)->where('utilisateur_id', $request->user()->id)->first();

        return response()->json($r ? ['rating' => $r->note, 'comment' => $r->commentaire, 'approved' => $r->est_approuve] : null);
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

    /** GET /api/admin/reviews : en attente d'abord */
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

    /** PATCH /api/admin/reviews/{review} {approved: bool} */
    public function adminUpdate(Request $request, Review $review): JsonResponse
    {
        $review->update(['est_approuve' => $request->validate(['approved' => ['required', 'boolean']])['approved']]);

        return response()->json(['message' => $review->est_approuve ? 'Avis approuvé : il est visible sur le site.' : 'Avis retiré du site.']);
    }

    public function adminDestroy(Review $review): JsonResponse
    {
        $review->delete();

        return response()->json(['message' => 'Avis supprimé.']);
    }
}
