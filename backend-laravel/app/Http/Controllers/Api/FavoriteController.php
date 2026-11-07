<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Favorite;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/** Favoris du client connecté */
class FavoriteController extends Controller
{
    /** GET /api/favorites : ids des produits favoris */
    public function index(Request $request): JsonResponse
    {
        return response()->json(Favorite::where('utilisateur_id', $request->user()->id)->pluck('produit_id'));
    }

    /** GET /api/favorites/products : les produits favoris, pour la page du profil */
    public function products(Request $request): AnonymousResourceCollection
    {
        $ids = Favorite::where('utilisateur_id', $request->user()->id)->select('produit_id');

        return ProductResource::collection(Product::forShop()->whereIn('id', $ids)->get());
    }

    /** POST /api/products/{product}/favorite : ajoute ou retire */
    public function toggle(Request $request, Product $product): JsonResponse
    {
        $key = ['utilisateur_id' => $request->user()->id, 'produit_id' => $product->id];
        $removed = Favorite::where($key)->delete() > 0;
        if (! $removed) {
            Favorite::firstOrCreate($key);   // double clic simultané : la contrainte UNIQUE ne doit pas planter
        }

        return response()->json([
            'favorite' => ! $removed,
            'loves'    => Favorite::where('produit_id', $product->id)->count(),
        ]);
    }
}
