<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Apparence du site (table « parametres_theme », une seule ligne) */
class ThemeSetting extends Model
{
    protected $table = 'parametres_theme';
    public $timestamps = false;

    protected $fillable = ['valeurs'];

    /** Clés des polices proposées : les mêmes que FONTS dans frontend-nextjs/src/lib/theme.js */
    public const FONTS = ['lora', 'playfair-display', 'cormorant-garamond', 'poppins', 'montserrat', 'inter', 'raleway', 'dm-sans'];
    public const SHADOWS = ['none', 'soft', 'strong'];
    public const BUTTON_STYLES = ['round', 'square', 'pill'];
    public const WIDTHS = ['narrow', 'normal', 'wide'];
    public const BANNER_HEIGHTS = ['compact', 'normal', 'tall'];

    /** Le site d'origine : tant que l'admin n'a rien changé, rien ne change */
    public const DEFAULTS = [
        'nav_bg'         => '#ffffff',
        'nav_text'       => '#5a4150',
        'footer_bg'      => '#000000',
        'footer_text'    => '#ffffff',
        'page_bg'        => '#f9f3f2',
        'accent'         => '#735a65',
        'font_heading'   => 'lora',
        'font_body'      => 'lora',
        'card_bg'        => '#ffffff',
        'card_radius'    => 6,
        'card_shadow'    => 'none',
        'card_border'    => true,
        // null = couleur d'origine (le prix n'a pas la même couleur sur la carte et sur la fiche produit)
        'price_color'    => null,
        'badge_promo'    => '#d3261c',
        'badge_out'      => '#e8261c',
        'button_style'   => 'round',
        'site_width'     => 'normal',
        'banner_height'  => 'normal',
        'logo'           => null,   // nom du fichier dans public/images ; null = logo d'origine
    ];

    protected function casts(): array
    {
        return ['valeurs' => 'array'];
    }

    /** Réglages enregistrés par-dessus les valeurs d'origine ; une clé inconnue en base est ignorée */
    public static function current(): array
    {
        $saved = array_intersect_key(static::first()?->valeurs ?? [], self::DEFAULTS);

        return array_replace(self::DEFAULTS, $saved);
    }

    /** Ce que l'API renvoie : le nom du fichier du logo devient une URL (null = logo d'origine) */
    public static function payload(): array
    {
        $theme = self::current();
        $theme['logo_url'] = $theme['logo'] ? asset('images/'.$theme['logo']) : null;
        unset($theme['logo']);

        return $theme;
    }
}
