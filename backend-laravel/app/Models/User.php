<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    public const ROLES = ['client', 'admin', 'responsable_produits', 'responsable_commandes'];

    public const ROLES_GERABLES = ['client', 'responsable_produits', 'responsable_commandes'];

    protected $table = 'utilisateurs';
    public $timestamps = false;

    protected $authPasswordName = 'mot_de_passe';

    protected $fillable = ['nom', 'email', 'mot_de_passe', 'role', 'date_naissance', 'image'];
    protected $hidden = ['mot_de_passe'];

    protected function casts(): array
    {
        return ['mot_de_passe' => 'hashed', 'date_naissance' => 'date'];
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'client_id');
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function homePath(): string
    {
        return [
            'admin'                 => '/admin',
            'responsable_produits'  => '/gestion/produits',
            'responsable_commandes' => '/gestion/commandes',
        ][$this->role] ?? '/';
    }
}
