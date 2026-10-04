<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSealantRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'id' => 'required|string|unique:foams,id',
            'name' => 'required|string|max:255',
            'level' => 'required|in:hobby,profi,premium',
            'description' => 'required|string',
            // Валидация JSON-атрибутов
            'attributes.volume' => 'nullable|string',
            'attributes.ratio' => 'nullable|string',
            'attributes.force' => 'nullable|string',

            // Валидация медиа файлов под условия React Swiper:
            'images' => 'required|array|min:3|max:9',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:5120', // макс 5мб
            'video' => 'nullable|file|mimes:mp4|max:50000', // макс 50мб
        ];
    }
}