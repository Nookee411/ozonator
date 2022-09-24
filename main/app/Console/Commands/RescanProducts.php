<?php

namespace App\Console\Commands;

use App\Jobs\ProcessTask;
use App\Models\Product;
use App\Models\Task;
use Illuminate\Console\Command;

class RescanProducts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'products:rescan';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $products = Product::all()->whereNull('seller_id');
        foreach($products as $product) {
            $task = Task::create([
                'type' => Task::FIRST_PRODUCT_CHECK,
                'product_id' => $product->id,
            ]);
    
            dispatch(new ProcessTask($task));
        }
        return 0;
    }
}
