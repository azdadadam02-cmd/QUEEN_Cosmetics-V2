<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $table = 'adresses_livraison';
    public $timestamps = false;

    protected $fillable = ['utilisateur_id', 'titre', 'adresse_complete', 'ville', 'telephone', 'est_principale'];

    protected function casts(): array
    {
        return ['est_principale' => 'boolean'];
    }
}
