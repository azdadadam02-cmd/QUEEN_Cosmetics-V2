<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::where('role', '<>', 'admin')->withCount('orders')->orderByDesc('id')->get();

        return response()->json(UserResource::collection($users)->resolve());
    }

    public function store(UserRequest $request): JsonResponse
    {
        $user = User::create([
            'nom'          => $request->input('nom'),
            'email'        => $request->input('email'),
            'role'         => $request->input('role'),
            'mot_de_passe' => $request->input('password'),
        ]);

        return response()->json(['message' => "Utilisateur « {$user->nom} » créé.", 'user' => new UserResource($user)], 201);
    }

    public function update(UserRequest $request, User $user): JsonResponse
    {
        $this->abortIfAdmin($user);

        $data = $request->only('nom', 'email', 'role');
        if ($request->filled('password')) {
            $data['mot_de_passe'] = $request->input('password');
        }
        $user->update($data);
        $user->tokens()->delete();

        return response()->json(['message' => "Utilisateur « {$user->nom} » mis à jour.", 'user' => new UserResource($user)]);
    }

    public function destroy(User $user): JsonResponse
    {
        $this->abortIfAdmin($user);

        if ($user->orders()->exists()) {
            return response()->json(['message' => "Suppression impossible : « {$user->nom} » a déjà passé des commandes."], 422);
        }
        $user->tokens()->delete();
        $user->delete();

        return response()->json(['message' => "Utilisateur « {$user->nom} » supprimé."]);
    }

    private function abortIfAdmin(User $user): void
    {
        abort_if($user->isAdmin(), 404, 'Utilisateur introuvable (les comptes admin ne sont pas modifiables).');
    }
}
