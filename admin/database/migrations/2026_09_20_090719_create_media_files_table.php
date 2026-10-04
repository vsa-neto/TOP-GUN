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
        Schema::create('media_files', function (Blueprint $table) {
            $table->id();
            // Полиморфная связь: создаст поля mediaable_id (string под наш артикул) и mediaable_type
            $table->string('mediaable_id'); 
            $table->string('mediaable_type');
            
            $table->string('file_path');       // Путь к оригинальному файлу
            $table->string('thumbnail_path')->nullable(); // Путь к превью (для фото и видео)
            $table->enum('type', ['image', 'video']);
            $table->timestamps();

            // Индекс для ускорения выборки
            $table->index(['mediaable_id', 'mediaable_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media_files');
    }
};
