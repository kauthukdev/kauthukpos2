<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'product_code',
        'category',
        'selling_price',
        'cost_price',
        'stock_status',
        'status',
        'image',
        'name',
        'price',
        'hsncode',
        'active',
        'deleted_by',
        'gst',
        'stock_count'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category');
    }

    public function galleryImages()
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order')->orderBy('id');
    }

    public function hasCategory($category)
    {
        return $this->category()->where('slug', $category)->exists();
    }
}
