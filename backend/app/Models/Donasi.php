<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Donasi extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['nama_donasi', 'target', 'is_active', 'status', 'expired_date'];

    protected static function booted()
    {
        static::creating(function ($donasi) {
            $donasi->id = (string) Str::uuid();
        });
    }
}
