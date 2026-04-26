<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CatalogueTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }

    public function test_catalogue_page_is_publicly_available(): void
    {
        $response = $this->get('/catalogue');

        $response->assertOk();
        $response->assertSee('Kauthuk Product Catalogue', false);
    }

    public function test_catalogue_categories_endpoint_returns_only_active_categories(): void
    {
        Category::create(['name' => 'Decor', 'active' => true, 'icon' => 'category-icons/decor.png']);
        Category::create(['name' => 'Hidden', 'active' => false]);

        $response = $this->getJson('/api/catalogue/categories');

        $response
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment([
                'name' => 'Decor',
                'icon' => 'category-icons/decor.png',
                'icon_url' => '/storage/category-icons/decor.png',
            ])
            ->assertJsonMissing(['name' => 'Hidden']);
    }

    public function test_catalogue_products_endpoint_filters_active_products_search_and_category(): void
    {
        $decor = Category::create(['name' => 'Decor', 'active' => true]);
        $gifts = Category::create(['name' => 'Gifts', 'active' => true]);
        $inactiveCategory = Category::create(['name' => 'Inactive', 'active' => false]);

        Product::create([
            'title' => 'Brass Lamp',
            'product_code' => 'DEC-001',
            'category' => (string) $decor->id,
            'selling_price' => 1200,
            'cost_price' => 900,
            'stock_status' => true,
            'stock_count' => 4,
            'status' => 'active',
            'active' => true,
        ]);

        Product::create([
            'title' => 'Gift Box',
            'product_code' => 'GFT-002',
            'category' => (string) $gifts->id,
            'selling_price' => 800,
            'cost_price' => 500,
            'stock_status' => true,
            'stock_count' => 2,
            'status' => 'active',
            'active' => true,
        ]);

        Product::create([
            'title' => 'Inactive Product',
            'product_code' => 'DEC-003',
            'category' => (string) $decor->id,
            'selling_price' => 500,
            'cost_price' => 300,
            'stock_status' => true,
            'stock_count' => 1,
            'status' => 'active',
            'active' => false,
        ]);

        Product::create([
            'title' => 'Hidden By Category',
            'product_code' => 'CAT-004',
            'category' => (string) $inactiveCategory->id,
            'selling_price' => 500,
            'cost_price' => 300,
            'stock_status' => true,
            'stock_count' => 1,
            'status' => 'active',
            'active' => true,
        ]);

        $filteredResponse = $this->getJson("/api/catalogue/products?category={$decor->id}&search=Lamp");

        $filteredResponse
            ->assertOk()
            ->assertJsonPath('data.0.title', 'Brass Lamp')
            ->assertJsonCount(1, 'data');

        $fullResponse = $this->getJson('/api/catalogue/products');

        $fullResponse
            ->assertOk()
            ->assertJsonFragment(['title' => 'Brass Lamp'])
            ->assertJsonFragment(['title' => 'Gift Box'])
            ->assertJsonMissing(['title' => 'Inactive Product'])
            ->assertJsonMissing(['title' => 'Hidden By Category']);
    }

    public function test_catalogue_products_endpoint_returns_ordered_image_arrays(): void
    {
        $decor = Category::create(['name' => 'Decor', 'active' => true]);

        $product = Product::create([
            'title' => 'Gallery Product',
            'product_code' => 'DEC-100',
            'category' => (string) $decor->id,
            'selling_price' => 1000,
            'cost_price' => 700,
            'stock_status' => true,
            'stock_count' => 3,
            'status' => 'active',
            'active' => true,
            'image' => 'product_images/primary.jpg',
        ]);

        ProductImage::create([
            'product_id' => $product->id,
            'image_path' => 'product_images/gallery-2.jpg',
            'sort_order' => 1,
        ]);

        ProductImage::create([
            'product_id' => $product->id,
            'image_path' => 'product_images/gallery-1.jpg',
            'sort_order' => 0,
        ]);

        $response = $this->getJson('/api/catalogue/products');

        $response
            ->assertOk()
            ->assertJsonPath('data.0.images.0.source', 'primary')
            ->assertJsonPath('data.0.images.1.source', 'gallery')
            ->assertJsonPath('data.0.images.1.sort_order', 0)
            ->assertJsonPath('data.0.images.2.sort_order', 1);
    }
}
