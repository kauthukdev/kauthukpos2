<?php

namespace App\Imports;

use App\Models\Product;
use App\Models\Category;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Illuminate\Support\Facades\Log;

class ProductsImport implements ToModel, WithHeadingRow, WithChunkReading
{
    /**
     * Store all rows with their errors
     */
    protected $results = [];
    
    /**
     * Store the current row number
     */
    protected $currentRow = 1; // Start at 1 because row 1 is headers
    
    /**
     * Count of successfully imported products
     */
    protected $importedCount = 0;
    
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        $this->currentRow++;
        $errors = [];
        
        // Store the original row data
        $rowData = [
            'title' => $row['title'] ?? '',
            'category' => $row['category'] ?? '',
            'hsncode' => $row['hsncode'] ?? '',
            'gst' => $row['gst'] ?? '',
            'cost_price' => $row['cost_price'] ?? '',
            'selling_price' => $row['selling_price'] ?? '',
            'stock_count' => $row['stock_count'] ?? '',
            'stock_status' => $row['stock_status'] ?? '',
        ];
        
        // Skip empty rows or rows without a title (like the notes section)
        if (empty($row['title']) || empty(trim($row['title'] ?? ''))) {
            // Don't add empty rows to results
            return null;
        }
        
        // Validate required fields
        if (empty(trim($row['title'] ?? ''))) {
            $errors[] = 'Title is required';
        }
        
        $categoryName = trim($row['category'] ?? '');
        if (empty($categoryName)) {
            $errors[] = 'Category is required';
        }
        
        if (empty($row['cost_price']) && $row['cost_price'] !== '0' && $row['cost_price'] !== 0) {
            $errors[] = 'Cost price is required';
        } elseif (!is_numeric($row['cost_price'])) {
            $errors[] = 'Cost price must be a number';
        }
        
        if (empty($row['selling_price']) && $row['selling_price'] !== '0' && $row['selling_price'] !== 0) {
            $errors[] = 'Selling price is required';
        } elseif (!is_numeric($row['selling_price'])) {
            $errors[] = 'Selling price must be a number';
        }
        
        // Find category by name
        $category = null;
        $categoryId = null;
        
        if (!empty($categoryName)) {
            $category = Category::where('name', $categoryName)->first();
            if (!$category) {
                $errors[] = "Category '{$categoryName}' not found in system";
            } else {
                $categoryId = $category->id;
            }
        }
        
        // If there are errors, add to results and skip this row
        if (!empty($errors)) {
            $rowData['errors'] = implode(', ', $errors);
            $rowData['status'] = 'Failed';
            $this->results[] = $rowData;
            Log::warning("Row {$this->currentRow} has errors: " . implode(', ', $errors));
            return null;
        }
        
        // Generate product code
        $productCode = $this->generateProductCode($category);
        
        try {
            $product = new Product([
                'title' => $row['title'],
                'product_code' => $productCode,
                'category' => $categoryId,
                'selling_price' => $row['selling_price'],
                'cost_price' => $row['cost_price'],
                'stock_status' => isset($row['stock_status']) ? $row['stock_status'] : 1,
                'status' => 'active',
                'hsncode' => $row['hsncode'] ?? null,
                'quantitylimit' => $row['quantitylimit'] ?? 0,
                'gst' => $row['gst'] ?? 0,
                'stock_count' => $row['stock_count'] ?? 0,
            ]);
            
            $rowData['errors'] = '';
            $rowData['status'] = 'Success';
            $this->results[] = $rowData;
            $this->importedCount++;
            
            Log::info("Successfully prepared product: {$row['title']}");
            
            return $product;
            
        } catch (\Exception $e) {
            $rowData['errors'] = 'Database error: ' . $e->getMessage();
            $rowData['status'] = 'Failed';
            $this->results[] = $rowData;
            Log::error("Error creating product: " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Generate a product code using the category name
     * 
     * @param \App\Models\Category $category
     * @return string
     */
    private function generateProductCode($category)
    {
        try {
            $word = $category->name;
            
            // Remove vowels and keep only the first 3 consonants
            $abbreviation = preg_replace('/[AEIOU]/i', '', strtoupper($word));
            $abbreviation = substr($abbreviation, 0, 3);
            
            // Ensure it's exactly 3 characters (fallback if consonants are fewer)
            if (strlen($abbreviation) < 3) {
                $abbreviation = str_pad($abbreviation, 3, strtoupper($word[0] ?? 'X'));
            }
            
            // Append a random 3-digit number
            $productCode = $abbreviation . '-' . rand(100, 999);
            
            return $productCode;
            
        } catch (\Exception $e) {
            return 'PROD-' . time() . '-' . rand(1000, 9999);
        }
    }
    
    /**
     * Get all results with errors
     * 
     * @return array
     */
    public function getResults(): array
    {
        return $this->results;
    }
    
    /**
     * Get count of successfully imported products
     * 
     * @return int
     */
    public function getImportedCount(): int
    {
        return $this->importedCount;
    }
    
    /**
     * Get count of failed rows
     * 
     * @return int
     */
    public function getFailedCount(): int
    {
        return count(array_filter($this->results, function($row) {
            return $row['status'] === 'Failed';
        }));
    }
    
    /**
     * @return int
     */
    public function chunkSize(): int
    {
        return 100;
    }
} 