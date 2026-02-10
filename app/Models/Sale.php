<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_no',
        'invoice_date',
        'buyer_name',
        'buyer_address',
        'buyer_gstin',
        'delivery_note',
        'mode_terms_of_payment',
        'supplier_reference',
        'other_reference',
        'grand_total',
        'total_tax',
        'taxable_value',
        'amount_chargeable_in_words',
    ];

    public function saleItems()
    {
        return $this->hasMany(SaleItem::class);
    }
} 