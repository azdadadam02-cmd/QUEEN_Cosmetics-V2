<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Services\ImageUploader;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
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

    public function show(int $product): ProductResource
    {
        $p = Product::withPromo()->with(['variants', 'images'])->withCount('favorites as loves_count')->findOrFail($product);
        // Clients différents ayant commandé ce produit (les commandes refusées ne comptent pas)
        $p->buyers_count = OrderItem::join('commandes', 'commandes.id', '=', 'details_commandes.commande_id')
            ->where('details_commandes.produit_id', $p->id)
            ->where('commandes.statut', '<>', Order::REFUSEE)
            ->distinct()
            ->count('commandes.client_id');

        return new ProductResource($p);
    }

    public function suggestions(Request $request): AnonymousResourceCollection
    {
        $ids = collect(explode(',', (string) $request->query('ids')))->map(fn ($v) => (int) $v)->filter()->unique()->take(30)->values();
        $cart = Product::whereIn('id', $ids)->get(['sous_categorie', 'categorie']);

        // Les mieux notés d'abord (puis les plus d'avis, puis les plus récents) ; 6 par défaut, ?limit=7 permet de savoir s'il en reste
        $max  = min(12, max(1, (int) $request->query('limit', 6)));
        $find = fn (string $column) => Product::forShop()
            ->whereIn($column, $cart->pluck($column)->filter()->unique()->values())
            ->whereNotIn('id', $ids)
            ->where('quantite_stock', '>', 0)
            ->reorder()->orderByDesc('rating_avg')->orderByDesc('rating_count')->orderByDesc('id')
            ->limit($max)
            ->get();

        $products = $find('sous_categorie');

        return ProductResource::collection($products->isNotEmpty() ? $products : $find('categorie'));
    }

    public function categories(): JsonResponse
    {
        return response()->json(
            Product::query()->whereNotNull('categorie')->where('categorie', '<>', '')
                ->distinct()->orderBy('categorie')->pluck('categorie')
        );
    }

    public function manageIndex(): JsonResponse
    {
        // Corbeille comprise (flag « deleted ») ; catégories et stats ne parlent que du catalogue actif
        $all      = Product::withTrashed()->withPromo()->with(['variants', 'images'])->orderByDesc('id')->get();
        $products = $all->reject->trashed();

        return response()->json([
            'products'   => ProductResource::collection($all),
            'categories' => $products->pluck('categorie')->filter()->unique()->sort()->values(),
            'stats'      => [
                'total'   => $products->count(),
                'rupture' => $products->where('quantite_stock', '<=', 0)->count(),
                'faible'  => $products->filter(fn ($p) => $p->quantite_stock > 0 && $p->quantite_stock <= 5)->count(),
                'unites'  => (int) $products->sum('quantite_stock'),
                'corbeille' => $all->count() - $products->count(),
            ],
        ]);
    }

    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json(['message' => "Produit « {$product->nom} » mis dans les supprimés."]);
    }

    public function restore(int $id): JsonResponse
    {
        $product = Product::onlyTrashed()->findOrFail($id);
        $product->restore();

        return response()->json(['message' => "Produit « {$product->nom} » restauré."]);
    }

    /** DELETE /api/manage/products/{id}/force : définitif, seulement depuis la corbeille et si aucune commande ne le contient */
    public function forceDestroy(int $id): JsonResponse
    {
        $product = Product::onlyTrashed()->findOrFail($id);

        if ($n = OrderItem::where('produit_id', $id)->distinct()->count('commande_id')) {
            return response()->json([
                'message' => "Suppression définitive impossible : « {$product->nom} » figure dans {$n} commande(s). Il reste dans les supprimés pour garder l'historique.",
            ], 409);
        }

        $product->forceDelete();   // variantes, galerie, avis et favoris partent avec (clés étrangères en cascade)

        return response()->json(['message' => "Produit « {$product->nom} » supprimé définitivement."]);
    }

    public function store(ProductRequest $request, ImageUploader $uploader): JsonResponse
    {
        $product = DB::transaction(function () use ($request, $uploader) {
            $product = Product::create($this->fields($request) + ['image' => $uploader->store($request->file('image'), $request->input('nom'))]);
            $this->syncExtras($product, $request, $uploader);

            return $product;
        });

        return response()->json([
            'message' => "Produit « {$product->nom} » ajouté au catalogue.",
            'product' => new ProductResource($product->fresh(['variants', 'images'])),
        ], 201);
    }

    public function update(ProductRequest $request, Product $product, ImageUploader $uploader): JsonResponse
    {
        DB::transaction(function () use ($request, $product, $uploader) {
            $data = $this->fields($request);
            if ($img = $uploader->store($request->file('image'), $request->input('nom'))) {
                $data['image'] = $img;
            }
            $product->update($data);
            $this->syncExtras($product, $request, $uploader);
        });

        return response()->json([
            'message' => "Produit « {$product->nom} » mis à jour.",
            'product' => new ProductResource($product->fresh(['variants', 'images'])),
        ]);
    }

    private function fields(ProductRequest $request): array
    {
        return [
            'nom'            => $request->input('nom'),
            'categorie'      => $request->input('categorie'),
            'sous_categorie' => $request->input('sous_categorie'),
            'marque'         => $request->input('marque'),
            'tranche_age'    => $request->input('tranche_age'),
            'details'        => $request->input('details'),
            'prix'           => round((float) $request->input('prix'), 2),
            'quantite_stock' => (int) $request->input('stock'),
            'promotion'      => (int) $request->input('promotion'),
        ];
    }

    /** Galerie + variantes. Les variantes gardées conservent leur id : les commandes passées restent liées. */
    private function syncExtras(Product $product, ProductRequest $request, ImageUploader $uploader): void
    {
        $product->images()->whereIn('id', $request->input('remove_images', []))->delete();
        $new = $request->file('gallery', []);
        if ($product->images()->count() + count($new) > ProductRequest::MAX_GALLERY) {
            throw ValidationException::withMessages(['gallery' => 'Galerie limitée à '.ProductRequest::MAX_GALLERY.' images.']);
        }
        $order = (int) $product->images()->max('ordre_affichage');
        foreach ($new as $file) {
            $product->images()->create(['chemin_image' => $uploader->store($file, $product->nom), 'ordre_affichage' => ++$order]);
        }

        $rows = $request->input('variants', []);
        $kept = array_filter(array_map(fn ($r) => (int) ($r['id'] ?? 0), $rows));
        $product->variants()->whereNotIn('id', $kept ?: [0])->delete();
        foreach ($rows as $r) {
            $values = [
                'couleur'         => $r['couleur'] ?? null,
                'taille'          => $r['taille'] ?? null,
                'volume_ml'       => $r['volume_ml'] ?? null,
                'poids_g'         => $r['poids_g'] ?? null,
                'quantite_pieces' => $r['quantite_pieces'] ?? null,
                'quantite_stock'  => (int) $r['stock'],
            ];
            $existing = ! empty($r['id']) ? $product->variants()->find((int) $r['id']) : null;   // jamais la variante d'un autre produit
            $existing ? $existing->update($values) : $product->variants()->create($values);
        }
        $product->syncVariantStock();
    }
}
