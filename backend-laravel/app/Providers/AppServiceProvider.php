<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Les Resources renvoient directement l'objet / le tableau (sans clé « data »)
        JsonResource::withoutWrapping();

        // Limites de débit (middleware « throttle:<nom> » dans routes/api.php)
        RateLimiter::for('api', fn (Request $r) => Limit::perMinute(120)->by($r->user()?->id ?: $r->ip()));

        RateLimiter::for('register', fn (Request $r) => Limit::perHour(10)->by($r->ip())
            ->response(fn () => response()->json(['message' => "Trop d'inscriptions depuis cette connexion. Réessayez plus tard."], 429)));

        RateLimiter::for('uploads', fn (Request $r) => Limit::perMinute(30)->by($r->user()?->id ?: $r->ip()));
    }
}
