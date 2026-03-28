<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CatalogueController extends Controller
{
    public function categories(): JsonResponse
    {
        $categories = Category::query()
            ->select(['id', 'name'])
            ->where('active', true)
            ->orderBy('name')
            ->get();

        return response()->json($categories);
    }

    public function products(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'page' => ['nullable', 'integer', 'min:1'],
            'category' => ['nullable', 'string', 'max:255'],
            'search' => ['nullable', 'string', 'max:255'],
        ]);

        $query = Product::query()
            ->with(['category:id,name,active', 'galleryImages:id,product_id,image_path,sort_order'])
            ->where('active', true)
            ->whereHas('category', function ($categoryQuery) {
                $categoryQuery->where('active', true);
            });

        if (!empty($validated['category'])) {
            $categoryFilter = trim($validated['category']);

            if (ctype_digit($categoryFilter)) {
                $query->where('category', $categoryFilter);
            } else {
                $query->whereHas('category', function ($categoryQuery) use ($categoryFilter) {
                    $categoryQuery->where('name', $categoryFilter);
                });
            }
        }

        if (!empty($validated['search'])) {
            $search = trim($validated['search']);

            $query->where(function ($productQuery) use ($search) {
                $productQuery
                    ->where('title', 'like', "%{$search}%")
                    ->orWhere('product_code', 'like', "%{$search}%");
            });
        }

        $products = $query
            ->latest('id')
            ->paginate(10)
            ->through(function (Product $product) use ($request) {
                $category = $product->relationLoaded('category') ? $product->getRelation('category') : null;
                $images = collect();

                if ($product->image) {
                    $images->push([
                        'url' => $request->getBaseUrl() . Storage::url($product->image),
                        'source' => 'primary',
                    ]);
                }

                foreach ($product->galleryImages as $galleryImage) {
                    $images->push([
                        'url' => $request->getBaseUrl() . Storage::url($galleryImage->image_path),
                        'source' => 'gallery',
                        'sort_order' => $galleryImage->sort_order,
                    ]);
                }

                $imageUrl = $images->first()['url'] ?? null;

                return [
                    'id' => $product->id,
                    'title' => $product->title,
                    'product_code' => $product->product_code,
                    'selling_price' => $product->selling_price,
                    'stock_count' => $product->stock_count,
                    'image_url' => $imageUrl,
                    'images' => $images->values()->all(),
                    'category' => $category ? [
                        'id' => $category->id,
                        'name' => $category->name,
                    ] : null,
                ];
            });

        return response()->json($products);
    }
}
