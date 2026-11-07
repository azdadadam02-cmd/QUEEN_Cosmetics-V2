<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Barre de marque sous les barres du haut (table « parametres_header », une seule ligne) */
class HeaderSetting extends Model
{
    protected $table = 'parametres_header';
    public $timestamps = false;

    protected $fillable = ['nom_marque', 'couleur_fond', 'couleur_texte', 'est_actif'];

    protected function casts(): array
    {
        return ['est_actif' => 'boolean'];
    }

    public function toApi(): array
    {
        return ['name' => $this->nom_marque, 'background' => $this->couleur_fond, 'color' => $this->couleur_texte, 'active' => $this->est_actif];
    }
}
