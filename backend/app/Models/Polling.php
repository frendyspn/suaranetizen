<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Polling extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['kalimat', 'user_id', 'donasi_id', 'status'];

    protected static function booted()
    {
        static::creating(function ($polling) {
            $polling->id = (string) Str::uuid();
        });
    }

    public function user() {
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
        return $this->hasMany(PollingVote::class, 'id_polling', 'id')->where('nilai', 1);
    }
}
