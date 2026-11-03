<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ImageUploader;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductController extends Controller
{
    /* ───────── Boutique (public) ───────── */

    /** GET /api/products?category=Parfums&search=rose */
    public function index(Request $request): AnonymousResourceCollection
    {
        $q = Product::forShop();

        if ($cat = $request->string('category')->trim()->value()) {
            $q->where('categorie', $cat);
        }
        if ($s = $request->string('search')->trim()->limit(60, '')->value()) {
            $q->where('nom', 'like', '%'.addcslashes($s, '%_\\').'%');
        }

        return ProductResource::collection($q->get());
    }

    /** GET /api/products/{product} */
    public function show(int $product): ProductResource
    {
        return new ProductResource(Product::withPromo()->findOrFail($product));
    }

    /** GET /api/categories */
    public function categories(): JsonResponse
    {
        return response()->json(
            Product::query()->whereNotNull('categorie')->where('categorie', '<>', '')
                ->distinct()->orderBy('categorie')->pluck('categorie')
        );
    }

    /* ───────── Back-office ───────── */

    /** GET /api/manage/products — liste complète + stats (responsable produits & admin en lecture) */
    public function manageIndex(): JsonResponse
    {
        $products = Product::withPromo()->orderByDesc('id')->get();

        return response()->json([
            'products'   => ProductResource::collection($products),
            'categories' => $products->pluck('categorie')->filter()->unique()->sort()->values(),
            'stats'      => [
                'total'   => $products->count(),
                'rupture' => $products->where('quantite_stock', '<=', 0)->count(),
                'faible'  => $products->filter(fn ($p) => $p->quantite_stock > 0 && $p->quantite_stock <= 5)->count(),
                'unites'  => (int) $products->sum('quantite_stock'),
            ],
        ]);
    }

    /** POST /api/manage/products (multipart/form-data) */
    public function store(ProductRequest $request, ImageUploader $uploader): JsonResponse
    {
        $product = Product::create([
            'nom'            => $request->input('nom'),
            'categorie'      => $request->input('categorie'),
            'prix'           => round((float) $request->input('prix'), 2),
            'quantite_stock' => (int) $request->input('stock'),
            'promotion'      => (int) $request->input('promotion'),
            'image'          => $uploader->store($request->file('image'), $request->input('nom')),
        ]);

        return response()->json([
            'message' => "Produit « {$product->nom} » ajouté au catalogue.",
            'product' => new ProductResource($product),
        ], 201);
    }

    /** POST /api/manage/products/{product} (multipart — sans image, l'ancienne est gardée) */
    public function update(ProductRequest $request, Product $product, ImageUploader $uploader): JsonResponse
    {
        $data = [
            'nom'            => $request->input('nom'),
            'categorie'      => $request->input('categorie'),
            'prix'           => round((float) $request->input('prix'), 2),
            'quantite_stock' => (int) $request->input('stock'),
            'promotion'      => (int) $request->input('promotion'),
        ];
        if ($img = $uploader->store($request->file('image'), $request->input('nom'))) {
            $data['image'] = $img;
        }
        $product->update($data);

        return response()->json([
            'message' => "Produit « {$product->nom} » mis à jour.",
            'product' => new ProductResource($product->fresh()),
        ]);
    }
}
