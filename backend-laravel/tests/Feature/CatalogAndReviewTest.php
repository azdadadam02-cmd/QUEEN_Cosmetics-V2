<?php

namespace Tests\Feature;

use App\Models\Review;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CatalogAndReviewTest extends TestCase
{
    use RefreshDatabase;

    public function test_trashed_products_are_hidden_from_the_shop_but_can_be_restored(): void
    {
        $p = $this->product(['nom' => 'Parfum Rose']);
        $this->getJson("/api/products/{$p->id}")->assertOk()->assertJsonPath('name', 'Parfum Rose');

        Sanctum::actingAs($this->user('responsable_produits'));
        $this->deleteJson("/api/manage/products/{$p->id}")->assertOk();

        $this->getJson("/api/products/{$p->id}")->assertNotFound();
        $this->assertNotContains($p->id, array_column($this->getJson('/api/products')->json(), 'id'));

        $this->postJson("/api/manage/products/{$p->id}/restore")->assertOk();
        $this->getJson("/api/products/{$p->id}")->assertOk();
    }

    public function test_a_review_stays_hidden_until_the_admin_approves_it(): void
    {
        $p = $this->product();
        Sanctum::actingAs($this->user('client', ['nom' => 'Salma Bennani']));

        $this->postJson("/api/products/{$p->id}/reviews", ['note' => 5, 'commentaire' => 'Très bien'])->assertCreated();
        $this->getJson("/api/products/{$p->id}/reviews")->assertOk()->assertJsonCount(0);
        $this->getJson("/api/products/{$p->id}/reviews/mine")->assertOk()->assertJsonPath('rating', 5);

        Sanctum::actingAs($this->user('admin'));
        $review = Review::firstOrFail();
        $this->patchJson("/api/admin/reviews/{$review->id}", ['approved' => true])->assertOk();

        $this->getJson("/api/products/{$p->id}/reviews")
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.author', 'Salma');
    }

    public function test_a_new_review_from_the_same_client_goes_back_to_moderation(): void
    {
        $p = $this->product();
        $client = $this->user('client');
        Review::create(['produit_id' => $p->id, 'utilisateur_id' => $client->id, 'note' => 4, 'est_approuve' => true]);

        Sanctum::actingAs($client);
        $this->postJson("/api/products/{$p->id}/reviews", ['note' => 1])->assertCreated();

        $this->assertSame(1, Review::count());
        $this->assertFalse((bool) Review::first()->est_approuve);
    }

    public function test_editing_a_review_updates_its_date(): void
    {
        $p = $this->product();
        $client = $this->user('client');
        Review::create(['produit_id' => $p->id, 'utilisateur_id' => $client->id, 'note' => 4, 'date_avis' => now()->subDays(30)]);
        $this->assertTrue(Review::first()->date_avis->lt(now()->subDays(29)));

        Sanctum::actingAs($client);
        $this->postJson("/api/products/{$p->id}/reviews", ['note' => 5])->assertCreated();

        $this->assertTrue(Review::first()->date_avis->gt(now()->subMinute()));
    }

    public function test_a_review_needs_a_rating_between_1_and_5(): void
    {
        $p = $this->product();
        Sanctum::actingAs($this->user('client'));

        $this->postJson("/api/products/{$p->id}/reviews", ['note' => 6])->assertStatus(422)->assertJsonValidationErrors('note');
    }
}
