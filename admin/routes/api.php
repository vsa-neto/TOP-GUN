<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

use App\Http\Controllers\FoamController;
use App\Http\Controllers\SealantController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Публичный маршрут для авторизации
Route::post('/login', [AuthController::class, 'login']);

// Защищенные маршруты для админки (доступны только по Bearer-токену)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Сюда можно добавлять другие защищенные роуты админки, например:
    // Route::apiResource('products', ProductController::class);
});

    Route::apiResource('foams', FoamController::class);
    Route::apiResource('sealants', SealantController::class);