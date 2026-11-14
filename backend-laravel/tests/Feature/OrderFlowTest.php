<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrderFlowTest extends TestCase
{
    use RefreshDatabase;

    private function placeOrder(array $items, array $delivery = [])
    {
        return $this->postJson('/api/orders', ['items' => $items] + $this->delivery($delivery));
    }

    public function test_cart_check_recomputes_prices_from_the_database(): void
    {
        $p = $this->product(['prix' => 200, 'promotion' => 25]);

        $this->postJson('/api/cart/check', ['items' => [['id' => $p->id, 'quantity' => 2, 'price' => 1]]])
            ->assertOk()
            ->assertJsonPath('total', 300);
    }

    public function test_an_order_uses_database_prices_decrements_stock_and_waits_for_payment(): void
    {
        $client = $this->actingAsRole('client');
        $p = $this->product(['prix' => 200, 'promotion' => 25, 'quantite_stock' => 5]);

        $this->placeOrder([['id' => $p->id, 'quantity' => 2, 'price' => 1]])->assertCreated();

        $order = Order::where('client_id', $client->id)->firstOrFail();
        $this->assertSame(Order::EN_ATTENTE, $order->statut);
        $this->assertEquals(300, $order->total);
        $this->assertSame('0612345678', $order->telephone);
        $this->assertSame(3, $p->fresh()->quantite_stock);
        $this->assertSame(Payment::NON_PAYE, $order->payment->statut);
    }

    public function test_not_enough_stock_creates_nothing(): void
    {
        $this->actingAsRole('client');
        $p = $this->product(['quantite_stock' => 1]);

        $this->placeOrder([['id' => $p->id, 'quantity' => 2]])->assertStatus(422);

        $this->assertSame(0, Order::count());
        $this->assertSame(1, $p->fresh()->quantite_stock);
    }

    public function test_the_adult_checkbox_is_required(): void
    {
        $this->actingAsRole('client');
        $p = $this->product();

        $this->placeOrder([['id' => $p->id, 'quantity' => 1]], ['majeur' => false])
            ->assertStatus(422)->assertJsonValidationErrors('majeur');
    }

    public function test_staff_cannot_place_orders(): void
    {
        $this->actingAsRole('responsable_commandes');
        $p = $this->product();

        $this->placeOrder([['id' => $p->id, 'quantity' => 1]])->assertForbidden();
    }

    public function test_refusing_an_order_puts_the_stock_back(): void
    {
        $this->actingAsRole('client');
        $p = $this->product(['quantite_stock' => 5]);
        $this->placeOrder([['id' => $p->id, 'quantity' => 2]])->assertCreated();
        $order = Order::firstOrFail();

        Sanctum::actingAs($this->user('responsable_commandes'));
        $this->patchJson("/api/manage/orders/{$order->id}/status", ['status' => Order::REFUSEE])->assertOk();

        $this->assertSame(Order::REFUSEE, $order->fresh()->statut);
        $this->assertSame(5, $p->fresh()->quantite_stock);
    }

    public function test_delivering_an_order_marks_the_payment_as_paid(): void
    {
        $this->actingAsRole('client');
        $p = $this->product();
        $this->placeOrder([['id' => $p->id, 'quantity' => 1]])->assertCreated();
        $order = Order::firstOrFail();

        Sanctum::actingAs($this->user('responsable_commandes'));
        $this->patchJson("/api/manage/orders/{$order->id}/status", ['status' => Order::ACCEPTEE])->assertOk();
        $this->patchJson("/api/manage/orders/{$order->id}/status", ['status' => Order::LIVREE])->assertOk();

        $this->assertSame(Payment::PAYE, $order->fresh()->payment->statut);
    }

    public function test_an_order_cannot_skip_a_step(): void
    {
        $this->actingAsRole('client');
        $p = $this->product();
        $this->placeOrder([['id' => $p->id, 'quantity' => 1]])->assertCreated();
        $order = Order::firstOrFail();

        Sanctum::actingAs($this->user('responsable_commandes'));
        $this->patchJson("/api/manage/orders/{$order->id}/status", ['status' => Order::LIVREE])->assertStatus(422);

        $this->assertSame(Order::EN_ATTENTE, $order->fresh()->statut);
    }

    public function test_admin_can_read_orders_but_not_change_them(): void
    {
        $this->actingAsRole('client');
        $p = $this->product();
        $this->placeOrder([['id' => $p->id, 'quantity' => 1]])->assertCreated();
        $order = Order::firstOrFail();

        Sanctum::actingAs($this->user('admin'));
        $this->getJson('/api/manage/orders')->assertOk();
        $this->patchJson("/api/manage/orders/{$order->id}/status", ['status' => Order::ACCEPTEE])->assertForbidden();
    }
}
