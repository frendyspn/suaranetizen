<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    protected $fillable = ['title', 'image'];
    
    // Accessor untuk URL gambar penuh
    public function getImageUrlAttribute()
    {
        if ($this->image) {
            // For shared hosting structure: domain.com/api/uploads/galleries/filename.jpg
            return asset('api/uploads/' . $this->image);
        }
        return null;
    }
}
