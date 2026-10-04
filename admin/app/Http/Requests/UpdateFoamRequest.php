<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFoamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // $currentFoamId = $this->route('foam');
        $foam = $this->route('foam');
        // добавляем:
        $currentFoamId = $foam instanceof \App\Models\Foam ? $foam->id : $foam;

        return [
            // Игнорируем текущий артикул при проверке на уникальность
            // 'id' => 'required|string|unique:foams,id,' . $currentFoamId,
            // Теперь передается чистая строка/число ID, и правило unique сработает корректно
            'id' => 'required|string|unique:foams,id,' . $currentFoamId,

            'name' => 'required|string|max:255',
            'level' => 'required|in:hobby,profi,premium',
            'description' => 'required|string',
            
            // Атрибуты для Foam
            'attributes' => 'nullable|array',
            'attributes.body' => 'nullable|string',
            'attributes.barrel' => 'nullable|string',
            'attributes.adapter' => 'nullable|string',
            'attributes.hand' => 'nullable|string',
            'attributes.regulator' => 'nullable|string',
            'attributes.trigger' => 'nullable|string',
            'attributes.valve' => 'nullable|string',
            'attributes.confuzor' => 'nullable|boolean',

            // При обновлении файлы необязательны
            'images' => 'nullable|array|min:3|max:9',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:5120',
            'video' => 'nullable|file|mimes:mp4|max:50000',
        ];
    }
}