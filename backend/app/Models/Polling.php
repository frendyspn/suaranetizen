<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Polling extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'kalimat',
        'kategori_id',
        'kategori_ids',
        'custom_name',
        'is_anonymous',
        'donasi_id', 
        'status',
        'nominal',
        'id_payment',
        'qris_url',
        'payment_response'
    ];

    protected $casts = [
        'kategori_ids' => 'array',
        'is_anonymous' => 'boolean'
    ];

    protected static function booted()
    {
        static::creating(function ($polling) {
            $polling->id = (string) Str::uuid();
        });
    }

    // Multiple categories relationship
    public function kategori()
    {
        return $this->belongsToMany(Kategori::class, 'polling_kategori', 'polling_id', 'kategori_id')
                    ->select(['kategoris.id', 'kategoris.nama']); // Spesifikasi tabel
    }

    // Alternative method name for consistency
    public function kategoris()
    {
        return $this->kategori();
    }

    // Polling votes relationship
    public function pollingVotes()
    {
        return $this->hasMany(PollingVote::class, 'id_polling');
    }

    // User relationship
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Donasi relationship
    public function donasi()
    {
        return $this->belongsTo(Donasi::class);
    }
}
