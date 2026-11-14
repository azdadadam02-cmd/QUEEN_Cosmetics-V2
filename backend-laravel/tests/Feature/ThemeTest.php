<?php

namespace Tests\Feature;

use App\Models\ThemeSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class ThemeTest extends TestCase
{
    use RefreshDatabase;

    public function test_anyone_reads_the_original_theme_until_the_admin_changes_it(): void
    {
        $this->getJson('/api/theme')->assertOk()->assertExactJson(ThemeSetting::payload());
    }

    public function test_the_admin_changes_some_settings_and_the_others_keep_their_value(): void
    {
        Sanctum::actingAs($this->user('admin'));

        $this->putJson('/api/admin/theme', ['footer_bg' => '#223344', 'card_radius' => 16, 'card_border' => false, 'font_heading' => 'playfair-display'])
            ->assertOk();
        $this->putJson('/api/admin/theme', ['accent' => '#b5736a'])->assertOk();

        $theme = $this->getJson('/api/theme')->assertOk()->json();
        $this->assertSame('#223344', $theme['footer_bg']);
        $this->assertSame(16, $theme['card_radius']);
        $this->assertFalse($theme['card_border']);
        $this->assertSame('playfair-display', $theme['font_heading']);
        $this->assertSame('#b5736a', $theme['accent']);
        $this->assertSame(ThemeSetting::DEFAULTS['nav_bg'], $theme['nav_bg']);
    }

    public static function badValues(): array
    {
        return [
            'css injection in a colour' => ['accent', 'red;background:url(//evil.com)'],
            'closing the style tag'     => ['nav_bg', '#fff</style><script>alert(1)</script>'],
            'short hex'                 => ['footer_bg', '#fff'],
            'colour name'               => ['page_bg', 'red'],
            'unknown font'              => ['font_body', 'Comic Sans; } body{display:none'],
            'font from outside'         => ['font_heading', 'https://evil.com/x.css'],
            'radius too big'            => ['card_radius', 500],
            'negative radius'           => ['card_radius', -1],
            'radius as text'            => ['card_radius', '8px; x'],
            'unknown shadow'            => ['card_shadow', '0 0 0 100vmax red'],
            'price colour name'         => ['price_color', 'red'],
            'badge with url()'          => ['badge_promo', 'url(//evil.com)'],
            'unknown button style'      => ['button_style', '999px;x'],
            'free width'                => ['site_width', '100vw'],
            'free banner height'        => ['banner_height', '0'],
        ];
    }

    #[DataProvider('badValues')]
    public function test_dangerous_or_invalid_values_are_refused_and_nothing_is_saved(string $key, mixed $value): void
    {
        Sanctum::actingAs($this->user('admin'));

        $this->putJson('/api/admin/theme', [$key => $value])->assertStatus(422)->assertJsonValidationErrors($key);
        $this->getJson('/api/theme')->assertExactJson(ThemeSetting::payload());
    }

    public function test_numbers_and_booleans_sent_as_text_are_stored_with_their_real_type(): void
    {
        Sanctum::actingAs($this->user('admin'));

        $this->putJson('/api/admin/theme', ['card_radius' => '16', 'card_border' => '0'])->assertOk();

        $theme = $this->getJson('/api/theme')->json();
        $this->assertSame(16, $theme['card_radius']);
        $this->assertFalse($theme['card_border']);
    }

    public function test_buttons_prices_badges_width_and_banner_settings(): void
    {
        Sanctum::actingAs($this->user('admin'));

        $this->putJson('/api/admin/theme', ['button_style' => 'pill', 'price_color' => '#aa3366', 'badge_promo' => '#112233', 'badge_out' => '#445566', 'site_width' => 'wide', 'banner_height' => 'tall'])->assertOk();
        $theme = $this->getJson('/api/theme')->json();
        $this->assertSame(['pill', '#aa3366', '#112233', '#445566', 'wide', 'tall'], [$theme['button_style'], $theme['price_color'], $theme['badge_promo'], $theme['badge_out'], $theme['site_width'], $theme['banner_height']]);

        $this->putJson('/api/admin/theme', ['price_color' => null])->assertOk();
        $this->assertNull($this->getJson('/api/theme')->json('price_color'), 'null puts the original colour back');
    }

    public function test_unknown_keys_are_never_stored(): void
    {
        Sanctum::actingAs($this->user('admin'));

        $this->putJson('/api/admin/theme', ['accent' => '#112233', 'custom_css' => 'body{display:none}'])->assertOk();

        $this->assertArrayNotHasKey('custom_css', $this->getJson('/api/theme')->json());
        $this->assertArrayNotHasKey('custom_css', ThemeSetting::first()->valeurs);
    }

    public function test_only_the_admin_can_change_the_theme(): void
    {
        foreach (['client', 'responsable_produits', 'responsable_commandes'] as $role) {
            Sanctum::actingAs($this->user($role));
            $this->putJson('/api/admin/theme', ['accent' => '#112233'])->assertForbidden();
            $this->deleteJson('/api/admin/theme')->assertForbidden();
        }
        $this->app['auth']->forgetGuards();
        $this->putJson('/api/admin/theme', ['accent' => '#112233'])->assertUnauthorized();
        $this->getJson('/api/theme')->assertExactJson(ThemeSetting::payload());
    }

    public function test_reset_brings_back_the_original_site(): void
    {
        Sanctum::actingAs($this->user('admin'));
        $this->putJson('/api/admin/theme', ['footer_bg' => '#223344'])->assertOk();

        $this->deleteJson('/api/admin/theme')->assertOk()->assertJsonPath('theme.footer_bg', ThemeSetting::DEFAULTS['footer_bg']);
        $this->getJson('/api/theme')->assertExactJson(ThemeSetting::payload());
    }

    public function test_the_admin_changes_and_removes_the_logo_and_the_theme_update_never_touches_it(): void
    {
        Sanctum::actingAs($this->user('admin'));
        $this->getJson('/api/theme')->assertJsonPath('logo_url', null)->assertJsonMissingPath('logo');

        $url = $this->postJson('/api/admin/theme/logo', ['logo' => $this->png('mon logo.png')])
            ->assertOk()->json('theme.logo_url');
        $file = public_path('images/'.basename($url));
        $this->assertFileExists($file);

        $this->putJson('/api/admin/theme', ['accent' => '#112233', 'logo' => 'evil.php', 'logo_url' => 'http://evil'])->assertOk();
        $this->getJson('/api/theme')->assertJsonPath('logo_url', $url);

        $this->deleteJson('/api/admin/theme/logo')->assertOk()->assertJsonPath('theme.logo_url', null);
        @unlink($file);
    }

    public function test_the_logo_must_be_a_real_small_image_and_only_the_admin_can_send_it(): void
    {
        Sanctum::actingAs($this->user('admin'));
        foreach ([UploadedFile::fake()->create('x.php', 1, 'application/x-php'), UploadedFile::fake()->create('x.svg', 1, 'image/svg+xml'), $this->png('big.png', 3 * 1024 * 1024)] as $bad) {
            $this->postJson('/api/admin/theme/logo', ['logo' => $bad])->assertStatus(422)->assertJsonValidationErrors('logo');
        }

        Sanctum::actingAs($this->user('client'));
        $this->postJson('/api/admin/theme/logo', ['logo' => $this->png('a.png')])->assertForbidden();
        $this->deleteJson('/api/admin/theme/logo')->assertForbidden();
    }

    /** Vrai PNG de 1 px (GD n'est pas installé : UploadedFile::fake()->image() est impossible), complété pour atteindre $bytes */
    private function png(string $name, int $bytes = 0): UploadedFile
    {
        $png = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');

        return UploadedFile::fake()->createWithContent($name, $png.str_repeat("\0", max(0, $bytes - strlen($png))));
    }
}
