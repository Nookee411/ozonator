<?php

namespace App\Models;

use Illuminate\Console\View\Components\Task;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'ozon_id',
        'title',
        'seller_id',
    ];

    public function users() {
        return $this->belongsTo(User::class);
    }

    public function tasks() {
        return $this->hasMany(Task::class);
    }

    public function statistics() {
        return $this->hasMany(Statistics::class);
    }

    public function seller() {
        return $this->belongsTo(Seller::class);
    }
}
