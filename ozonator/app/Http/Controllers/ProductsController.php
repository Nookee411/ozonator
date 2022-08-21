<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ProductsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $products = Auth::user()->products;
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
            'link' => 'required|url|regex:/http(s)*:\/\/.*ozon.ru\/product\//',
        ]);
        $matches = [];
        preg_match('/\d{3,21}\//', $request->link, $matches);
        $ozonId = substr($matches[0], 0, -1);

        $userId = Auth::user()->id;

        // Check if user already have such resource
        $product = Product::query()->where([
            'ozon_id' => $ozonId,
            'user_id' => $userId,
        ])->first();

        if(isset($product)){
            return response()->json([
                'status'=>'error',
                'errors'=>[
                    'link' => 'Такой товар уже отслеживается'
                ]
            ]);
        }
        
        $product = Product::query()->create([
            'ozon_id' => $ozonId,
            'user_id' => $userId,
        ]);

        //Query task for new product

        Task::query()->create([
            'type' => Task::FIRST_PRODUCT_CHECK,
            'product_id' => $product->id,
        ]);

        return response()->json(['status'=>'success', 'product'=> $product]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
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
        //
    }
}
