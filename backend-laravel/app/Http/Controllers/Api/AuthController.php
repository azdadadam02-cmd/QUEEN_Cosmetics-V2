<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;

/**
 * Connexion par token (Laravel Sanctum).
 * Next.js garde le token et l'envoie dans « Authorization: Bearer <token> ».
 */
class AuthController extends Controller
{
    private const LOGIN_MAX_PAR_EMAIL = 5;     // échecs
    private const LOGIN_MAX_PAR_IP    = 30;
    private const LOGIN_FENETRE       = 900;   // 15 min

    /** POST /api/auth/login */
    public function login(LoginRequest $request): JsonResponse
    {
        $email  = $request->input('email');
        $kEmail = 'login:'.sha1($email.'|'.$request->ip());
        $kIp    = 'login-ip:'.$request->ip();

        if (RateLimiter::tooManyAttempts($kEmail, self::LOGIN_MAX_PAR_EMAIL)
            || RateLimiter::tooManyAttempts($kIp, self::LOGIN_MAX_PAR_IP)) {
            $wait = max(RateLimiter::availableIn($kEmail), RateLimiter::availableIn($kIp));
            Log::channel('security')->warning('login_bloque', ['email' => $email, 'ip' => $request->ip()]);

            return response()->json([
                'message' => 'Trop de tentatives. Réessayez dans '.ceil($wait / 60).' minute(s).',
            ], 429);
        }

        $user = User::where('email', $email)->first();

        // Même message (et même calcul) que l'email existe ou non
        $hash = $user?->mot_de_passe ?? Hash::make('queen-timing-dummy');
        $ok   = Hash::check($request->input('password'), $hash);
        if (! $user || ! $ok) {
            RateLimiter::hit($kEmail, self::LOGIN_FENETRE);
            RateLimiter::hit($kIp, self::LOGIN_FENETRE);
            Log::channel('security')->info('login_echec', ['email' => $email, 'ip' => $request->ip()]);

            return response()->json(['message' => 'Email ou mot de passe incorrect.'], 422);
        }

        RateLimiter::clear($kEmail);

        if (Hash::needsRehash($user->mot_de_passe)) {
            $user->forceFill(['mot_de_passe' => $request->input('password')])->save();
        }

        return $this->tokenResponse($user, 'Bienvenue '.$user->nom.' !');
    }

    /** POST /api/auth/register — crée un compte CLIENT et le connecte directement */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'nom'          => $request->input('nom'),
            'email'        => $request->input('email'),
            'mot_de_passe' => $request->input('password'),   // hashé par le cast « hashed »
            'role'         => 'client',
        ]);

        return $this->tokenResponse($user, 'Compte créé, bienvenue '.$user->nom.' !', 201);
    }

    /** GET /api/auth/me — l'utilisateur connecté (rôle relu en base) */
    public function me(Request $request): UserResource
    {
        return new UserResource($request->user());
    }

    /** POST /api/auth/logout — supprime le token utilisé */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json(['message' => 'Vous êtes déconnecté.']);
    }

    private function tokenResponse(User $user, string $message, int $status = 200): JsonResponse
    {
        $minutes = (int) config('sanctum.expiration', 480);
        $token   = $user->createToken('nextjs', ['*'], $minutes ? now()->addMinutes($minutes) : null);

        return response()->json([
            'message' => $message,
            'token'   => $token->plainTextToken,
            'user'    => new UserResource($user),
        ], $status);
    }
}
