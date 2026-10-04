<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFoamRequest extends FormRequest
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
            'attributes' => 'nullable|array',
            'attributes.body' => 'nullable|string',
            'attributes.barrel' => 'nullable|string',
            'attributes.adapter' => 'nullable|string',
            'attributes.hand' => 'nullable|string',
            'attributes.regulator' => 'nullable|string',
            'attributes.trigger' => 'nullable|string',
            'attributes.valve' => 'nullable|string',
            'attributes.confuzor' => 'nullable|boolean',

            // Валидация медиа файлов под условия React Swiper:
            'images' => 'required|array|min:3|max:9',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:5120', // макс 5мб
            'video' => 'nullable|file|mimes:mp4|max:50000', // макс 50мб
        ];
    }
}