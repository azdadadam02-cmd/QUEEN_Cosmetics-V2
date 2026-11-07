<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Image de la galerie d'un produit (table « images_produits ») */
class ProductImage extends Model
{
    protected $table = 'images_produits';
    public $timestamps = false;

    protected $fillable = ['produit_id', 'chemin_image', 'ordre_affichage'];
}
