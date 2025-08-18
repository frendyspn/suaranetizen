<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Team extends Model
{
    public $incrementing = false;
    protected $keyType = 'uuid';
    protected $fillable = ['name', 'position', 'photo'];

    protected static function boot() {
        parent::boot();
        static::creating(function ($model) {
            $model->id = (string) Str::uuid();
        });
    }
    
    // Accessor untuk URL foto penuh
    public function getPhotoUrlAttribute()
    {
        if ($this->photo) {
            // For shared hosting structure: domain.com/api/uploads/teams/filename.jpg
            return asset('api/uploads/' . $this->photo);
        }
        return null;
    }
}
