<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\UploadedFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CategoryController extends Controller
{
    private function storeCategoryIcon(UploadedFile $file): string
    {
        $fileName = time() . '_' . str_replace(' ', '_', $file->getClientOriginalName());
        $relativePath = $file->storeAs('category-icons', $fileName, 'public');
        $this->syncPublicIcon($relativePath);

        return $relativePath;
    }

    private function syncPublicIcon(?string $relativePath): void
    {
        if (!$relativePath) {
            return;
        }

        $source = storage_path('app/public/' . $relativePath);
        $destination = public_path('storage/' . $relativePath);

        if (!file_exists($source)) {
            return;
        }

        File::ensureDirectoryExists(dirname($destination));
        File::copy($source, $destination);
    }

    private function deletePublicIcon(?string $relativePath): void
    {
        if (!$relativePath) {
            return;
        }

        $publicPath = public_path('storage/' . $relativePath);

        if (file_exists($publicPath)) {
            @unlink($publicPath);
        }
    }

    private function deleteStoredIcon(?string $relativePath): void
    {
        if (!$relativePath) {
            return;
        }

        if (Storage::disk('public')->exists($relativePath)) {
            Storage::disk('public')->delete($relativePath);
        }

        $this->deletePublicIcon($relativePath);
    }

    public function index(){
        $categories = Category::where('active', 1)
        ->latest()
        ->paginate(10);

        return Inertia::render('Products/Category', [
            'categories' => $categories
        ]);
    }
    public function add(){
        return Inertia::render('Products/Add-Category');
    }
    public function store(Request $request){
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'icon' => 'nullable|file|mimes:jpg,jpeg,png,webp,svg|max:2048',
        ], [
            'name.unique' => 'The category name has already been taken. Please choose a different name.'
        ]);

        $iconPath = null;

        try {
            if ($request->hasFile('icon')) {
                $iconPath = $this->storeCategoryIcon($request->file('icon'));
            }

            Category::create([
                'name' => $request->name,
                'icon' => $iconPath,
            ]);

            return redirect()->route('products.category.index')
                ->with('success', 'Category created successfully');
        } catch (\Exception $e) {
            $this->deleteStoredIcon($iconPath);

            return redirect()->back()
                ->withErrors(['icon' => 'Failed to upload category icon. Please try again.'])
                ->withInput();
        }
    }
    public function edit(Category $category){
        return Inertia::render('Products/Edit-Category', [
            'category' => [
                'name' => $category->name,
                'id'   => $category->id,
                'icon' => $category->icon,
                'icon_url' => $category->icon_url,
            ]
        ]);
    }
    public function update(Request $request, Category $category){
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'icon' => 'nullable|file|mimes:jpg,jpeg,png,webp,svg|max:2048',
        ], [
            'name.unique' => 'The category name has already been taken. Please choose a different name.'
        ]);

        $iconPath = $category->icon;
        $previousIconPath = $category->icon;

        try {
            if ($request->hasFile('icon')) {
                $iconPath = $this->storeCategoryIcon($request->file('icon'));
            }

            $category->update([
                'name' => $request->name,
                'icon' => $iconPath,
            ]);

            if ($request->hasFile('icon')) {
                $this->deleteStoredIcon($previousIconPath);
            }

            return redirect()->route('products.category.index')
                ->with('success', 'Category updated successfully');
        } catch (\Exception $e) {
            if ($iconPath !== $previousIconPath) {
                $this->deleteStoredIcon($iconPath);
            }

            return redirect()->back()
                ->withErrors(['icon' => 'Failed to update category icon. Please try again.'])
                ->withInput();
        }
    }
    public function destroy(Category $category){
        try {
            DB::transaction(function () use ($category) {
                $category->update([
                    'active' => 0,
                    'deleted_by' => auth()->id()
                ]);

                $category->delete();
            });

            $this->deleteStoredIcon($category->icon);
            
            return redirect()->route('products.category.index')
                ->with('success', 'Category deleted successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete category: ' . $e->getMessage());
        }
    }
} 
