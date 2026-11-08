<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceLink extends Model
{
    protected $table = 'liens_service';
    public $timestamps = false;

    protected $fillable = ['whatsapp', 'facebook', 'instagram', 'twitter', 'gmail'];

    public function toApi(): array
    {
        return $this->only($this->fillable) + array_fill_keys($this->fillable, null);
    }
}
