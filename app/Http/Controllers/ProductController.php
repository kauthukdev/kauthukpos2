<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Imports\ProductsImport;
use Maatwebsite\Excel\Facades\Excel;

class ProductController extends Controller
{ 
    public function index(Request $request)
    {
        $query = Product::with('category:id,name');
        
        // Apply search filter if provided
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('title', 'like', "%{$searchTerm}%")
                  ->orWhere('product_code', 'like', "%{$searchTerm}%");
            });
        }
        
        // Set a smaller per-page value for testing pagination
        $perPage = 20;
        $products = $query->latest()->paginate($perPage)->withQueryString();
        
        // Add links array for pagination
        $products->links = $this->getPaginationLinks($products);
        
        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters' => $request->only('search')
        ]);
    }

    /**
     * Generate pagination links array for Inertia
     */
    private function getPaginationLinks($paginator)
    {
        $links = [];
        
        // Previous page link
        $links[] = [
            'url' => $paginator->previousPageUrl(),
            'label' => '&laquo; Previous',
            'active' => false
        ];
        
        // Page links
        for ($i = 1; $i <= $paginator->lastPage(); $i++) {
            $links[] = [
                'url' => $paginator->url($i),
                'label' => (string) $i,
                'active' => $i === $paginator->currentPage()
            ];
        }
        
        // Next page link
        $links[] = [
            'url' => $paginator->nextPageUrl(),
            'label' => 'Next &raquo;',
            'active' => false
        ];
        
        return $links;
    }

    public function create()
    {
        $categories = Category::getAllCategories();
        return Inertia::render('Products/Create', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        \Log::info('Store Product Request Data:', $request->all());
        
        if ($request->hasFile('image')) {
             \Log::info('Image details:', [
                 'original_name' => $request->file('image')->getClientOriginalName(),
                 'mime' => $request->file('image')->getMimeType(),
                 'size' => $request->file('image')->getSize(),
                 'error' => $request->file('image')->getError(),
             ]);
        } else {
            \Log::info('No image file detected in request.');
        }

        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'product_code' => 'required|string|max:255|unique:products',
            'category' => 'required',
            'selling_price' => 'required|numeric',
            'cost_price'  =>  'required|numeric',
            'stock_status' => 'required|boolean',
            'hsncode' => 'nullable|string|max:255',
            'gst' => 'nullable|numeric',
            'stock_count' => 'required|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            \Log::error('Product creation validation failed:', $validator->errors()->toArray());
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            try {
                $file = $request->file('image');
                $fileName = time() . '_' . $file->getClientOriginalName();
                // Use storage driver to store the file
                $path = $file->storeAs('product_images', $fileName, 'public');
                $imagePath = $path; // This will return 'product_images/filename.ext' relative to storage/app/public
                
                \Log::info('Image stored successfully at: ' . $imagePath);
                
                // Verify file existence immediately
                if (file_exists(storage_path('app/public/' . $imagePath))) {
                    \Log::info('Verified file exists on disk: ' . storage_path('app/public/' . $imagePath));
                } else {
                    \Log::error('File does NOT exist on disk after storeAs: ' . storage_path('app/public/' . $imagePath));
                }
                
            } catch (\Exception $e) {
                \Log::error('Failed to upload image in store: ' . $e->getMessage());
                \Log::error($e->getTraceAsString());
            }
        }

        try {
            $product = Product::create([
                'title' => $request->title,
                'product_code' => $request->product_code,
                'category' => $request->category,
                'selling_price' => $request->selling_price,
                'cost_price' => $request->cost_price,
                'stock_status' => $request->stock_status,
                'status' => $request->status ?? 'active', // Ensure status has a default
                'image' => $imagePath,
                'hsncode' => $request->hsncode,
                'gst' => $request->gst,
                'stock_count' => $request->stock_count
            ]);
            
            \Log::info('Product created successfully with ID: ' . $product->id);
            return redirect()->route('products.index')->with('success', 'Product created successfully.');
            
        } catch (\Exception $e) {
            \Log::error('Error creating product in DB: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Failed to create product via DB: ' . $e->getMessage()])->withInput();
        }
    }

    public function edit(Product $product)
    {
        return Inertia::render('Products/Edit', [
            'product' => [
                'id' => $product->id,
                'name' => $product->title,
                'product_code' => $product->product_code,
                'price' => $product->selling_price,
                'cost_price' => $product->cost_price,
                'stock_status' => (bool)$product->stock_status,
                'hsncode' => $product->hsncode,
                'stock_count' => $product->stock_count,
                'stock_count' => $product->stock_count,
                'gst' => $product->gst,
                'image' => $product->image,
                'category' => $product->category()->exists() ? [
                    'id' => $product->category()->first()->id,
                    'name' => $product->category()->first()->name
                ] : null
            ],
            'categories' => Category::all()
        ]);
    }

    public function update(Request $request, Product $product)
    {
        \Log::info('Update request data:', $request->all());
        \Log::info('Has file image?', ['hasFile' => $request->hasFile('image')]);
        \Log::info('_delete_image value:', [
            '_delete_image' => $request->input('_delete_image'),
            'type' => gettype($request->input('_delete_image')),
            'raw' => $request->input('_delete_image')
        ]);
        \Log::info('Current product image:', ['image' => $product->image]);
        
        if ($request->hasFile('image')) {
            \Log::info('Image file details:', [
                'name' => $request->file('image')->getClientOriginalName(),
                'size' => $request->file('image')->getSize(),
                'mime' => $request->file('image')->getMimeType(),
                'extension' => $request->file('image')->getClientOriginalExtension(),
                'is_valid' => $request->file('image')->isValid(),
                'error' => $request->file('image')->getError()
            ]);
        }
        
        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'product_code' => 'required|string|max:255',
                'category' => 'required',
                'selling_price' => 'required|numeric',
                'cost_price' => 'required|numeric',
                'stock_status' => 'required|boolean',
                'hsncode' => 'nullable|string|max:255',
                'stock_status' => 'required|boolean',
                'hsncode' => 'nullable|string|max:255',
                'gst' => 'nullable|numeric',
                'stock_count' => 'required|integer',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                '_delete_image' => 'nullable'
            ]);
            
            $updateData = [
                'title' => $request->title,
                'product_code' => $request->product_code,
                'category' => $request->category,
                'selling_price' => $request->selling_price,
                'cost_price' => $request->cost_price,
                'stock_status' => $request->boolean('stock_status'),
                'hsncode' => $request->hsncode,
                'hsncode' => $request->hsncode,
                'gst' => $request->gst,
                'stock_count' => $request->stock_count
            ];

            // Handle image deletion
            if ($request->has('_delete_image') && 
                (
                    $request->input('_delete_image') === '1' || 
                    $request->input('_delete_image') === 1 || 
                    $request->input('_delete_image') === true || 
                    $request->input('_delete_image') === 'true'
                )
            ) {
                \Log::info('Deleting image for product: ' . $product->id);
                // Delete the existing image file if it exists
                if ($product->image && \Illuminate\Support\Facades\Storage::disk('public')->exists($product->image)) {
                    try {
                        \Illuminate\Support\Facades\Storage::disk('public')->delete($product->image);
                        \Log::info('Image file deleted from storage: ' . $product->image);
                    } catch (\Exception $e) {
                        \Log::error('Failed to delete image file: ' . $e->getMessage());
                    }
                } else {
                    \Log::info('Image file not found or already deleted: ' . ($product->image ?? 'null'));
                }
                $updateData['image'] = null;
            }
            // Handle image upload if a new image is provided
            elseif ($request->hasFile('image')) {
                \Log::info('Uploading new image for product: ' . $product->id);
                \Log::info('Image file details:', [
                    'name' => $request->file('image')->getClientOriginalName(),
                    'size' => $request->file('image')->getSize(),
                    'mime' => $request->file('image')->getMimeType(),
                    'extension' => $request->file('image')->getClientOriginalExtension(),
                    'is_valid' => $request->file('image')->isValid(),
                    'error' => $request->file('image')->getError()
                ]);
                
                try {
                    // Delete the existing image file if it exists
                    if ($product->image && \Illuminate\Support\Facades\Storage::disk('public')->exists($product->image)) {
                         \Illuminate\Support\Facades\Storage::disk('public')->delete($product->image);
                        \Log::info('Previous image deleted from storage: ' . $product->image);
                    }
                    
                    // Use storage driver to store the file
                    $file = $request->file('image');
                    $fileName = time() . '_' . $file->getClientOriginalName();
                    
                    $path = $file->storeAs('product_images', $fileName, 'public');
                    $updateData['image'] = $path; // 'product_images/filename.ext'
                    
                    \Log::info('New image stored at: ' . $updateData['image']);
                    
                    // Verify file existence immediately
                    if (file_exists(storage_path('app/public/' . $updateData['image']))) {
                        \Log::info('Verified file exists on disk: ' . storage_path('app/public/' . $updateData['image']));
                    } else {
                        \Log::error('File does NOT exist on disk after storeAs: ' . storage_path('app/public/' . $updateData['image']));
                    }
                    
                } catch (\Exception $e) {
                    \Log::error('Error handling image upload: ' . $e->getMessage());
                    \Log::error('Error trace: ' . $e->getTraceAsString());
                    throw new \Exception('Failed to upload image: ' . $e->getMessage());
                }
            } else {
                \Log::info('No image changes for product: ' . $product->id);
            }

            \Log::info('Update data:', $updateData);
            $result = $product->update($updateData);
            \Log::info('Update result:', [$result]);

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Product updated successfully',
                    'product' => $product->fresh()
                ]);
            }
            
            return redirect()->route('products.index')->with('success', 'Product updated successfully');
        } catch (\Exception $e) {
            \Log::error('Error updating product: ' . $e->getMessage());
            
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage()
                ], 422);
            }
            
            return redirect()->back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }
    
    /**
     * Remove the specified product from storage.
     */
    public function destroy(Product $product)
    {
        try {
            // Soft delete logic
            $product->update([
                'deleted_by' => auth()->id(),
                'active' => false
            ]);
            
            // Delete the product (triggers soft delete)
            $product->delete();
            
            \Log::info('Product soft deleted: ' . $product->id . ' by user: ' . auth()->id());
            
            if (request()->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Product deleted successfully'
                ]);
            }
            
            return redirect()->route('products.index')->with('success', 'Product deleted successfully');
        } catch (\Exception $e) {
            \Log::error('Error deleting product: ' . $e->getMessage());
            
            if (request()->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage()
                ], 422);
            }
            
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Show the form for bulk uploading products.
     */
    public function showBulkUploadForm()
    {
        $categories = Category::all();
        return Inertia::render('Products/BulkUpload', [
            'categories' => $categories
        ]);
    }
    
    /**
     * Process the bulk upload of products.
     */
    public function processBulkUpload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv',
        ]);
        
        try {
            $import = new ProductsImport();
            Excel::import($import, $request->file('file'));
            
            return redirect()->route('products.index')->with('success', 'Products imported successfully.');
        } catch (\Exception $e) {
            \Log::error('Error importing products: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            
            return redirect()->back()->withErrors(['error' => 'Failed to import products: ' . $e->getMessage()]);
        }
    }
    
    /**
     * Download a sample Excel template for product import.
     */
    public function downloadTemplate()
    {
        try {
            $filePath = public_path('templates/product_import_template.xlsx');
            
            \Log::info('Download template requested. File path: ' . $filePath);
            \Log::info('File exists: ' . (file_exists($filePath) ? 'Yes' : 'No'));
            
            // Check if the template exists, if not create it
            if (!file_exists($filePath)) {
                \Log::info('Creating template file...');
                $this->createTemplateFile();
                \Log::info('Template file created.');
            }
            
            // Set headers for file download
            $headers = [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition' => 'attachment; filename="product_import_template.xlsx"',
                'Cache-Control' => 'max-age=0',
            ];
            
            \Log::info('Returning file download response.');
            return response()->file($filePath, $headers);
        } catch (\Exception $e) {
            \Log::error('Error downloading template: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            
            return redirect()->back()->withErrors(['error' => 'Failed to download template: ' . $e->getMessage()]);
        }
    }
    
    /**
     * Create a sample Excel template file.
     */
    private function createTemplateFile()
    {
        try {
            // Ensure the templates directory exists
            $templatesDir = public_path('templates');
            \Log::info('Templates directory: ' . $templatesDir);
            \Log::info('Templates directory exists: ' . (file_exists($templatesDir) ? 'Yes' : 'No'));
            
            if (!file_exists($templatesDir)) {
                \Log::info('Creating templates directory...');
                $result = mkdir($templatesDir, 0755, true);
                \Log::info('Templates directory created: ' . ($result ? 'Success' : 'Failed'));
            }
            
            // Create a new spreadsheet
            \Log::info('Creating new spreadsheet...');
            $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            
            // Set headers
            \Log::info('Setting headers...');
            $headers = ['title', 'category', 'hsncode', 'gst', 'cost_price', 'selling_price', 'stock_count'];
            $sheet->fromArray([$headers], NULL, 'A1');
            
            // Add some sample data
            \Log::info('Adding sample data...');
            $sampleData = [
                ['Sample Product 1', '1', 'HSN123456', '18', '100', '150', '10'],
                ['Sample Product 2', '2', 'HSN789012', '12', '200', '250', '20'],
            ];
            $sheet->fromArray($sampleData, NULL, 'A2');
            
            // Add notes about product code generation
            $sheet->setCellValue('J1', 'Notes:');
            $sheet->setCellValue('J2', '1. Product codes will be automatically generated based on the category name.');
            $sheet->setCellValue('J3', '2. Category must be a valid category ID from the system.');
            $sheet->setCellValue('J4', '3. Required fields: title, category, cost_price, selling_price');
            
            // Auto-size columns
            \Log::info('Auto-sizing columns...');
            foreach (range('A', 'K') as $col) {
                $sheet->getColumnDimension($col)->setAutoSize(true);
            }
            
            // Save the file
            $filePath = public_path('templates/product_import_template.xlsx');
            \Log::info('Saving file to: ' . $filePath);
            $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
            $writer->save($filePath);
            \Log::info('File saved successfully.');
        } catch (\Exception $e) {
            \Log::error('Error creating template file: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            throw $e;
        }
    }
} 