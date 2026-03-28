<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Tests\TestCase;

class ProductMultiImageTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }

    protected function tearDown(): void
    {
        File::deleteDirectory(storage_path('app/public/product_images'));
        File::deleteDirectory(public_path('storage/product_images'));

        parent::tearDown();
    }

    public function test_product_can_be_created_with_primary_and_gallery_images(): void
    {
        $user = $this->createAdminUser();
        $category = Category::create(['name' => 'Clocks', 'active' => true]);

        $response = $this->actingAs($user)->post(route('products.store'), [
            'title' => 'Pocket Watch',
            'product_code' => 'CLK-101',
            'category' => (string) $category->id,
            'selling_price' => 1200,
            'cost_price' => 800,
            'stock_status' => '1',
            'hsncode' => '1234',
            'gst' => 18,
            'stock_count' => 5,
            'image' => UploadedFile::fake()->image('primary.jpg'),
            'additional_images' => [
                UploadedFile::fake()->image('gallery-1.jpg'),
                UploadedFile::fake()->image('gallery-2.jpg'),
            ],
        ]);

        $response->assertRedirect(route('products.index'));

        $product = Product::where('product_code', 'CLK-101')->firstOrFail();

        $this->assertNotNull($product->image);
        $this->assertCount(2, $product->galleryImages);
        $this->assertSame([0, 1], $product->galleryImages->pluck('sort_order')->all());
    }

    public function test_product_gallery_can_be_reordered_deleted_and_appended(): void
    {
        $user = $this->createAdminUser();
        $category = Category::create(['name' => 'Clocks', 'active' => true]);

        $product = Product::create([
            'title' => 'Pocket Watch',
            'product_code' => 'CLK-102',
            'category' => (string) $category->id,
            'selling_price' => 1200,
            'cost_price' => 800,
            'stock_status' => true,
            'status' => 'active',
            'active' => true,
            'hsncode' => '1234',
            'gst' => 18,
            'stock_count' => 5,
        ]);

        $first = $product->galleryImages()->create(['image_path' => 'product_images/first.jpg', 'sort_order' => 0]);
        $second = $product->galleryImages()->create(['image_path' => 'product_images/second.jpg', 'sort_order' => 1]);

        File::ensureDirectoryExists(storage_path('app/public/product_images'));
        File::ensureDirectoryExists(public_path('storage/product_images'));
        File::put(storage_path('app/public/' . $first->image_path), 'first');
        File::put(storage_path('app/public/' . $second->image_path), 'second');
        File::put(public_path('storage/' . $first->image_path), 'first');
        File::put(public_path('storage/' . $second->image_path), 'second');

        $response = $this->actingAs($user)->post(route('products.update', $product), [
            '_method' => 'PUT',
            'title' => 'Pocket Watch',
            'product_code' => 'CLK-102',
            'category' => (string) $category->id,
            'selling_price' => 1200,
            'cost_price' => 800,
            'stock_status' => '1',
            'hsncode' => '1234',
            'gst' => 18,
            'stock_count' => 5,
            '_delete_image' => '0',
            'deleted_gallery_images' => json_encode([$first->id]),
            'gallery_order' => json_encode([$second->id]),
            'additional_images' => [
                UploadedFile::fake()->image('gallery-3.jpg'),
            ],
        ], ['Accept' => 'application/json']);

        $response->assertOk();

        $product->refresh();
        $galleryImages = $product->galleryImages()->get();

        $this->assertCount(2, $galleryImages);
        $this->assertFalse($galleryImages->contains('id', $first->id));
        $this->assertSame($second->id, $galleryImages->first()->id);
        $this->assertSame([0, 1], $galleryImages->pluck('sort_order')->all());
    }

    private function createAdminUser(): User
    {
        $user = User::factory()->create();
        $role = Role::create(['name' => 'Admin', 'slug' => 'admin']);
        $user->roles()->attach($role);

        return $user;
    }
}
