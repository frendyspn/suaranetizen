<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    protected $fillable = ['title','image_path','link','is_active','sort_order'];

    public function getImageUrlAttribute()
    {
        return asset('api/uploads/'.$this->image_path);
    }
}
