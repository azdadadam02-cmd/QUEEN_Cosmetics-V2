<?php

use App\Http\Middleware\EnsureRole;
use App\Http\Middleware\SecurityHeaders;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias(['role' => EnsureRole::class]);
        $middleware->append(SecurityHeaders::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // L'API répond toujours en JSON (jamais de page HTML d'erreur)
        $exceptions->shouldRenderJsonWhen(fn (Request $r) => $r->is('api/*') || $r->expectsJson());

        $exceptions->render(function (AuthenticationException $e, Request $r) {
            if ($r->is('api/*')) {
                return response()->json(['message' => 'Session expirée : veuillez vous reconnecter.'], 401);
            }
        });
        $exceptions->render(function (NotFoundHttpException $e, Request $r) {
            if ($r->is('api/*')) {
                $msg = $e->getPrevious() instanceof ModelNotFoundException || str_starts_with($e->getMessage(), 'The route') || $e->getMessage() === ''
                    ? "Élément introuvable."
                    : $e->getMessage();

                return response()->json(['message' => $msg], 404);
            }
        });
    })->create();
