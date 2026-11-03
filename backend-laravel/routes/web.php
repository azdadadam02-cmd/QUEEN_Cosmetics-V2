<?php

use Illuminate\Support\Facades\Route;

// Ce projet Laravel est une API : la boutique est servie par Next.js (frontend-nextjs).
Route::get('/', fn () => response()->json([
    'app'  => 'QUEEN Cosmetics API',
    'docs' => 'Toutes les routes sont sous /api (voir routes/api.php)',
]));
