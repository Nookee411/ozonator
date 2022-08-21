<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    public const FIRST_PRODUCT_CHECK = 1;
    public const PRODUCT_RECHECK = 2;
    
    use HasFactory;

    protected $fillable = [
        'type',
        'product_id',
    ];

    public function product(){
        return $this->belongsTo(Product::class);
    }
}
