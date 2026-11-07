<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/** Liens « Service » du profil client (WhatsApp, Facebook, X, Gmail), saisis par l'admin. Une seule ligne. */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('liens_service')) {
            Schema::create('liens_service', function (Blueprint $table) {
                $table->id();
                $table->string('whatsapp', 255)->nullable();
                $table->string('facebook', 255)->nullable();
                $table->string('twitter', 255)->nullable();
                $table->string('gmail', 150)->nullable();
            });
        }

        // Une base créée par les migrations seules n'a pas ces colonnes (elles viennent de Database.txt)
        Schema::table('utilisateurs', function (Blueprint $table) {
            if (! Schema::hasColumn('utilisateurs', 'date_naissance')) {
                $table->date('date_naissance')->nullable();
            }
            if (! Schema::hasColumn('utilisateurs', 'image')) {
                $table->string('image', 255)->nullable();
            }
        });

        if (! Schema::hasTable('adresses_livraison')) {
            Schema::create('adresses_livraison', function (Blueprint $table) {
                $table->id();
                Schema::getColumnType('utilisateurs', 'id') === 'bigint' ? $table->unsignedBigInteger('utilisateur_id') : $table->integer('utilisateur_id');
                $table->string('titre', 50)->default('Domicile');
                $table->text('adresse_complete');
                $table->string('ville', 100);
                $table->string('telephone', 20);
                $table->boolean('est_principale')->default(false);
                $table->foreign('utilisateur_id')->references('id')->on('utilisateurs')->cascadeOnDelete();
            });
        }
    }

    /** Ne retire que sa propre table : les autres peuvent venir de l'import SQL */
    public function down(): void
    {
        Schema::dropIfExists('liens_service');
    }
};
