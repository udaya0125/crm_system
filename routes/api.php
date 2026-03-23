<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ServiceContractController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



    Route::post('/ourpayments', [PaymentController::class, 'store']);
    Route::post('/ourservicecontracts', [ServiceContractController::class, 'store']);

