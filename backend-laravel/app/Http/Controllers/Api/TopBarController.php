<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PromoResource;
use App\Http\Resources\UspResource;
use App\Models\HeaderSetting;
use App\Models\PromoAnnouncement;
use App\Models\ServiceLink;
use App\Models\Usp;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class TopBarController extends Controller
{
    private const ICONS = ['truck', 'check', 'mail', 'gift', 'star', 'shield'];
    private const LINK = '/^(\/|https?:\/\/)/';   // chemin interne ou http(s) : refuse javascript:
    private const COLOR = '/^#[0-9A-Fa-f]{6}$/';

    public function index(): JsonResponse
    {
        $promo = PromoAnnouncement::where('est_actif', true)
            ->where(fn ($q) => $q->whereNull('date_debut')->orWhere('date_debut', '<=', now()))
            ->where(fn ($q) => $q->whereNull('date_fin')->orWhere('date_fin', '>=', now()))
            ->latest('id')
            ->first();

        return response()->json([
            'usps'  => UspResource::collection(Usp::where('est_actif', true)->orderBy('ordre_affichage')->orderBy('id')->get())->resolve(),
            'promo' => $promo ? (new PromoResource($promo))->resolve() : null,
            'brand' => HeaderSetting::where('est_actif', true)->first()?->toApi(),
        ]);
    }

    public function serviceLinks(): JsonResponse
    {
        return response()->json((ServiceLink::first() ?? new ServiceLink())->toApi());
    }

    public function serviceLinksUpdate(Request $request): JsonResponse
    {
        $url  = ['nullable', 'string', 'max:255', 'url', 'regex:/^https?:\/\//'];
        $data = $request->validate([
            'whatsapp' => $url,
            'facebook' => $url,
            'instagram' => $url,
            'twitter'  => $url,
            'gmail'    => ['nullable', 'email', 'max:150'],
        ], [
            'whatsapp.*' => 'Lien WhatsApp invalide (exemple : https://wa.me/212612345678).',
            'facebook.*' => 'Lien Facebook invalide : commencez par https://.',
            'instagram.*' => 'Lien Instagram invalide : commencez par https://.',
            'twitter.*'  => 'Lien X invalide : commencez par https://.',
            'gmail.*'    => 'Adresse e-mail invalide.',
        ]);

        $links = ServiceLink::first() ?? new ServiceLink();
        $links->fill($data)->save();

        return response()->json(['message' => 'Liens Service mis à jour.', 'links' => $links->toApi()]);
    }

    public function headerUpdate(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nom_marque'    => ['required', 'string', 'max:150'],
            'couleur_fond'  => ['required', 'string', 'regex:'.self::COLOR],
            'couleur_texte' => ['required', 'string', 'regex:'.self::COLOR],
            'est_actif'     => ['required', 'boolean'],
        ], $this->messages() + ['nom_marque.*' => 'Le nom de la marque est obligatoire (150 caractères max).']);

        $header = HeaderSetting::first() ?? new HeaderSetting();
        $header->fill($data)->save();

        return response()->json(['message' => 'Barre de marque mise à jour.', 'header' => $header->toApi()]);
    }

    public function adminIndex(): JsonResponse
    {
        return response()->json([
            'usps'   => UspResource::collection(Usp::orderBy('ordre_affichage')->orderBy('id')->get())->resolve(),
            'promos' => PromoResource::collection(PromoAnnouncement::orderByDesc('id')->get())->resolve(),
            'header' => (HeaderSetting::first() ?? new HeaderSetting(['nom_marque' => 'QUEEN-Cosmetics', 'couleur_fond' => '#000000', 'couleur_texte' => '#D4AF37', 'est_actif' => true]))->toApi(),
        ]);
    }

    public function uspStore(Request $request): JsonResponse
    {
        $usp = Usp::create($this->uspData($request));

        return response()->json(['message' => "Avantage « {$usp->texte} » ajouté.", 'usp' => (new UspResource($usp))->resolve()], 201);
    }

    public function uspUpdate(Request $request, Usp $usp): JsonResponse
    {
        $usp->update($this->uspData($request));

        return response()->json(['message' => "Avantage « {$usp->texte} » mis à jour.", 'usp' => (new UspResource($usp))->resolve()]);
    }

    public function uspDestroy(Usp $usp): JsonResponse
    {
        $usp->delete();

        return response()->json(['message' => "Avantage « {$usp->texte} » supprimé."]);
    }

    public function promoStore(Request $request): JsonResponse
    {
        $promo = PromoAnnouncement::create($this->promoData($request));

        return response()->json(['message' => 'Annonce promo ajoutée.', 'promo' => (new PromoResource($promo))->resolve()], 201);
    }

    public function promoUpdate(Request $request, PromoAnnouncement $promo): JsonResponse
    {
        $promo->update($this->promoData($request));

        return response()->json(['message' => 'Annonce promo mise à jour.', 'promo' => (new PromoResource($promo))->resolve()]);
    }

    public function promoDestroy(PromoAnnouncement $promo): JsonResponse
    {
        $promo->delete();

        return response()->json(['message' => 'Annonce promo supprimée.']);
    }

    private function uspData(Request $request): array
    {
        $data = $request->validate([
            'icone'           => ['nullable', 'string', Rule::in(self::ICONS)],
            'texte'           => ['required', 'string', 'max:255'],
            'lien'            => ['nullable', 'string', 'max:255', 'regex:'.self::LINK],
            'ordre_affichage' => ['nullable', 'integer', 'min:0', 'max:999'],
            'est_actif'       => ['required', 'boolean'],
        ], $this->messages());
        $data['ordre_affichage'] = (int) ($data['ordre_affichage'] ?? 0);

        return $data;
    }

    private function promoData(Request $request): array
    {
        $data = $request->validate([
            'texte'         => ['required', 'string', 'max:255'],
            'lien'          => ['nullable', 'string', 'max:255', 'regex:'.self::LINK],
            'couleur_fond'  => ['required', 'string', 'regex:'.self::COLOR],
            'couleur_texte' => ['required', 'string', 'regex:'.self::COLOR],
            'date_debut'    => ['nullable', 'date'],
            'date_fin'      => ['nullable', 'date'],
            'est_actif'     => ['required', 'boolean'],
        ], $this->messages());

        // Les dates arrivent en ISO (avec fuseau) : on les range dans le fuseau de l'application
        foreach (['date_debut', 'date_fin'] as $k) {
            $data[$k] = isset($data[$k]) ? Carbon::parse($data[$k])->setTimezone(config('app.timezone')) : null;
        }
        if ($data['date_debut'] && $data['date_fin'] && $data['date_fin']->lte($data['date_debut'])) {
            throw ValidationException::withMessages(['date_fin' => 'La date de fin doit être après la date de début.']);
        }

        return $data;
    }

    private function messages(): array
    {
        return [
            'texte.*'         => 'Le texte est obligatoire (255 caractères max).',
            'icone.*'         => 'Icône inconnue.',
            'lien.*'          => 'Lien invalide : commencez par / (page du site) ou https://.',
            'couleur_*.*'     => 'Couleur invalide (exemple : #725A65).',
            'date_debut.*'    => 'Date de début invalide.',
            'date_fin.*'      => 'Date de fin invalide.',
            'ordre_affichage.*' => "L'ordre doit être un entier entre 0 et 999.",
        ];
    }
}
