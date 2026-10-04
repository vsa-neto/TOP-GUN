<?php

namespace App\Http\Controllers;

use App\Models\Sealant;
use App\Http\Requests\StoreSealantRequest;
use App\Http\Requests\UpdateSealantRequest;
use App\Services\MediaUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class SealantController extends Controller
{
    /**
     * DISPLAY: Получить список всех герметиков вместе с их медиафайлами.
     * Отвечает на GET /api/sealants
     */
    public function index(): JsonResponse
    {
        // Подгружаем связь mediaFiles, чтобы React сразу получил ссылки на фото и видео
        $sealants = Sealant::with('mediaFiles')->get();
        return response()->json($sealants, 200);
    }

    /**
     * CREATE: Создать новый герметик и загрузить файлы.
     * Отвечает на POST /api/sealants
     */
    public function store(StoreSealantRequest $request): JsonResponse
    {
        $validated = $request->validated();
        
        // Создаем запись герметика в БД. Поле attributes автоматически преобразуется в JSON
        $sealant = Sealant::create($validated);

        // Универсальная загрузка изображений (валидатор гарантирует от 3 до 9 файлов)
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                MediaUploadService::upload($sealant, $image, 'image');
            }
        }

        // Универсальная загрузка видео (если передано)
        if ($request->hasFile('video')) {
            MediaUploadService::upload($sealant, $request->file('video'), 'video');
        }

        // Возвращаем созданный объект со всеми медиафайлами и статусом 201 (Created)
        return response()->json($sealant->load('mediaFiles'), 201);
    }

    /**
     * SHOW: Получить данные одного конкретного герметика по его ID (артикулу).
     * Отвечает на GET /api/sealants/{sealant}
     */
    public function show(Sealant $sealant): JsonResponse
    {
        return response()->json($sealant->load('mediaFiles'), 200);
    }

    /**
     * UPDATE: Обновить данные герметика и его медиафайлы.
     * Отвечает на POST /api/sealants/{sealant} с добавлением поля _method=PUT
     */
    public function update(UpdateSealantRequest $request, Sealant $sealant): JsonResponse
    {
        // Обновляем текстовые поля и JSON-аттрибуты
        $sealant->update($request->validated());

        // Если администратор прикрепил новые файлы, мы полностью обновляем медиа-галерею
        if ($request->hasFile('images') || $request->hasFile('video')) {
            
            // 1. Физически удаляем старые файлы с диска storage и чистим базу данных
            foreach ($sealant->mediaFiles as $file) {
                Storage::disk('public')->delete([$file->file_path, $file->thumbnail_path]);
                $file->delete();
            }
            
            // 2. Загружаем новый массив картинок
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    MediaUploadService::upload($sealant, $image, 'image');
                }
            }

            // 3. Загружаем новое видео
            if ($request->hasFile('video')) {
                MediaUploadService::upload($sealant, $request->file('video'), 'video');
            }
        }

        return response()->json($sealant->load('mediaFiles'), 200);
    }

    /**
     * DELETE: Полностью удалить герметик и все связанные файлы.
     * Отвечает на DELETE /api/sealants/{sealant}
     */
    public function destroy(Sealant $sealant): JsonResponse
    {
        // Удаляем файлы из локального или облачного хранилища public
        foreach ($sealant->mediaFiles as $file) {
            Storage::disk('public')->delete([$file->file_path, $file->thumbnail_path]);
        }
        
        // Удаляем записи из таблицы media_files
        $sealant->mediaFiles()->delete();
        
        // Удаляем герметик из таблицы sealants
        $sealant->delete();

        return response()->json([
            'message' => 'Герметик и все связанные медиафайлы успешно удалены.'
        ], 200);
    }
}