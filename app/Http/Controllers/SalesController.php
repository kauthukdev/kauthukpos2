<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class SalesController extends Controller
{
    /**
     * Display a listing of the sales.
     */
    public function index()
    {
        $sales = Sale::latest()->paginate(10);
        
        return Inertia::render('Sales/Index', [
            'sales' => $sales
        ]);
    }

    /**
     * Show the form for creating a new sale.
     */
    public function create()
    {
        $products = Product::select('id', 'title as name', 'hsncode as hsn', 'gst', 'selling_price as price')->get();
        
        return Inertia::render('Sales/Create', [
            'products' => $products
        ]);
    }

    /**
     * Store a newly created sale in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'invoice_no' => 'required|string|unique:sales',
            'invoice_date' => 'required|date',
            'buyer_name' => 'required|string',
            'buyer_address' => 'nullable|string',
            'buyer_gstin' => 'nullable|string',
            'delivery_note' => 'nullable|string',
            'mode_terms_of_payment' => 'nullable|string',
            'supplier_reference' => 'nullable|string',
            'other_reference' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.hsn' => 'nullable|string',
            'items.*.gst_percentage' => 'required|numeric',
            'items.*.rate' => 'required|numeric|min:0',
            'items.*.quantity' => 'required|numeric|min:0',
            'items.*.discount_percentage' => 'nullable|numeric|min:0|max:100',
        ]);

        try {
            DB::beginTransaction();
            
            // Calculate totals
            $grandTotal = 0;
            $totalTax = 0;
            $taxableValue = 0;
            
            foreach ($request->items as $item) {
                $itemAmount = $item['rate'] * $item['quantity'];
                
                // Apply discount if any
                if (isset($item['discount_percentage']) && $item['discount_percentage'] > 0) {
                    $discountAmount = ($itemAmount * $item['discount_percentage']) / 100;
                    $itemAmount -= $discountAmount;
                }
                
                // Calculate GST
                $gstAmount = ($itemAmount * $item['gst_percentage']) / 100;
                $cgst = $sgst = $gstAmount / 2;
                
                $taxableValue += $itemAmount;
                $totalTax += $gstAmount;
                $grandTotal += ($itemAmount + $gstAmount);
            }
            
            // Convert amount to words
            $amountInWords = $this->numberToWords($grandTotal);
            
            // Create sale record
            $sale = Sale::create([
                'invoice_no' => $request->invoice_no,
                'invoice_date' => $request->invoice_date,
                'buyer_name' => $request->buyer_name,
                'buyer_address' => $request->buyer_address,
                'buyer_gstin' => $request->buyer_gstin,
                'delivery_note' => $request->delivery_note,
                'mode_terms_of_payment' => $request->mode_terms_of_payment,
                'supplier_reference' => $request->supplier_reference,
                'other_reference' => $request->other_reference,
                'grand_total' => $grandTotal,
                'total_tax' => $totalTax,
                'taxable_value' => $taxableValue,
                'amount_chargeable_in_words' => $amountInWords,
            ]);
            
            // Create sale items
            foreach ($request->items as $item) {
                $itemAmount = $item['rate'] * $item['quantity'];
                
                // Apply discount if any
                if (isset($item['discount_percentage']) && $item['discount_percentage'] > 0) {
                    $discountAmount = ($itemAmount * $item['discount_percentage']) / 100;
                    $itemAmount -= $discountAmount;
                }
                
                // Calculate GST
                $gstAmount = ($itemAmount * $item['gst_percentage']) / 100;
                $cgst = $sgst = $gstAmount / 2;
                
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $item['product_id'] ?? null,
                    'description' => $item['description'],
                    'hsn' => $item['hsn'] ?? null,
                    'gst_percentage' => $item['gst_percentage'],
                    'rate' => $item['rate'],
                    'quantity' => $item['quantity'],
                    'discount_percentage' => $item['discount_percentage'] ?? 0,
                    'cgst' => $cgst,
                    'sgst' => $sgst,
                    'amount' => $itemAmount + $gstAmount,
                ]);
            }
            
            DB::commit();
            
            return redirect()->route('sales.index')
                ->with('success', 'Sale created successfully');
                
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Error creating sale: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified sale.
     */
    public function show(Sale $sale)
    {
        $sale->load('saleItems');
        
        return Inertia::render('Sales/Show', [
            'sale' => $sale->toArray()
        ]);
    }

    /**
     * Show the form for editing the specified sale.
     */
    public function edit(Sale $sale)
    {
        $sale->load('saleItems');
        $products = Product::select('id', 'title as name', 'hsncode as hsn', 'gst', 'selling_price as price')->get();
        
        return Inertia::render('Sales/Edit', [
            'sale' => $sale,
            'products' => $products
        ]);
    }

    /**
     * Update the specified sale in storage.
     */
    public function update(Request $request, Sale $sale)
    {
        $request->validate([
            'invoice_no' => 'required|string|unique:sales,invoice_no,' . $sale->id,
            'invoice_date' => 'required|date',
            'buyer_name' => 'required|string',
            'buyer_address' => 'nullable|string',
            'buyer_gstin' => 'nullable|string',
            'delivery_note' => 'nullable|string',
            'mode_terms_of_payment' => 'nullable|string',
            'supplier_reference' => 'nullable|string',
            'other_reference' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.hsn' => 'nullable|string',
            'items.*.gst_percentage' => 'required|numeric',
            'items.*.rate' => 'required|numeric|min:0',
            'items.*.quantity' => 'required|numeric|min:0',
            'items.*.discount_percentage' => 'nullable|numeric|min:0|max:100',
        ]);

        try {
            DB::beginTransaction();
            
            // Calculate totals
            $grandTotal = 0;
            $totalTax = 0;
            $taxableValue = 0;
            
            foreach ($request->items as $item) {
                $itemAmount = $item['rate'] * $item['quantity'];
                
                // Apply discount if any
                if (isset($item['discount_percentage']) && $item['discount_percentage'] > 0) {
                    $discountAmount = ($itemAmount * $item['discount_percentage']) / 100;
                    $itemAmount -= $discountAmount;
                }
                
                // Calculate GST
                $gstAmount = ($itemAmount * $item['gst_percentage']) / 100;
                $cgst = $sgst = $gstAmount / 2;
                
                $taxableValue += $itemAmount;
                $totalTax += $gstAmount;
                $grandTotal += ($itemAmount + $gstAmount);
            }
            
            // Convert amount to words
            $amountInWords = $this->numberToWords($grandTotal);
            
            // Update sale record
            $sale->update([
                'invoice_no' => $request->invoice_no,
                'invoice_date' => $request->invoice_date,
                'buyer_name' => $request->buyer_name,
                'buyer_address' => $request->buyer_address,
                'buyer_gstin' => $request->buyer_gstin,
                'delivery_note' => $request->delivery_note,
                'mode_terms_of_payment' => $request->mode_terms_of_payment,
                'supplier_reference' => $request->supplier_reference,
                'other_reference' => $request->other_reference,
                'grand_total' => $grandTotal,
                'total_tax' => $totalTax,
                'taxable_value' => $taxableValue,
                'amount_chargeable_in_words' => $amountInWords,
            ]);
            
            // Delete existing sale items
            $sale->saleItems()->delete();
            
            // Create new sale items
            foreach ($request->items as $item) {
                $itemAmount = $item['rate'] * $item['quantity'];
                
                // Apply discount if any
                if (isset($item['discount_percentage']) && $item['discount_percentage'] > 0) {
                    $discountAmount = ($itemAmount * $item['discount_percentage']) / 100;
                    $itemAmount -= $discountAmount;
                }
                
                // Calculate GST
                $gstAmount = ($itemAmount * $item['gst_percentage']) / 100;
                $cgst = $sgst = $gstAmount / 2;
                
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $item['product_id'] ?? null,
                    'description' => $item['description'],
                    'hsn' => $item['hsn'] ?? null,
                    'gst_percentage' => $item['gst_percentage'],
                    'rate' => $item['rate'],
                    'quantity' => $item['quantity'],
                    'discount_percentage' => $item['discount_percentage'] ?? 0,
                    'cgst' => $cgst,
                    'sgst' => $sgst,
                    'amount' => $itemAmount + $gstAmount,
                ]);
            }
            
            DB::commit();
            
            return redirect()->route('sales.index')
                ->with('success', 'Sale updated successfully');
                
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Error updating sale: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified sale from storage.
     */
    public function destroy(Sale $sale)
    {
        try {
            DB::beginTransaction();
            
            // Delete related sale items first
            $sale->saleItems()->delete();
            
            // Delete the sale
            $sale->delete();
            
            DB::commit();
            
            return redirect()->route('sales.index')
                ->with('success', 'Sale deleted successfully');
                
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Error deleting sale: ' . $e->getMessage());
        }
    }

    /**
     * Convert number to words
     */
    private function numberToWords($number)
    {
        $ones = [
            0 => '', 1 => 'One', 2 => 'Two', 3 => 'Three', 4 => 'Four', 5 => 'Five',
            6 => 'Six', 7 => 'Seven', 8 => 'Eight', 9 => 'Nine', 10 => 'Ten',
            11 => 'Eleven', 12 => 'Twelve', 13 => 'Thirteen', 14 => 'Fourteen', 15 => 'Fifteen',
            16 => 'Sixteen', 17 => 'Seventeen', 18 => 'Eighteen', 19 => 'Nineteen'
        ];
        
        $tens = [
            2 => 'Twenty', 3 => 'Thirty', 4 => 'Forty', 5 => 'Fifty',
            6 => 'Sixty', 7 => 'Seventy', 8 => 'Eighty', 9 => 'Ninety'
        ];
        
        $number = number_format($number, 2, '.', '');
        $numberArray = explode('.', $number);
        $wholeNumber = (int)$numberArray[0];
        $decimal = (int)$numberArray[1];
        
        $words = '';
        
        if ($wholeNumber == 0) {
            $words = 'Zero';
        } else {
            if ($wholeNumber >= 10000000) {
                $words .= $this->numberToWords(floor($wholeNumber / 10000000)) . ' Crore ';
                $wholeNumber %= 10000000;
            }
            
            if ($wholeNumber >= 100000) {
                $words .= $this->numberToWords(floor($wholeNumber / 100000)) . ' Lakh ';
                $wholeNumber %= 100000;
            }
            
            if ($wholeNumber >= 1000) {
                $words .= $this->numberToWords(floor($wholeNumber / 1000)) . ' Thousand ';
                $wholeNumber %= 1000;
            }
            
            if ($wholeNumber >= 100) {
                $words .= $this->numberToWords(floor($wholeNumber / 100)) . ' Hundred ';
                $wholeNumber %= 100;
            }
            
            if ($wholeNumber > 0) {
                if ($words != '') {
                    $words .= 'and ';
                }
                
                if ($wholeNumber < 20) {
                    $words .= $ones[$wholeNumber];
                } else {
                    $words .= $tens[floor($wholeNumber / 10)];
                    if ($wholeNumber % 10 > 0) {
                        $words .= ' ' . $ones[$wholeNumber % 10];
                    }
                }
            }
        }
        
        if ($decimal > 0) {
            $words .= ' Rupees and ';
            if ($decimal < 20) {
                $words .= $ones[$decimal];
            } else {
                $words .= $tens[floor($decimal / 10)];
                if ($decimal % 10 > 0) {
                    $words .= ' ' . $ones[$decimal % 10];
                }
            }
            $words .= ' Paise';
        } else {
            $words .= ' Rupees Only';
        }
        
        return $words;
    }
} 