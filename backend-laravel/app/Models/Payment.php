<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/** Paiement à la livraison (table « paiements ») : « Non paye » → « Paye » quand la commande est livrée */
class Payment extends Model
{
    public const NON_PAYE = 'Non paye';
    public const PAYE     = 'Paye';

    protected $table = 'paiements';
    public $timestamps = false;

    protected $fillable = ['commande_id', 'montant', 'methode', 'statut'];

    protected function casts(): array
    {
        return ['montant' => 'float'];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'commande_id');
    }
}
