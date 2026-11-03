<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/** Publicité du carrousel de l'accueil (table « publicites »), éventuellement liée à un produit en promo */
class Advertisement extends Model
{
    protected $table = 'publicites';
    public $timestamps = false;

    protected $fillable = ['titre', 'image', 'reduction', 'produit_id'];

    protected function casts(): array
    {
        return ['reduction' => 'integer', 'produit_id' => 'integer'];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'produit_id');
    }
}
