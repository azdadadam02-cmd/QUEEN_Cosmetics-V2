<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Annonce de la barre promotionnelle (table « annonces_promo ») ; date_fin sert au compte à rebours */
class PromoAnnouncement extends Model
{
    protected $table = 'annonces_promo';
    public $timestamps = false;

    protected $fillable = ['texte', 'lien', 'couleur_fond', 'couleur_texte', 'date_debut', 'date_fin', 'est_actif'];

    protected function casts(): array
    {
        return ['date_debut' => 'datetime', 'date_fin' => 'datetime', 'est_actif' => 'boolean'];
    }
}
