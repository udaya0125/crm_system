<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CompanyCRMController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

    Route::get('/home', function(){
        return Inertia::render('HomePage/Home');
    });

    Route::get('/', function(){
        return Inertia::render('MainPages/SalesSystem');
    });

    Route::get('crm', function(){
        return Inertia::render('MainPages/CRM');
    });

    Route::get('/company', function(){
        return Inertia::render('MainPages/Company');
    });

    Route::get('/company/details/{slug}', function(){
        return Inertia::render('DetailsPage/CompanyDetails');
    });


    // // Index - Get all companies with relationships
    // Route::get('/ourcompany', [CompanyCRMController::class, 'index'])->name('ourcompany.index');

    // // Company CRUD
    // Route::post('/ourcompany', [CompanyCRMController::class, 'storeCompany'])->name('ourcompany.store');
    // Route::post('/ourcompany/{id}', [CompanyCRMController::class, 'updateCompany'])->name('ourcompany.update');
    // Route::delete('/ourcompany/{id}', [CompanyCRMController::class, 'destroyCompany'])->name('ourcompany.destroy');

    // // Contract
    // Route::post('/ourcontract', [CompanyCRMController::class, 'storeContract'])->name('ourcontract.store');
    // Route::post('/ourcontract/{id}', [CompanyCRMController::class, 'updateContract'])->name('ourcontract.update');

    // // Initial Response
    // Route::post('/ourinitialresponse', [CompanyCRMController::class, 'storeInitialResponse'])->name('ourinitialresponse.store');
    // Route::post('/ourinitialresponse/{id}', [CompanyCRMController::class, 'updateInitialResponse'])->name('ourinitialresponse.update');

    // // Follow-Up Response
    // Route::post('/ourfollowupresponse', [CompanyCRMController::class, 'storeFollowUpResponse'])->name('ourfollowupresponse.store');
    // Route::post('/ourfollowupresponse/{id}', [CompanyCRMController::class, 'updateFollowUpResponse'])->name('ourfollowupresponse.update');

    // // Meeting
    // Route::post('/ourmeeting', [CompanyCRMController::class, 'storeMeeting'])->name('ourmeeting.store');
    // Route::post('/ourmeeting/{id}', [CompanyCRMController::class, 'updateMeeting'])->name('ourmeeting.update');





    // -----------------------------------------
    // COMPANY CRUD
    // -----------------------------------------
    Route::get('/ourcompany', [CompanyCRMController::class, 'index'])->name('ourcompany.index');
    Route::post('/ourcompany', [CompanyCRMController::class, 'storeCompany'])->name('ourcompany.store');
    Route::put('/ourcompany/{id}', [CompanyCRMController::class, 'updateCompany'])->name('ourcompany.update');
    Route::delete('/ourcompany/{id}', [CompanyCRMController::class, 'deleteCompany'])->name('ourcompany.delete');


    // -----------------------------------------
    // INITIAL RESPONSE (STEP 1)
    // -----------------------------------------
    Route::post('/ourinitialresponse', [CompanyCRMController::class, 'storeInitialResponse'])->name('ourinitialresponse.store');
    Route::put('/ourinitialresponse/{id}', [CompanyCRMController::class, 'updateInitialResponse'])->name('ourinitialresponse.update');


    // -----------------------------------------
    // MEETING (STEP 2)
    // -----------------------------------------
    Route::post('/ourmeeting', [CompanyCRMController::class, 'storeMeeting'])->name('ourmeeting.store');
    Route::put('/ourmeeting/{id}', [CompanyCRMController::class, 'updateMeeting'])->name('ourmeeting.update');


    // -----------------------------------------
    // FOLLOW UP RESPONSE (STEP 3)
    // -----------------------------------------
    Route::post('/ourfollowupresponse', [CompanyCRMController::class, 'storeFollowUp'])->name('ourfollowupresponse.store');
    Route::put('/ourfollowupresponse/{id}', [CompanyCRMController::class, 'updateFollowUp'])->name('ourfollowupresponse.update');


    // -----------------------------------------
    // CONTRACT (STEP 4)
    // -----------------------------------------
    Route::post('/ourcontract', [CompanyCRMController::class, 'storeContract'])->name('ourcontract.store');
    Route::put('/ourcontract/{id}', [CompanyCRMController::class, 'updateContract'])->name('ourcontract.update');


require __DIR__.'/auth.php';