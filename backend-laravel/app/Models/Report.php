<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/** Report envoyé par un client depuis son profil (table « reclamations ») */
class Report extends Model
{
    protected $table = 'reclamations';
    public $timestamps = false;

    protected $fillable = ['utilisateur_id', 'sujet', 'message'];

    protected function casts(): array
    {
        return ['date_reclamation' => 'datetime'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }
}
