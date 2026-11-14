<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    public const EN_ATTENTE = 'En attente';
    public const ACCEPTEE   = 'Acceptee';
    public const REFUSEE    = 'Refusee';
    public const LIVREE     = 'Livree';

    public const STATUTS = [self::EN_ATTENTE, self::ACCEPTEE, self::LIVREE, self::REFUSEE];

    /** Transitions autorisées pour le responsable des commandes */
    public const TRANSITIONS = [
        self::EN_ATTENTE => [self::ACCEPTEE, self::REFUSEE],
        self::ACCEPTEE   => [self::LIVREE, self::REFUSEE],   // Refusee depuis Acceptee = « Annuler »
    ];

    /** Limites anti-abus (identiques à l'ancien site) */
    public const MAX_EN_ATTENTE_PAR_CLIENT = 5;
    public const MAX_PAR_HEURE = 10;

    protected $table = 'commandes';
    public $timestamps = false;

    protected $fillable = ['client_id', 'total', 'statut', 'nom_livraison', 'telephone', 'ville', 'adresse', 'statut_vu', 'date_commande'];

    protected function casts(): array
    {
        return ['total' => 'float', 'date_commande' => 'datetime'];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'commande_id');
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class, 'commande_id');
    }

    public function canMoveTo(string $statut): bool
    {
        return in_array($statut, self::TRANSITIONS[$this->statut] ?? [], true);
    }
}
