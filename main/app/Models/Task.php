<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    public const FIRST_PRODUCT_CHECK = 1;
    public const PRODUCT_RECHECK = 2;

    public const STATUS_PENDING = 1;
    public const STATUS_SUCCESS = 2;
    public const STATUS_ERROR = 3;
    
    use HasFactory;

    protected $fillable = [
        'type',
        'product_id',
        'status'
    ];

    public function product(){
        return $this->belongsTo(Product::class);
    }
}
