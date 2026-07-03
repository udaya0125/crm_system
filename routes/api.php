<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ServiceContractController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



    // ####################################################################
    // API routes for creating payments .
    // ####################################################################

    Route::post('/ourpayments', [PaymentController::class, 'store']);

    // ####################################################################
    // API routes for service contracts .
    // ####################################################################

    Route::post('/ourservicecontracts', [ServiceContractController::class, 'store']);

