<?php

namespace App\Models;
use Illuminate\Support\Str;

use Illuminate\Database\Eloquent\Model;

class Kategori extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['nama', 'is_active'];

    protected static function booted()
    {
        static::creating(function ($model) {
            $model->id = (string) Str::uuid();
        });
    }

    public function pollings()
    {
        return $this->belongsToMany(Polling::class, 'polling_kategori', 'kategori_id', 'polling_id')
                    ->select(['pollings.id', 'pollings.judul']); // Spesifikasi tabel
    }
}
