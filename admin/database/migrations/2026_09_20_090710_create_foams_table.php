<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('foams', function (Blueprint $table) {
            // $table->id();
            $table->string('id')->primary(); // Артикул как первичный ключ
            $table->string('name');
            $table->enum('level', ['hobby', 'profi', 'premium']);
            $table->text('description'); // Markdown
            $table->json('attributes')->nullable(); // body, barrel, adapter и т.д.
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('foams');
    }
};
