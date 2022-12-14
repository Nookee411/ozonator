<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessTask;
use App\Models\Product;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ProductsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $products = Auth::user()->products()->with(['seller'])->orderByDesc('created_at')->get();
        // Log::debug(var_export($userWithProducts, true));
        
        return response()->json(['status'=>'success', 'products'=> $products]); 
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ozon_link' => 'required|url|regex:/http(s)*:\/\/.*ozon.ru\/product\//',
        ]);
        $matches = [];
        preg_match('/\d{3,21}\//', $request->ozon_link, $matches);
        $ozonId = substr($matches[0], 0, -1);

        $userId = Auth::user()->id;


        // Check if user already have such resource
        $product = Auth::user()->products()->where(['ozon_id' => $ozonId])->first();
        
        // Log::debug(isset($product));
        // Log::debug(count($product)));
        
        if(isset($product)){
            return response()->json([
                'status'=>'error',
                'errors'=>[
                    'ozon_link' => ['Такой товар уже отслеживается']
                ]
            ]);
        }
        
        $product = Product::query()->create([
            'ozon_id' => $ozonId,
        ]);

        Auth::user()->products()->attach($product);

        //Query task for new product

        $task = Task::query()->create([
            'type' => Task::FIRST_PRODUCT_CHECK,
            'product_id' => $product->id,
        ]);

        dispatch(new ProcessTask($task));

        return response()->json(['status'=>'success', 'product'=> $product]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Product $product)
    {   
        Log::debug($product);
        return Inertia::render('Details', [ 'product' => $product->load(['statistics' => function($query) {
            $query->orderBy('created_at', 'asc');
        }])]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $result = Auth::user()->products()->detach($id);
        if($result)
            return response()->json(['status'=>'success']);
        else
            return response()->json(['status'=>'error']);

    }


    /**
     * 
     */
    public static function planProductScan(){
        $productToScan = Product::get();
        foreach($productToScan as $product) {
            $task = Task::query()->create([
                'type' => Task::PRODUCT_RECHECK,
                'product_id' => $product->id,
            ]);
    
            dispatch(new ProcessTask($task));
        }
    } 
}
