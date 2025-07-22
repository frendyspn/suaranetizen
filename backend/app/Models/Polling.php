<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Polling extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
        'kalimat',
        'kategori_id', // Keep for backward compatibility
        'kategori_ids', // New field for multiple categories
        'is_anonymous',
        'qr_image',
        'is_paid'
    ];

    protected $casts = [
        'kategori_ids' => 'array', // Cast JSON to array
        'is_anonymous' => 'boolean'
    ];

    protected static function booted()
    {
        static::creating(function ($polling) {
            $polling->id = (string) Str::uuid();
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function donasi() {
        return $this->belongsTo(Donasi::class);
    }

    public function kategori() {
        return $this->belongsTo(Kategori::class);
    }

    public function pollingVotes()
    {
        return $this->belongsToMany(Kategori::class, 'polling_kategori', 'polling_id', 'kategori_id');
    }

    // Accessor to get display name (anonymous or real name)
    public function getDisplayNameAttribute()
    {
        return $this->is_anonymous ? 'Anonim' : $this->user->name;
    }

    public function kategoris()
    {
        return $this->belongsToMany(Kategori::class, 'polling_kategori', 'polling_id', 'kategori_id');
    }
}
