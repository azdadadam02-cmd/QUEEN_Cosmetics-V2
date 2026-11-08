<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usp extends Model
{
    protected $table = 'usps';
    public $timestamps = false;

    protected $fillable = ['icone', 'texte', 'lien', 'ordre_affichage', 'est_actif'];

    protected function casts(): array
    {
        return ['ordre_affichage' => 'integer', 'est_actif' => 'boolean'];
    }
}
