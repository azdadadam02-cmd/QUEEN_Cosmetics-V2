<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class VariantTest extends TestCase
{
    use RefreshDatabase;

    private function perfume(array $attrs = []): array
    {
        $p = $this->product(['nom' => 'Eau de parfum', 'prix' => 100, 'quantite_stock' => 0] + $attrs);
        $small = ProductVariant::create(['produit_id' => $p->id, 'volume_ml' => 50, 'prix' => 80, 'quantite_stock' => 5]);
        $big = ProductVariant::create(['produit_id' => $p->id, 'volume_ml' => 100, 'prix' => null, 'quantite_stock' => 5]);
        $p->syncVariantStock();   // comme dans l'app : stock du produit = total des variantes

        return [$p->fresh(), $small, $big];
    }

    private function saveProduct(?Product $p, array $variants)
    {
        Sanctum::actingAs($this->user('responsable_produits'));
        $body = ['nom' => 'Rouge', 'prix' => '120', 'stock' => '0', 'variants' => json_encode($variants)];

        return $this->post($p ? "/api/manage/products/{$p->id}" : '/api/manage/products', $body, ['Accept' => 'application/json']);
    }

    public function test_each_variant_shows_its_own_price_with_the_promo(): void
    {
        [$p] = $this->perfume(['promotion' => 10]);

        $variants = collect($this->getJson("/api/products/{$p->id}")->assertOk()->json('variants'))->keyBy('volume_ml');
        $this->assertEquals(72, $variants[50]['price']);
        $this->assertEquals(80, $variants[50]['original_price']);
        $this->assertEquals(90, $variants[100]['price'], 'empty variant price falls back to the product price');
    }

    public function test_cart_and_order_charge_the_variant_price(): void
    {
        [$p, $small, $big] = $this->perfume();
        $items = [['id' => $p->id, 'variant_id' => $small->id, 'quantity' => 2], ['id' => $p->id, 'variant_id' => $big->id, 'quantity' => 1]];

        $this->postJson('/api/cart/check', ['items' => $items])->assertOk()->assertJsonPath('total', 260);

        Sanctum::actingAs($this->user('client'));
        $this->postJson('/api/orders', ['items' => $items] + $this->delivery())->assertCreated();

        $order = Order::with('items')->firstOrFail();
        $this->assertEquals(260, $order->total);
        $this->assertEqualsCanonicalizing([80, 100], $order->items->pluck('prix_unitaire')->map(fn ($x) => (float) $x)->all());
    }

    public function test_variant_price_is_saved_and_accepts_a_comma(): void
    {
        $this->saveProduct(null, [
            ['id' => null, 'couleur' => '#ff0000', 'prix' => null, 'stock' => 3],
            ['id' => null, 'volume_ml' => 50, 'prix' => '99,5', 'stock' => 2],
        ])->assertCreated();

        $prices = ProductVariant::orderBy('id')->pluck('prix')->all();
        $this->assertSame([null, 99.5], $prices);
    }

    public function test_a_variant_cannot_be_colour_and_size_at_once(): void
    {
        $this->saveProduct(null, [['id' => null, 'couleur' => '#ff0000', 'taille' => 'M', 'stock' => 3]])
            ->assertStatus(422)->assertJsonValidationErrors('variants.0');
    }

    public function test_a_negative_or_text_price_is_refused(): void
    {
        foreach (['-5', 'gratuit'] as $bad) {
            $this->saveProduct(null, [['id' => null, 'volume_ml' => 50, 'prix' => $bad, 'stock' => 2]])
                ->assertStatus(422)->assertJsonValidationErrors('variants.0.prix');
        }
    }
}
