<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;



class MediaUploadService 
{
    /**
     * Загружает медиафайл и превью с кастомным именованием: id_(index).ext
     */
    public static function upload(Model $model, UploadedFile $file, string $type): void 
    {
        // 1. Проверки безопасности
        if (!method_exists($model, 'mediaFiles')) {
            throw new \InvalidArgumentException("Модель " . get_class($model) . " не поддерживает связь mediaFiles.");
        }

        if (!$model->exists) {
            throw new \LogicException("Нельзя привязать файл к несохраненной модели.");
        }

        // Временно увеличиваем лимит памяти для тяжелых PNG/JPEG
        ini_set('memory_limit', '512M');

        $folder = strtolower(class_basename($model));
        $modelId = $model->id;
        $extension = strtolower($file->getClientOriginalExtension()); // Получает расширение файла от пользователя

        // 2. Рассчитываем индекс
        $currentIndex = $model->mediaFiles()->count() + 1;

        // 3. Формируем имена (изменено на _prev по вашему требованию)
        $fileName = "{$modelId}_({$currentIndex}).{$extension}";  // atrikul_(1).png
        $thumbExtension = ($type === 'video') ? 'jpg' : $extension;
        $thumbName = "{$modelId}_({$currentIndex})_prev.{$thumbExtension}";

        // 4. Путь к папке
        $folderPath = "media/{$folder}/{$modelId}";

        // 5. Физически сохраняем основной файл
        $path = $file->storeAs($folderPath, $fileName, 'public');

  // 6. Логика для миниатюры
        $thumbnailPath = $path; // По умолчанию, если GD упадет

        if ($type === 'image') {
            try {
                // Создаем директорию, если её нет
                if (!Storage::disk('public')->exists($folderPath)) {
                    Storage::disk('public')->makeDirectory($folderPath);
                }

                $originalAbsolutePath = Storage::disk('public')->path($path);
                $thumbAbsolutePath = Storage::disk('public')->path("{$folderPath}/{$thumbName}");

                if (!file_exists($originalAbsolutePath)) {
                    throw new \Exception("Исходный файл не найден по пути: {$originalAbsolutePath}");
                }

                // ВАЖНО: Добавлен слэш \ перед функциями для вызова из глобального пространства имен PHP
                $sourceImage = match ($extension) {
                    'jpg', 'jpeg' => \imagecreatefromjpeg($originalAbsolutePath),
                    'png'         => \imagecreatefrompng($originalAbsolutePath),
                    'webp'        => \imagecreatefromwebp($originalAbsolutePath),
                    'gif'         => \imagecreatefromgif($originalAbsolutePath),
                    default       => null,
                };

                if (!$sourceImage) {
                    throw new \Exception("Не удалось создать GD ресурс для расширения: {$extension}. Проверьте, включена ли поддержка этого формата в GD.");
                }

                // Задаем максимальный размер стороны миниатюры
                $maxSize = 300;
                list($origWidth, $origHeight) = \getimagesize($originalAbsolutePath);

                if ($origWidth > 0 && $origHeight > 0) {
                    // Расчет пропорций
                    if ($origWidth > $origHeight) {
                        $thumbWidth = $maxSize;
                        $thumbHeight = (int)($origHeight * ($maxSize / $origWidth));
                    } else {
                        $thumbHeight = $maxSize;
                        $thumbWidth = (int)($origWidth * ($maxSize / $origHeight));
                    }

                    // Создаем пустое полотно под миниатюру
                    $thumbImage = \imagecreatetruecolor($thumbWidth, $thumbHeight);

                    // Сохраняем прозрачность для PNG и WEBP
                    if (in_array($extension, ['png', 'webp'])) {
                        \imagealphablending($thumbImage, false);
                        \imagesavealpha($thumbImage, true);
                    }

                    // Ресайзим оригинал на новое полотно
                    \imagecopyresampled(
                        $thumbImage, $sourceImage, 
                        0, 0, 0, 0, 
                        $thumbWidth, $thumbHeight, $origWidth, $origHeight
                    );

                    // Сохраняем миниатюру на диск
                    $saved = match ($extension) {
                        'jpg', 'jpeg' => \imagejpeg($thumbImage, $thumbAbsolutePath, 85),
                        'png'         => \imagepng($thumbImage, $thumbAbsolutePath, 6),
                        'webp'        => \imagewebp($thumbImage, $thumbAbsolutePath, 80),
                        'gif'         => \imagegif($thumbImage, $thumbAbsolutePath),
                        default       => false
                    };

                    if ($saved) {
                        $thumbnailPath = "{$folderPath}/{$thumbName}";
                    } else {
                        throw new \Exception("GD не смог записать файл миниатюры на диск.");
                    }

                    \imagedestroy($thumbImage);
                }
                \imagedestroy($sourceImage);

            } catch (\Throwable $e) {
                Log::error("Ошибка GD [Файл: {$fileName}]: " . $e->getMessage());
                $thumbnailPath = $path; 
            }

        } elseif ($type === 'video') {
            $thumbnailPath = "{$folderPath}/{$thumbName}";
        }

        // 7. Записываем в базу данных
        $model->mediaFiles()->create([
            'file_path' => $path,
            'thumbnail_path' => $thumbnailPath,
            'type' => $type
        ]);
    }
}





