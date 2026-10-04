<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Sealant extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = ['id', 'name', 'level', 'description', 'attributes'];

    protected $casts = [
        'attributes' => 'array', // Автоматическая конвертация JSON <-> Array
    ];

    // Универсальная связь с медиа
    public function mediaFiles(): MorphMany
    {
        return $this->morphMany(MediaFile::class, 'mediaable');
    }
}