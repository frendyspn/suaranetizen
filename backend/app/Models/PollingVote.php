<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PollingVote extends Model
{
    protected $fillable = ['id_polling', 'user_id', 'nilai'];
}
