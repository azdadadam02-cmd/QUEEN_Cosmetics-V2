<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Favorite;
use App\Models\Order;
use App\Models\Review;
use App\Models\User;
use App\Services\ImageUploader;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        return response()->json($this->payload($request->user()));
    }

    public function update(Request $request): JsonResponse
    {
        $request->merge([
            'nom'       => trim((string) $request->input('nom')),
            'telephone' => preg_replace('/[\s.\-]/', '', (string) $request->input('telephone')),
            'adresse'   => trim((string) $request->input('adresse')),
        ]);
        $data = $request->validate([
            'nom'            => ['required', 'string', 'min:3', 'max:100'],
            'telephone'      => ['nullable', 'regex:/^(\+212|00212|0)[5-7]\d{8}$/'],
            'adresse'        => ['nullable', 'string', 'max:255'],
            'date_naissance' => ['nullable', 'date', 'before:today', 'after:1900-01-01'],
        ], [
            'nom.*'            => 'Le nom est obligatoire (3 à 100 caractères).',
            'telephone.*'      => 'Numéro de téléphone invalide (ex : 06 12 34 56 78).',
            'adresse.*'        => "L'adresse ne doit pas dépasser 255 caractères.",
            'date_naissance.*' => 'Date de naissance invalide.',
        ]);

        $user = $request->user();
        DB::transaction(function () use ($user, $data) {
            $user->update(['nom' => $data['nom'], 'date_naissance' => $data['date_naissance'] ?? null]);

            $phone   = $data['telephone'] ?? '';
            $address = $data['adresse'] ?? '';
            $key     = ['utilisateur_id' => $user->id, 'est_principale' => true];
            if ($phone === '' && $address === '') {
                Address::where($key)->delete();
            } else {
                // ville est NOT NULL mais absente de ce formulaire : la commande la redemande à la livraison
                $existing = Address::where($key)->first();
                Address::updateOrCreate($key, ['telephone' => $phone, 'adresse_complete' => $address, 'ville' => $existing?->ville ?? '']);
            }
        });

        return response()->json(['message' => 'Vos informations sont enregistrées.', 'profile' => $this->payload($user->fresh())]);
    }

    public function updateImage(Request $request, ImageUploader $uploader): JsonResponse
    {
        $request->validate(
            ['image' => ['required', 'file', 'mimetypes:image/jpeg,image/png,image/webp,image/gif', 'max:3072', 'dimensions:max_width=6000,max_height=6000']],
            ['image.mimetypes' => "Format d'image non accepté (JPG, PNG, WEBP ou GIF).", 'image.max' => "L'image ne doit pas dépasser 3 Mo.", 'image.*' => 'Image invalide.']
        );

        $user = $request->user();
        $this->deleteImage($user);
        $user->update(['image' => $uploader->store($request->file('image'), 'avatar')]);

        return response()->json(['message' => 'Photo de profil mise à jour.', 'profile' => $this->payload($user->fresh())]);
    }

    public function destroyImage(Request $request): JsonResponse
    {
        $user = $request->user();
        $this->deleteImage($user);
        $user->update(['image' => null]);

        return response()->json(['message' => 'Photo de profil supprimée.', 'profile' => $this->payload($user->fresh())]);
    }

    /**
     * DELETE /api/profile : suppression définitive.
     * Avec un historique de commandes, le compte est anonymisé : les commandes restent pour la comptabilité.
     */
    public function destroy(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->orders()->whereIn('statut', [Order::EN_ATTENTE, Order::ACCEPTEE])->exists()) {
            return response()->json(['message' => 'Suppression impossible : vous avez une commande en cours. Attendez sa livraison.'], 422);
        }

        DB::transaction(function () use ($user) {
            Review::where('utilisateur_id', $user->id)->delete();
            Favorite::where('utilisateur_id', $user->id)->delete();
            Address::where('utilisateur_id', $user->id)->delete();
            DB::table('reclamations')->where('utilisateur_id', $user->id)->update(['utilisateur_id' => null]);
            $user->tokens()->delete();
            $this->deleteImage($user);

            if ($user->orders()->exists()) {
                $user->update([
                    'nom'            => 'Compte supprimé',
                    'email'          => "supprime-{$user->id}@compte-supprime.invalid",
                    'mot_de_passe'   => Str::random(64),
                    'date_naissance' => null,
                    'image'          => null,
                ]);
            } else {
                $user->delete();
            }
        });

        return response()->json(['message' => 'Votre compte a été supprimé.']);
    }

    private function payload(User $user): array
    {
        $address = Address::where('utilisateur_id', $user->id)->where('est_principale', true)->first();

        return [
            'name'       => $user->nom,
            'email'      => $user->email,
            'phone'      => $address?->telephone ?: '',
            'address'    => $address?->adresse_complete ?: '',
            'birth_date' => $user->date_naissance?->format('Y-m-d') ?? '',
            'image_url'  => $user->image ? asset('images/'.$user->image) : null,
        ];
    }

    private function deleteImage(User $user): void
    {
        $path = $user->image ? public_path('images/'.basename($user->image)) : null;
        if ($path && is_file($path)) {
            unlink($path);
        }
    }
}
