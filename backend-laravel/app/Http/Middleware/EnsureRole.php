<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

/**
 * Route::middleware('role:admin,responsable_commandes')
 * Le rôle est relu depuis la base à chaque requête (le token ne contient pas le rôle).
 */
class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Veuillez vous connecter pour continuer.'], 401);
        }

        if (! in_array($user->role, $roles, true)) {
            Log::channel('security')->warning('acces_refuse', [
                'user' => $user->id, 'role' => $user->role, 'route' => $request->path(), 'ip' => $request->ip(),
            ]);

            return response()->json(['message' => "Accès refusé : cette page n'est pas disponible avec votre compte."], 403);
        }

        return $next($request);
    }
}
