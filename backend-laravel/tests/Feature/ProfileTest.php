<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    private function saveBirthDate(?string $date)
    {
        return $this->putJson('/api/profile', ['nom' => 'Salma Bennani', 'date_naissance' => $date]);
    }

    public function test_a_client_under_18_is_refused(): void
    {
        Sanctum::actingAs($this->user('client'));

        $this->saveBirthDate(now()->subYears(18)->addDay()->toDateString())
            ->assertStatus(422)
            ->assertJsonPath('errors.date_naissance.0', 'Vous devez avoir au moins 18 ans.');
    }

    public function test_turning_18_today_is_accepted(): void
    {
        $client = $this->user('client');
        Sanctum::actingAs($client);

        $born = now()->subYears(18)->toDateString();
        $this->saveBirthDate($born)->assertOk();
        $this->assertSame($born, $client->fresh()->date_naissance->toDateString());
    }

    public function test_birth_date_stays_optional(): void
    {
        Sanctum::actingAs($this->user('client'));

        $this->saveBirthDate(null)->assertOk();
        $this->saveBirthDate('')->assertOk();
    }

    public function test_on_29_february_someone_born_on_1_march_is_not_18_yet(): void
    {
        Carbon::setTestNow('2028-02-29 12:00:00');
        Sanctum::actingAs($this->user('client'));

        $this->saveBirthDate('2010-03-01')->assertStatus(422);
        $this->saveBirthDate('2010-02-28')->assertOk();

        Carbon::setTestNow();
    }

    public function test_absurd_dates_are_refused(): void
    {
        Sanctum::actingAs($this->user('client'));

        foreach (['1899-12-31', '2099-01-01', 'pas une date', '08/11/2000'] as $date) {
            $this->saveBirthDate($date)->assertStatus(422)->assertJsonValidationErrors('date_naissance');
        }
    }
}
