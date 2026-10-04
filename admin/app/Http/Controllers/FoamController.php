<?php

namespace App\Http\Controllers;

use App\Models\Foam;
use App\Http\Requests\StoreFoamRequest;
use App\Http\Requests\UpdateFoamRequest;
use App\Services\MediaUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class FoamController extends Controller
{



    // READ (Вывод всех с медиафайлами)
    public function index(): JsonResponse
    {
        $foams = Foam::with('mediaFiles')->get();
        return response()->json($foams);
    }

    // CREATE (Добавление записи и загрузка файлов)
    public function store(StoreFoamRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Создаем запись пены
        $foam = Foam::create($validated);

        // Загружаем обязательные и необязательные фото (от 3 до 9)
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                MediaUploadService::upload($foam, $image, 'image');
            }
        }

        // Загружаем видео, если есть
        if ($request->hasFile('video')) {
            MediaUploadService::upload($foam, $request->file('video'), 'video');
        }

        return response()->json($foam->load('mediaFiles'), 210);
    }

    // READ ONE (Просмотр конкретной позиции)
    public function show(Foam $foam): JsonResponse
    {
        return response()->json($foam->load('mediaFiles'));
    }

    // UPDATE (Редактирование)
    public function update(UpdateFoamRequest $request, Foam $foam): JsonResponse
    {
        $foam->update($request->validated());

        // Если при обновлении переданы новые медиафайлы — старые можно удалить или перезаписать
        if ($request->hasFile('images') || $request->hasFile('video')) {
            // Логика очистки старых файлов при необходимости:
            foreach ($foam->mediaFiles as $file) {
                Storage::disk('public')->delete([$file->file_path, $file->thumbnail_path]);
                $file->delete();
            }

            // Загрузка новых
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    MediaUploadService::upload($foam, $image, 'image');
                }
            }
            if ($request->hasFile('video')) {
                MediaUploadService::upload($foam, $request->file('video'), 'video');
            }
        }

        return response()->json($foam->load('mediaFiles'));
    }

    // DELETE (Удаление)
    public function destroy(Foam $foam): JsonResponse
    {
        // Сначала удаляем физические файлы из хранилища storage
        foreach ($foam->mediaFiles as $file) {
            Storage::disk('public')->delete([$file->file_path, $file->thumbnail_path]);
        }

        // Удаляем связи из БД
        $foam->mediaFiles()->delete();
        // Удаляем саму модель
        $foam->delete();

        return response()->json(['message' => 'Успешно удалено']);
    }
}
