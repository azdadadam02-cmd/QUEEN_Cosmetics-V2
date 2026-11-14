<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/** Apparence du site (couleurs, polices, cartes produit) : une seule ligne, tout en JSON pour ajouter un réglage sans migration. */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('parametres_theme')) {
            Schema::create('parametres_theme', function (Blueprint $table) {
                $table->id();
                $table->json('valeurs')->nullable();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('parametres_theme');
    }
};
