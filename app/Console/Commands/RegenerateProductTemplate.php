<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class RegenerateProductTemplate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:regenerate-product-template';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $filePath = public_path('templates/product_import_template.xlsx');
        if (file_exists($filePath)) {
            unlink($filePath);
            $this->info('Product template removed. It will be regenerated on next download request.');
        } else {
            $this->info('No existing template found.');
        }
    }
}
