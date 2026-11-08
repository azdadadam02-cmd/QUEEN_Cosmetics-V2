<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class ImageUploader
{
    public function store(?UploadedFile $file, string $nom): ?string
    {
        if (! $file) {
            return null;
        }

        $ext  = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'][$file->getMimeType()] ?? 'jpg';
        $slug = Str::limit(Str::slug($nom) ?: 'image', 40, '');
        $name = $slug.'-'.bin2hex(random_bytes(4)).'.'.$ext;

        $file->move(public_path('images'), $name);

        return $name;
    }
}
