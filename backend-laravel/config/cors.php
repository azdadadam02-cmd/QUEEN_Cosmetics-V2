<?php

/*
| CORS : seul le site Next.js (FRONTEND_URL) peut appeler l'API depuis le navigateur.
| Plusieurs adresses ? Sépare-les par des virgules dans .env
*/
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    'allowed_origins' => array_map('trim', explode(',', env('FRONTEND_URL', 'http://localhost:3000'))),
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['Content-Type', 'Accept', 'Authorization', 'X-Requested-With'],
    'exposed_headers' => [],
    'max_age' => 3600,
    'supports_credentials' => false,
];
