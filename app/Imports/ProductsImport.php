<?php

namespace App\Imports;

use App\Models\Product;
use App\Models\Category;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Illuminate\Support\Facades\Log;

class ProductsImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnError, WithChunkReading
{
    use SkipsErrors;
    
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        Log::info('Importing product row', $row);
        
        // Always generate a product code based on the category
        $productCode = $this->generateProductCode($row['category']);
        
        return new Product([
            'title' => $row['title'],
            'product_code' => $productCode,
            'category' => $row['category'],
            'selling_price' => $row['selling_price'],
            'cost_price' => $row['cost_price'],
            'stock_status' => 1, // Default to in stock
            'status' => 'active',
            'hsncode' => $row['hsncode'] ?? null,
            'quantitylimit' => $row['quantitylimit'] ?? 0,
            'gst' => $row['gst'] ?? 0,
            'stock_count' => $row['stock_count'] ?? 0,
        ]);
    }
    
    /**
     * Generate a product code using the same logic as the frontend
     * 
     * @param int $categoryId
     * @return string
     */
    private function generateProductCode($categoryId)
    {
        try {
            // Get the category name from the category ID
            $category = Category::find($categoryId);
            
            if (!$category) {
                Log::warning("Category ID {$categoryId} not found. Using fallback product code generation.");
                return 'PROD-' . time() . '-' . rand(1000, 9999);
            }
            
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
            
            Log::info("Generated product code {$productCode} for category {$word}");
            return $productCode;
            
        } catch (\Exception $e) {
            Log::error("Error generating product code: " . $e->getMessage());
            return 'PROD-' . time() . '-' . rand(1000, 9999);
        }
    }
    
    /**
     * @return array
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'category' => 'required',
            'selling_price' => 'required|numeric',
            'cost_price' => 'required|numeric',
            'hsncode' => 'nullable|string|max:255',
            'gst' => 'nullable|numeric',
            'stock_count' => 'nullable|integer',
            'quantitylimit' => 'nullable|integer',
        ];
    }
    
    /**
     * @return int
     */
    public function chunkSize(): int
    {
        return 100;
    }
} 