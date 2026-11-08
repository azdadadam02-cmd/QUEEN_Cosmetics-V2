<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class SmokeTest extends TestCase
{
    use RefreshDatabase;

    public function test_migrations_run_on_sqlite(): void
    {
        $this->assertSame('sqlite', DB::connection()->getDriverName());
        $this->getJson('/api/products')->assertOk();
    }
}
