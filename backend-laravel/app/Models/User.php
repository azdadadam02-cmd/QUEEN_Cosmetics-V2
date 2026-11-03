<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

/**
 * Utilisateur (table « utilisateurs » de queen_db).
 * Rôles : client | admin | responsable_produits | responsable_commandes
 */
class User extends Authenticatable
{
    use HasApiTokens;

    public const ROLES = ['client', 'admin', 'responsable_produits', 'responsable_commandes'];

    /** Rôles que l'admin peut créer / modifier (jamais « admin ») */
    public const ROLES_GERABLES = ['client', 'responsable_produits', 'responsable_commandes'];

    protected $table = 'utilisateurs';
    public $timestamps = false;

    /** La colonne du mot de passe s'appelle « mot_de_passe » et non « password » */
    protected $authPasswordName = 'mot_de_passe';

    protected $fillable = ['nom', 'email', 'mot_de_passe', 'role'];
    protected $hidden = ['mot_de_passe'];

    protected function casts(): array
    {
        return ['mot_de_passe' => 'hashed'];
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'client_id');
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /** Page d'accueil Next.js selon le rôle */
    public function homePath(): string
    {
        return [
            'admin'                 => '/admin',
            'responsable_produits'  => '/gestion/produits',
            'responsable_commandes' => '/gestion/commandes',
        ][$this->role] ?? '/';
    }
}
