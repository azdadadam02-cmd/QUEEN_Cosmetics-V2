<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ThemeSetting;
use App\Services\ImageUploader;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/** Apparence du site : lecture publique, modification par l'admin. Seules des valeurs fermées sont acceptées (couleur hex, police de la liste…) : rien n'entre dans le CSS sans être vérifié. */
class ThemeController extends Controller
{
    /** GET /api/theme */
    public function show(): JsonResponse
    {
        return response()->json(ThemeSetting::payload());
    }

    /** PUT /api/admin/theme : les clés envoyées sont remplacées, les autres gardent leur valeur */
    public function update(Request $request): JsonResponse
    {
        $color = ['sometimes', 'required', 'regex:/^#[0-9A-Fa-f]{6}$/'];
        $data = $request->validate([
            'nav_bg'         => $color,
            'nav_text'       => $color,
            'footer_bg'      => $color,
            'footer_text'    => $color,
            'page_bg'        => $color,
            'accent'         => $color,
            'card_bg'        => $color,
            'badge_promo'    => $color,
            'badge_out'      => $color,
            'price_color'    => ['sometimes', 'nullable', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'button_style'   => ['sometimes', 'required', Rule::in(ThemeSetting::BUTTON_STYLES)],
            'site_width'     => ['sometimes', 'required', Rule::in(ThemeSetting::WIDTHS)],
            'banner_height'  => ['sometimes', 'required', Rule::in(ThemeSetting::BANNER_HEIGHTS)],
            'font_heading'   => ['sometimes', 'required', Rule::in(ThemeSetting::FONTS)],
            'font_body'      => ['sometimes', 'required', Rule::in(ThemeSetting::FONTS)],
            'card_radius'    => ['sometimes', 'required', 'integer', 'between:0,24'],
            'card_shadow'    => ['sometimes', 'required', Rule::in(ThemeSetting::SHADOWS)],
            'card_border'    => ['sometimes', 'required', 'boolean'],
        ], [
            '*.regex'   => 'Couleur invalide : utilisez le format #RRGGBB.',
            '*.in'      => 'Choix invalide.',
            '*.between' => 'Valeur hors limites.',
            '*.*'       => 'Valeur invalide.',
        ]);

        // Stockés avec leur vrai type : « "16" » ou « "1" » en JSON seraient refusés par le frontend
        foreach (['card_radius' => 'intval', 'card_border' => 'boolval'] as $key => $cast) {
            if (array_key_exists($key, $data)) {
                $data[$key] = $cast($data[$key]);
            }
        }

        $row = ThemeSetting::first() ?? new ThemeSetting();
        $row->valeurs = array_replace(ThemeSetting::current(), $data);
        $row->save();

        return response()->json(['message' => 'Apparence enregistrée.', 'theme' => ThemeSetting::payload()]);
    }

    /** DELETE /api/admin/theme : retour au site d'origine */
    public function reset(): JsonResponse
    {
        ThemeSetting::query()->delete();

        return response()->json(['message' => "Apparence d'origine rétablie.", 'theme' => ThemeSetting::payload()]);
    }

    /** POST /api/admin/theme/logo */
    public function logoStore(Request $request, ImageUploader $uploader): JsonResponse
    {
        $request->validate(
            ['logo' => ['required', 'file', 'mimetypes:image/jpeg,image/png,image/webp', 'max:2048', 'dimensions:max_width=4000,max_height=4000']],
            ['logo.*' => 'Logo invalide : JPG, PNG ou WEBP, 2 Mo et 4000 px maximum.'],
        );

        return $this->saveLogo($uploader->store($request->file('logo'), 'logo'), 'Logo enregistré.');
    }

    /** DELETE /api/admin/theme/logo : retour au logo d'origine */
    public function logoDestroy(): JsonResponse
    {
        return $this->saveLogo(null, "Logo d'origine rétabli.");
    }

    private function saveLogo(?string $file, string $message): JsonResponse
    {
        $row = ThemeSetting::first() ?? new ThemeSetting();
        $row->valeurs = array_replace(ThemeSetting::current(), ['logo' => $file]);
        $row->save();

        return response()->json(['message' => $message, 'theme' => ThemeSetting::payload()]);
    }
}
