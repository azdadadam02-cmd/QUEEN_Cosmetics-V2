<?php

namespace Tests;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Laravel\Sanctum\Sanctum;

abstract class TestCase extends BaseTestCase
{
    protected const PASSWORD = 'Secret123';

    protected function user(string $role = 'client', array $attrs = []): User
    {
        static $n = 0;
        $n++;

        return User::create($attrs + [
            'nom'          => "Test {$role} {$n}",
            'email'        => "{$role}{$n}@test.ma",
            'mot_de_passe' => self::PASSWORD,
            'role'         => $role,
        ]);
    }

    protected function actingAsRole(string $role): User
    {
        $user = $this->user($role);
        Sanctum::actingAs($user);

        return $user;
    }

    protected function product(array $attrs = []): Product
    {
        return Product::create($attrs + [
            'nom'            => 'Rouge à lèvres',
            'categorie'      => 'Maquillage',
            'sous_categorie' => 'Lèvres',
            'marque'         => 'Queen',
            'prix'           => 100,
            'quantite_stock' => 10,
        ]);
    }

    protected function delivery(array $overrides = []): array
    {
        return $overrides + [
            'nom'       => 'Salma Bennani',
            'telephone' => '06 12-34.56 78',
            'ville'     => 'Casablanca',
            'adresse'   => '12 rue des Roses, Maarif',
            'majeur'    => true,
        ];
    }
}
