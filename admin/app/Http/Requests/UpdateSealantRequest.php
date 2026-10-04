<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSealantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $currentSealantId = $this->route('sealant');

        return [
            // Игнорируем текущий артикул при проверке на уникальность
            'id' => 'required|string|unique:sealants,id,' . $currentSealantId,
            'name' => 'required|string|max:255',
            'level' => 'required|in:hobby,profi,premium',
            'description' => 'required|string',
            
            // Атрибуты для Sealant
            'attributes' => 'nullable|array',
            'attributes.volume' => 'nullable|string',
            'attributes.ratio' => 'nullable|string',
            'attributes.force' => 'nullable|string',

            // При обновлении файлы необязательны
            'images' => 'nullable|array|min:3|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:5120',
            'video' => 'nullable|file|mimes:mp4|max:50000',
        ];
    }
}