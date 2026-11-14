<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdvertisementRequest;
use App\Http\Resources\AdvertisementResource;
use App\Models\Advertisement;
use App\Services\ImageUploader;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdvertisementController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return AdvertisementResource::collection(Advertisement::with('product')->orderByDesc('id')->get());
    }

    public function store(AdvertisementRequest $request, ImageUploader $uploader): JsonResponse
    {
        $ad = Advertisement::create([
            'titre'      => $request->input('titre'),
            'reduction'  => (int) $request->input('reduction'),
            'produit_id' => $request->input('produit_id'),
            'image'      => $uploader->store($request->file('image'), $request->input('titre')),
        ]);

        return response()->json([
            'message'       => "Publicité « {$ad->titre} » ajoutée : elle défile déjà sur l'accueil.",
            'advertisement' => new AdvertisementResource($ad->load('product')),
        ], 201);
    }

    public function update(AdvertisementRequest $request, Advertisement $advertisement, ImageUploader $uploader): JsonResponse
    {
        $data = [
            'titre'      => $request->input('titre'),
            'reduction'  => (int) $request->input('reduction'),
            'produit_id' => $request->input('produit_id'),
        ];
        if ($img = $uploader->store($request->file('image'), $request->input('titre'))) {
            $data['image'] = $img;
        }
        $advertisement->update($data);

        return response()->json([
            'message'       => "Publicité « {$advertisement->titre} » mise à jour.",
            'advertisement' => new AdvertisementResource($advertisement->fresh('product')),
        ]);
    }

    public function destroy(Advertisement $advertisement): JsonResponse
    {
        $titre = $advertisement->titre;
        $advertisement->delete();

        return response()->json(['message' => "Publicité « {$titre} » supprimée."]);
    }
}
