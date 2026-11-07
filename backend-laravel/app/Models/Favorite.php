<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Produit mis en favori par un client (table « favoris ») */
class Favorite extends Model
{
    protected $table = 'favoris';
    public $timestamps = false;

    protected $fillable = ['utilisateur_id', 'produit_id'];
}
