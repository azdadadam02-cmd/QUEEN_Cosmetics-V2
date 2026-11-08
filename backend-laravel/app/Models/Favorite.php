<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    protected $table = 'favoris';
    public $timestamps = false;

    protected $fillable = ['utilisateur_id', 'produit_id'];
}
