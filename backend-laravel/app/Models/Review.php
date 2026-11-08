<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/** Avis client sur un produit (table « avis_produits »). Invisible tant que l'admin ne l'a pas approuvé. */
class Review extends Model
{
    protected $table = 'avis_produits';
    public $timestamps = false;

    protected $fillable = ['produit_id', 'utilisateur_id', 'note', 'commentaire', 'est_approuve'];

    protected function casts(): array
    {
        return ['note' => 'integer', 'est_approuve' => 'boolean', 'date_avis' => 'datetime'];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'produit_id')->withTrashed();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }
}
