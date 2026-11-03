<?php

use Laravel\Sanctum\Sanctum;

return [

    /*
    | Next.js utilise des tokens (Authorization: Bearer …), pas les cookies SPA.
    | On laisse quand même la liste « stateful » configurable.
    */
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
        '%s%s',
        'localhost,localhost:3000,127.0.0.1,127.0.0.1:3000,::1',
        Sanctum::currentApplicationUrlWithPort(),
    ))),

    'guard' => ['web'],

    // Durée de vie d'un token en minutes (480 = 8 h, comme la session max de l'ancien site)
    'expiration' => (int) env('SANCTUM_EXPIRATION', 480),

    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', 'queen_'),

    'middleware' => [
        'authenticate_session' => Laravel\Sanctum\Http\Middleware\AuthenticateSession::class,
        'encrypt_cookies' => Illuminate\Cookie\Middleware\EncryptCookies::class,
        'validate_csrf_token' => Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
    ],

];
