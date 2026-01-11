<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CompanyCRMController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskListController;
use App\Http\Controllers\TodoController;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {

    // -----------------------------------------
    // DASHBOARD PAGE
    // -----------------------------------------
    
    Route::get('/', function(){
        return Inertia::render('MainPages/CRM');
    });

    // -----------------------------------------
    // COMPANY DETAILS PAGE BY SLUG
    // -----------------------------------------

    Route::get('/crm/details/{slug}', [CompanyCRMController::class, 'indexBySlug']);

    // -----------------------------------------
    // COMPANY DETAILS PAGE BY ID
    // -----------------------------------------

    Route::get('/allcompany/{id}', [CompanyCRMController::class, 'show']);

    // -----------------------------------------
    // COMPANY PAGE
    // -----------------------------------------

    Route::get('/company', function(){
        return Inertia::render('MainPages/Company');
        
    });


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
 
    // -----------------------------------------
    // TASK MANAGEMENT CRUD
    // -----------------------------------------
   
    Route::get('/ourtask', [TaskController::class, 'index'])->name('ourtask.index');

    Route::get('/tasks', function () {
        return Inertia::render('DetailsPage/Task');
    });

    // -----------------------------------------
    // TO DO PAGE
    // -----------------------------------------

    Route::get('/todo', function () {
        return Inertia::render('DetailsPage/ToDoPage');
    });

    // -----------------------------------------
    // TO DO MANAGEMENT CRUD
    // -----------------------------------------

    Route::get('/ourtodo', [TodoController::class, 'index'])->name('ourtodo.index');
    Route::post('/ourtodo', [TodoController::class, 'store'])->name('ourtodo.store');
    Route::put('/ourtodo/{id}', [TodoController::class, 'update'])->name('ourtodo.update');
    Route::delete('/ourtodo/{id}', [TodoController::class, 'destroy'])->name('ourtodo.destroy');

});


    //-----------------------------------------
    // Only admin can access user management
    //-----------------------------------------

Route::middleware(['auth', 'role:admin'])->group(function () {

    // -----------------------------------------
    // USER MANAGEMENT PAGE
    // -----------------------------------------
    Route::get('/user-management', function () {
        return Inertia::render('DetailsPage/UserManagement');
    });

    // -----------------------------------------
    // USER MANAGEMENT CRUD
    // -----------------------------------------
    Route::get('/ouruser', [UserController::class, 'index'])->name('ouruser.index');
    Route::post('/ouruser', [UserController::class, 'store'])->name('ouruser.store');
    Route::put('/ouruser/{id}', [UserController::class, 'update'])->name('ouruser.update');
    Route::delete('/ouruser/{id}', [UserController::class, 'destroy'])->name('ouruser.destroy');

    // -----------------------------------------
    // TASK ASSIGNMENT PAGE
    // -----------------------------------------

    Route::get('/task-assignments', function () {
        return Inertia::render('DetailsPage/TaskAssigned');
    });

    // -----------------------------------------
    // TASK LIST MANAGEMENT CRUD
    // -----------------------------------------

    Route::get('/ourtasklist', [TaskListController::class, 'index'])->name('ourtasklist.index');
    Route::post('/ourtasklist', [TaskListController::class, 'store'])->name('ourtasklist.store');
    Route::put('/ourtasklist/{id}', [TaskListController::class, 'update'])->name('ourtasklist.update');
    Route::delete('/ourtasklist/{id}', [TaskListController::class, 'destroy'])->name('ourtasklist.destroy');

    // -----------------------------------------
    // OUR USERS MANAGEMENT CRUD
    // -----------------------------------------

    Route::get('/ourusers', [UserController::class, 'index'])->name('ourusers.index');
    Route::post('/ourusers', [UserController::class, 'store'])->name('ourusers.store');
    Route::put('/ourusers/{id}', [UserController::class, 'update'])->name('ourusers.update');
    Route::delete('/ourusers/{id}', [UserController::class, 'destroy'])->name('ourusers.destroy');
    
});


    //-----------------------------------------
    // Only user can access task list viewing
    //-----------------------------------------

Route::middleware(['auth', 'role:user'])->group(function () {

    // -----------------------------------------
    // TASK MANAGEMENT CRUD
    // -----------------------------------------
 
    Route::post('/ourtask', [TaskController::class, 'store'])->name('ourtask.store');
    Route::put('/ourtask/{id}', [TaskController::class, 'update'])->name('ourtask.update');
    Route::delete('/ourtask/{id}', [TaskController::class, 'destroy'])->name('ourtask.destroy');

    // -----------------------------------------
    // TASK LIST VIEWING PAGE
    // -----------------------------------------

    Route::get('/tasklists', [TaskListController::class, 'index'])->name('tasklists.index');

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
    

require __DIR__.'/auth.php';