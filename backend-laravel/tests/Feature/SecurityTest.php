<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class SecurityTest extends TestCase
{
    use RefreshDatabase;

    private function tryLogin(string $email, string $password, string $ip = '10.0.0.1')
    {
        return $this->withServerVariables(['REMOTE_ADDR' => $ip])
            ->postJson('/api/auth/login', ['email' => $email, 'password' => $password]);
    }

    public function test_account_is_locked_5_minutes_after_5_failures_even_from_another_ip(): void
    {
        $user = $this->user();

        foreach (['10.0.0.1', '10.0.0.2', '10.0.0.3', '10.0.0.4', '10.0.0.5'] as $ip) {
            $this->tryLogin($user->email, 'Mauvais123', $ip)->assertStatus(422);
        }

        $blocked = $this->tryLogin($user->email, self::PASSWORD, '10.9.9.9')->assertStatus(429);
        $this->assertStringContainsString('5 minute', $blocked->json('message'));
        $this->tryLogin(strtoupper($user->email), self::PASSWORD, '10.9.9.9')->assertStatus(429);

        $this->travel(4)->minutes();
        $this->tryLogin($user->email, self::PASSWORD)->assertStatus(429);

        $this->travel(61)->seconds();
        $this->tryLogin($user->email, self::PASSWORD)->assertOk();
    }

    public function test_a_successful_login_resets_the_failure_counter(): void
    {
        $user = $this->user();
        for ($i = 0; $i < 4; $i++) {
            $this->tryLogin($user->email, 'Mauvais123')->assertStatus(422);
        }
        $this->tryLogin($user->email, self::PASSWORD)->assertOk();

        for ($i = 0; $i < 4; $i++) {
            $this->tryLogin($user->email, 'Mauvais123')->assertStatus(422);
        }
        $this->tryLogin($user->email, self::PASSWORD)->assertOk();
    }

    public static function badLinks(): array
    {
        return [
            'javascript' => ['javascript:alert(1)'],
            'mixed case' => ['JaVaScRiPt:alert(1)'],
            'protocol-relative' => ['//evil.com'],
            'backslash trick' => ['/\\evil.com'],
            'data url' => ['data:text/html,<script>alert(1)</script>'],
        ];
    }

    #[DataProvider('badLinks')]
    public function test_top_bar_links_cannot_point_outside_safely(string $link): void
    {
        Sanctum::actingAs($this->user('admin'));

        $this->postJson('/api/admin/usps', ['texte' => 'Avantage', 'lien' => $link, 'est_actif' => true])
            ->assertStatus(422)->assertJsonValidationErrors('lien');
    }

    public function test_top_bar_accepts_internal_and_https_links(): void
    {
        Sanctum::actingAs($this->user('admin'));

        $this->postJson('/api/admin/usps', ['texte' => 'Interne', 'lien' => '/products?cat=Soins', 'est_actif' => true])->assertCreated();
        $this->postJson('/api/admin/usps', ['texte' => 'Externe', 'lien' => 'https://wa.me/212600000000', 'est_actif' => true])->assertCreated();
    }

    public function test_service_links_refuse_javascript_urls(): void
    {
        Sanctum::actingAs($this->user('admin'));

        $this->putJson('/api/admin/service-links', ['whatsapp' => 'javascript:alert(1)'])
            ->assertStatus(422)->assertJsonValidationErrors('whatsapp');
    }

    public function test_colours_cannot_carry_css_injection(): void
    {
        Sanctum::actingAs($this->user('admin'));

        $this->postJson('/api/admin/promos', ['texte' => 'Promo', 'couleur_fond' => 'red;background:url(//evil)', 'couleur_texte' => '#FFFFFF'])
            ->assertStatus(422)->assertJsonValidationErrors('couleur_fond');
    }

    public function test_a_php_file_disguised_as_an_image_is_rejected(): void
    {
        Sanctum::actingAs($this->user('client'));

        foreach ([
            UploadedFile::fake()->createWithContent('shell.jpg', '<?php system($_GET["c"]); ?>'),
            UploadedFile::fake()->createWithContent('x.svg', '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"/>'),
        ] as $file) {
            $this->post('/api/profile/image', ['image' => $file], ['Accept' => 'application/json'])
                ->assertStatus(422)->assertJsonValidationErrors('image');
        }
    }

    public function test_a_client_cannot_promote_themselves(): void
    {
        $client = $this->user('client');
        Sanctum::actingAs($client);

        $this->putJson('/api/profile', ['nom' => 'Pirate', 'role' => 'admin', 'email' => 'pirate@x.ma']);

        $client->refresh();
        $this->assertSame('client', $client->role);
        $this->assertNotSame('pirate@x.ma', $client->email);
    }

    public function test_reports_are_rate_limited(): void
    {
        Sanctum::actingAs($this->user('client'));

        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/reports', ['sujet' => 'Sujet '.$i, 'message' => 'Un message assez long pour passer.'])->assertSuccessful();
        }
        $this->postJson('/api/reports', ['sujet' => 'Encore', 'message' => 'Un message assez long pour passer.'])->assertStatus(429);
    }

    public function test_deleting_the_account_requires_the_password(): void
    {
        $client = $this->user('client');
        Sanctum::actingAs($client);

        $this->deleteJson('/api/profile')->assertStatus(422)->assertJsonValidationErrors('password');
        $this->deleteJson('/api/profile', ['password' => 'Mauvais123'])->assertStatus(422)->assertJsonValidationErrors('password');
        $this->assertModelExists($client);

        $this->deleteJson('/api/profile', ['password' => self::PASSWORD])->assertOk();
        $this->assertModelMissing($client);
    }

    public function test_account_deletion_cannot_be_used_to_guess_the_password(): void
    {
        $client = $this->user('client');
        Sanctum::actingAs($client);

        for ($i = 0; $i < 5; $i++) {
            $this->deleteJson('/api/profile', ['password' => 'Mauvais'.$i])->assertStatus(422);
        }
        $blocked = $this->deleteJson('/api/profile', ['password' => self::PASSWORD])->assertStatus(429);
        $this->assertStringContainsString('5 minute', $blocked->json('message'));
        $this->assertModelExists($client);

        $this->travel(301)->seconds();
        $this->deleteJson('/api/profile', ['password' => self::PASSWORD])->assertOk();
    }

    public function test_the_api_does_not_reveal_the_php_version(): void
    {
        $this->getJson('/api/products')->assertOk()->assertHeaderMissing('X-Powered-By');
    }

    public function test_the_seeder_never_uses_a_password_written_in_the_code(): void
    {
        $this->seed();

        $admin = User::where('email', 'admin@queen.ma')->firstOrFail();
        foreach (['Queen2026', 'Admin1234', 'password', 'admin'] as $guess) {
            $this->assertFalse(password_verify($guess, $admin->mot_de_passe), "guessable password: {$guess}");
        }
    }
}
