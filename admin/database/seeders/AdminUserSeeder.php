<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'v.s.work@yandex.ru'],
            [
                'name' => 'topgun_admin',
                'password' => Hash::make('topgun@2026'),
            ]
        );
    }
}