<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class CategoryController extends Controller
{
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
            'name' => 'required|string|max:255|unique:categories,name'
        ], [
            'name.unique' => 'The category name has already been taken. Please choose a different name.'
        ]);
        $category = Category::create([
            'name' => $request->name
        ]);
        return redirect()->route('products.category.index')
            ->with('success', 'Category created successfully');
    }
    public function edit(category $category){
        return Inertia::render('Products/Edit-Category', [
            'category' => [
                'name' => $category->name,
                'id'   => $category->id
            ]
        ]);
    }
    public function update(Request $request, Category $category){
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id
        ], [
            'name.unique' => 'The category name has already been taken. Please choose a different name.'
        ]);
        $category->update([
            'name' => $request->name
        ]);
        return redirect()->route('products.category.index')
            ->with('success', 'Category updated successfully');
    }
    public function destroy(Category $category){
        try {
            $category->update([
                'active' => 0,
                'deleted_by' => auth()->id()
            ]);
            
            $category->delete();
            
            return redirect()->route('products.category.index')
                ->with('success', 'Category deleted successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete category: ' . $e->getMessage());
        }
    }
} 