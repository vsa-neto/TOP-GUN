<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Storage;

class MediaFile extends Model
{
    protected $fillable = ['file_path', 'thumbnail_path', 'type'];

    // Аппенды для получения полных URL в React
    protected $appends = ['file_url', 'thumbnail_url'];

    public function mediaable(): MorphTo
    {
        return $this->morphTo();
    }

    public function getFileUrlAttribute(): string
    {
        return Storage::url($this->file_path);
    }

    public function getThumbnailUrlAttribute(): string
    {
        return $this->thumbnail_path ? Storage::url($this->thumbnail_path) : Storage::url($this->file_path);
     // Проверяем, заполнено ли поле И существует ли файл на диске
    // if ($this->thumbnail_path && Storage::disk('public')->exists($this->thumbnail_path)) {
    //     return Storage::url($this->thumbnail_path);
    // }

    // // Если миниатюры нет, возвращаем ссылку на оригинал
    // return Storage::url($this->file_path);
    }
}