// class MediaUploadService 
// {
//     /**
//      * Загружает медиафайл и превью с кастомным именованием: id_(index).ext
//      */
//     public static function upload(Model $model, UploadedFile $file, string $type): void 
//     {
//         // 1. Проверки безопасности
//         if (!method_exists($model, 'mediaFiles')) {
//             throw new \InvalidArgumentException("Модель " . get_class($model) . " не поддерживает связь mediaFiles.");
//         }
//         if (!$model->exists) {
//             throw new \LogicException("Нельзя привязать файл к несохраненной модели.");
//         }

//         $folder = strtolower(class_basename($model));
//         $modelId = $model->id;
//         $extension = $file->getClientOriginalExtension();

//         // 2. Вычисляем индекс (порядковый номер файла для этой модели)
//         // Считаем, сколько записей уже привязано, и прибавляем 1
//         $currentIndex = $model->mediaFiles()->count() + 1;

//         // 3. Формируем имена файлов по вашему правилу
//         // Пример: 563001_(1).jpg
//         $fileName = "{$modelId}_({$currentIndex}).{$extension}";
        
//         // Определяем расширение для миниатюры: для картинок оставляем родное, для видео делаем jpg
//         $thumbExtension = ($type === 'video') ? 'jpg' : $extension;
//         // Пример: 563001_(1)_prev.jpg
//         $thumbName = "{$modelId}_({$currentIndex})_prev.{$thumbExtension}";

//         // 4. Путь к папке, где будут лежать файлы
//         $folderPath = "media/{$folder}/{$modelId}";

//         // 5. Физически сохраняем основной файл на диск public
//         $path = $file->storeAs($folderPath, $fileName, 'public');

//         // 6. Логика для миниатюры
//         $thumbnailPath = null;
//         if ($type === 'image') {
//             // В реальном проекте здесь будет сжатие через Intervention Image и сохранение под именем $thumbName
//             // Для примера просто симулируем путь:
//             $thumbnailPath = "{$folderPath}/{$thumbName}";
//         } elseif ($type === 'video') {
//             // Для видео здесь будет генерация кадра через FFmpeg и сохранение под именем $thumbName
//             $thumbnailPath = "{$folderPath}/{$thumbName}";
//         }

//         // 7. Записываем относительные пути в базу данных
//         $model->mediaFiles()->create([
//             'file_path'      => $path,
//             'thumbnail_path' => $thumbnailPath ?? $path,
//             'type'           => $type
//         ]);
//     }
// }