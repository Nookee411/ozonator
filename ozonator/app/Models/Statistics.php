<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Statistics extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'price',
        'discount_price',
        'ozon_card_price',
        'rating',
        'reviews',
        'stock',
        'is_bestseller',
    ];

    public function product() {
        return $this->belongsTo(Product::class);
    }
}
