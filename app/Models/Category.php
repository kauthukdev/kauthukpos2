<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Category extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'slug', 'active', 'deleted_by', 'icon'];

    protected $appends = ['icon_url'];

    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public static function getAllCategories()
    {
        return self::where('active', 1)->get();
    }

    public function getIconUrlAttribute(): ?string
    {
        if (!$this->icon) {
            return null;
        }

        return Storage::url($this->icon);
    }
}
