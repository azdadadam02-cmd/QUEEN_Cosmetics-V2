<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PackRequest;
use App\Http\Resources\PackResource;
use App\Models\Pack;
use App\Services\ImageUploader;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class PackController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return PackResource::collection(Pack::withDetails()->where('est_actif', true)->orderByDesc('id')->get());
    }

    public function show(int $pack): PackResource
    {
        return new PackResource(Pack::withDetails()->where('est_actif', true)->findOrFail($pack));
    }

    public function manageIndex(): AnonymousResourceCollection
    {
        return PackResource::collection(Pack::withDetails()->orderByDesc('id')->get());
    }

    public function store(PackRequest $request, ImageUploader $uploader): JsonResponse
    {
        $pack = DB::transaction(function () use ($request, $uploader) {
            $pack = Pack::create($this->fields($request) + ['image' => $uploader->store($request->file('image'), $request->input('nom'))]);
            $pack->products()->sync($this->productLinks($request));

            return $pack;
        });

        return response()->json(['message' => "Pack « {$pack->nom} » créé.", 'id' => $pack->id], 201);
    }

    public function update(PackRequest $request, Pack $pack, ImageUploader $uploader): JsonResponse
    {
        DB::transaction(function () use ($request, $pack, $uploader) {
            $data = $this->fields($request);
            if ($img = $uploader->store($request->file('image'), $request->input('nom'))) {
                $data['image'] = $img;
            }
            $pack->update($data);
            $pack->products()->sync($this->productLinks($request));
        });

        return response()->json(['message' => "Pack « {$pack->nom} » mis à jour."]);
    }

    public function destroy(Pack $pack): JsonResponse
    {
        $pack->delete();

        return response()->json(['message' => "Pack « {$pack->nom} » supprimé."]);
    }

    private function fields(PackRequest $request): array
    {
        return [
            'nom'           => $request->input('nom'),
            'description'   => $request->input('description'),
            'prix_promo'    => round((float) $request->input('prix_promo'), 2),
            'couleur_fond'  => $request->input('couleur_fond'),
            'couleur_texte' => $request->input('couleur_texte'),
            'texte_bouton'  => $request->input('texte_bouton'),
            'est_actif'     => $request->boolean('est_actif'),
        ];
    }

    private function productLinks(PackRequest $request): array
    {
        return collect($request->input('products'))->mapWithKeys(fn ($r) => [(int) $r['id'] => ['quantite' => (int) $r['quantite']]])->all();
    }
}
