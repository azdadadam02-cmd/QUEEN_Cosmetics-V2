<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('liens_service', 'instagram')) {
            Schema::table('liens_service', function (Blueprint $table) {
                $table->string('instagram', 255)->nullable()->after('facebook');
            });
        }
    }

    public function down(): void
    {
        Schema::table('liens_service', function (Blueprint $table) {
            $table->dropColumn('instagram');
        });
    }
};
