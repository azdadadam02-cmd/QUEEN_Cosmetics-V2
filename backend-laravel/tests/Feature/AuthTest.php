<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_returns_a_token_and_the_role(): void
    {
        $user = $this->user('admin');

        $this->postJson('/api/auth/login', ['email' => $user->email, 'password' => self::PASSWORD])
            ->assertOk()
            ->assertJsonPath('user.role', 'admin')
            ->assertJsonStructure(['token', 'user' => ['id', 'email', 'role']]);
    }

    public function test_wrong_password_and_unknown_email_get_the_same_answer(): void
    {
        $user = $this->user();

        $wrongPassword = $this->postJson('/api/auth/login', ['email' => $user->email, 'password' => 'Mauvais123']);
        $unknownEmail  = $this->postJson('/api/auth/login', ['email' => 'personne@test.ma', 'password' => 'Mauvais123']);

        $wrongPassword->assertStatus(422);
        $unknownEmail->assertStatus(422);
        $this->assertSame($wrongPassword->json('message'), $unknownEmail->json('message'));
    }

    public function test_login_is_blocked_after_too_many_failures(): void
    {
        $user = $this->user();

        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/auth/login', ['email' => $user->email, 'password' => 'Mauvais123'])->assertStatus(422);
        }

        $this->postJson('/api/auth/login', ['email' => $user->email, 'password' => self::PASSWORD])->assertStatus(429);
    }

    public function test_register_always_creates_a_client_with_a_hashed_password(): void
    {
        $this->postJson('/api/auth/register', [
            'nom'                   => 'Nouvelle Cliente',
            'email'                 => 'NOUVELLE@Test.ma',
            'password'              => 'Motdepasse1A',
            'password_confirmation' => 'Motdepasse1A',
            'role'                  => 'admin',
        ])->assertCreated()->assertJsonPath('user.role', 'client');

        $user = User::where('email', 'nouvelle@test.ma')->firstOrFail();
        $this->assertSame('client', $user->role);
        $this->assertTrue(Hash::check('Motdepasse1A', $user->mot_de_passe));
    }

    public function test_register_rejects_a_weak_password(): void
    {
        $this->postJson('/api/auth/register', [
            'nom'                   => 'Nouvelle Cliente',
            'email'                 => 'faible@test.ma',
            'password'              => 'faible',
            'password_confirmation' => 'faible',
        ])->assertStatus(422)->assertJsonValidationErrors('password');
    }

    public function test_me_and_logout_need_a_valid_token(): void
    {
        $this->getJson('/api/auth/me')->assertUnauthorized();

        $user  = $this->user();
        $token = $this->postJson('/api/auth/login', ['email' => $user->email, 'password' => self::PASSWORD])->json('token');

        $this->withToken($token)->getJson('/api/auth/me')->assertOk()->assertJsonPath('email', $user->email);
        $this->withToken($token)->postJson('/api/auth/logout')->assertOk();

        $this->assertSame(0, $user->tokens()->count());
    }

    public function test_the_password_never_leaves_the_api(): void
    {
        $user = $this->user();
        $token = $this->postJson('/api/auth/login', ['email' => $user->email, 'password' => self::PASSWORD])->json('token');

        $me = $this->withToken($token)->getJson('/api/auth/me')->assertOk();

        $this->assertStringNotContainsString('mot_de_passe', $me->getContent());
        $this->assertStringNotContainsString($user->mot_de_passe, $me->getContent());
    }
}
