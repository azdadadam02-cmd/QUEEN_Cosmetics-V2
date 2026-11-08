<?php

namespace Tests\Feature;

use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class RoleAccessTest extends TestCase
{
    use RefreshDatabase;

    private const ROUTES = [
        'client'       => '/api/profile',
        'products'     => '/api/manage/products',
        'orders'       => '/api/manage/orders',
        'admin'        => '/api/admin/users',
    ];

    private const ALLOWED = [
        'client'                => ['client'],
        'responsable_produits'  => ['products'],
        'responsable_commandes' => ['orders'],
        'admin'                 => ['products', 'orders', 'admin'],
    ];

    public static function roles(): array
    {
        return array_combine(array_keys(self::ALLOWED), array_map(fn ($r) => [$r], array_keys(self::ALLOWED)));
    }

    public function test_guests_are_asked_to_log_in(): void
    {
        foreach (self::ROUTES as $url) {
            $this->getJson($url)->assertUnauthorized();
        }
    }

    #[DataProvider('roles')]
    public function test_each_role_only_reaches_its_own_area(string $role): void
    {
        $this->actingAsRole($role);

        foreach (self::ROUTES as $area => $url) {
            $expected = in_array($area, self::ALLOWED[$role], true) ? 200 : 403;
            $this->getJson($url)->assertStatus($expected);
        }
    }

    public function test_role_is_read_from_the_database_on_every_request(): void
    {
        $user = $this->actingAsRole('admin');
        $this->getJson('/api/admin/users')->assertOk();

        $user->update(['role' => 'client']);

        $this->getJson('/api/admin/users')->assertForbidden();
    }

    public function test_admin_cannot_create_another_admin(): void
    {
        $this->actingAsRole('admin');

        $this->postJson('/api/admin/users', [
            'nom'                   => 'Faux Admin',
            'email'                 => 'faux@test.ma',
            'role'                  => 'admin',
            'password'              => 'Motdepasse1A',
            'password_confirmation' => 'Motdepasse1A',
        ])->assertStatus(422)->assertJsonValidationErrors('role');
    }

    public function test_admin_accounts_cannot_be_edited_or_deleted(): void
    {
        $this->actingAsRole('admin');
        $other = $this->user('admin');

        $this->deleteJson("/api/admin/users/{$other->id}")->assertNotFound();
        $this->assertModelExists($other);
    }

    public function test_a_user_with_orders_cannot_be_deleted(): void
    {
        $this->actingAsRole('admin');
        $client = $this->user('client');
        Order::create(['client_id' => $client->id, 'total' => 50, 'statut' => Order::LIVREE, 'nom_livraison' => 'X', 'telephone' => '0612345678', 'ville' => 'Rabat', 'adresse' => 'Rue 1', 'date_commande' => now()]);

        $this->deleteJson("/api/admin/users/{$client->id}")->assertStatus(422);
        $this->assertModelExists($client);
    }
}
