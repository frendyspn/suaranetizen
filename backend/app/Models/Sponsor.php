<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Sponsor extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'image'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Accessor untuk URL gambar penuh
    public function getImageUrlAttribute()
    {
        if ($this->image) {
            // For shared hosting structure: domain.com/api/uploads/sponsors/filename.jpg
            return asset('api/uploads/' . $this->image);
        }
        return null;
    }
}
