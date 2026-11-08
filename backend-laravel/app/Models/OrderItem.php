<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    protected $table = 'details_commandes';
    public $timestamps = false;

    protected $fillable = ['commande_id', 'produit_id', 'variante_id', 'pack_id', 'quantite', 'prix_unitaire'];

    protected function casts(): array
    {
        return ['quantite' => 'integer', 'prix_unitaire' => 'float'];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'produit_id')->withTrashed();
    }

    public function pack(): BelongsTo
    {
        return $this->belongsTo(Pack::class, 'pack_id');
    }

    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'variante_id');
    }
}
