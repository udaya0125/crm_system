<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TodoController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ExpirationController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\ProjectManagementController;
use App\Http\Controllers\FinanceTrackingController;
use App\Http\Controllers\DomainManagementController;
use App\Http\Controllers\HostingManagementController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\ClientManagementController;
use App\Http\Controllers\UserLogController;
use App\Http\Controllers\ServiceContractController;
use App\Http\Controllers\PasswordController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\SubSubCategoryController;


    // -----------------------------------------
    // WELCOME PAGE
    // -----------------------------------------

    Route::get('/', function(){
        return Inertia::render('ClientDetails/Welcome');
    });


    // **************************************************************
    // Only authenticated users can access the following routes
    // **************************************************************



Route::middleware('auth')->group(function () {

    // -----------------------------------------
    // DASHBOARD PAGE
    // -----------------------------------------

    Route::get('/dashboard', function(){
        return Inertia::render('ClientDetails/Dashboard');
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



    // --------------------------------------------------------------------------
    // Notification routes for Dashboard
    // --------------------------------------------------------------------------

    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.markAllAsRead');
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
    Route::delete('/notifications', [NotificationController::class, 'clearAll'])->name('notifications.clearAll');


    // -----------------------------------------
    // OUR USERS MANAGEMENT CRUD
    // -----------------------------------------

    Route::get('/ourusers', [UserController::class, 'index'])->name('ourusers.index');
    Route::post('/ourusers', [UserController::class, 'store'])->name('ourusers.store');
    Route::put('/ourusers/{id}', [UserController::class, 'update'])->name('ourusers.update');
    Route::delete('/ourusers/{id}', [UserController::class, 'destroy'])->name('ourusers.destroy');


    // -----------------------------------------
    // USER PROFILE MANAGEMENT
    // -----------------------------------------

    Route::post('/password/verify', [PasswordController::class, 'verify'])->name('password.verify');


    Route::get('/profile', function () {
        return Inertia::render('DetailsPage/Profile');
    });

});
    

    // *********************************************************************
    // Only admin can access user management
    // *********************************************************************

Route::middleware(['auth', 'role:admin'])->group(function () {


    // -----------------------------------------
    // USER MANAGEMENT PAGE
    // -----------------------------------------
    
    Route::get('/user-management', function () {
        return Inertia::render('DetailsPage/UserManagement');
    });



    // -----------------------------------------
    // ACTIVITY LOG PAGE
    // -----------------------------------------

    Route::get('/activity-log', function () {
        return Inertia::render('DetailsPage/ActivityLog');
    });


    // -----------------------------------------
    // USER LOG MANAGEMENT CRUD
    // -----------------------------------------

    Route::get('/ourlogs', [UserLogController::class, 'index'])->name('ourlogs.index');
    
});

  
    // ****************************************************************
    // Only project manager and admin can access task management
    // ****************************************************************

Route::middleware(['auth', 'role:manager,admin'])->group(function () {

    Route::get('/domain-tracking', function(){
        return Inertia::render('ClientDetails/DomainManagement'); 
    });

    Route::get('/hosting-tracking', function(){
        return Inertia::render('ClientDetails/HostingManagement');   
    });

        Route::get('/expiration', function(){
        return Inertia::render('ClientDetails/Expiration');
    });

        Route::get('/client', function(){
        return Inertia::render('ClientDetails/Client');
        
    });

    Route::get('/service-contracts', function(){
        return Inertia::render('ClientDetails/ServiceContracts');    
    });

    Route::get('/payment-management', function(){
        return Inertia::render('ClientDetails/Payment');    
    });


    Route::get('/client-details', function(){
        return Inertia::render('ClientDetails/ClientDetails');    
    });

    
    // -----------------------------------------
    // CLIENT CRUD
    // -----------------------------------------

    Route::get('/ourclients', [ClientController::class, 'index'])->name('ourclients.index');
    Route::post('/ourclients', [ClientController::class, 'store'])->name('ourclients.store');
    Route::put('/ourclients/{id}', [ClientController::class, 'update'])->name('ourclients.update');
    Route::delete('/ourclients/{id}', [ClientController::class, 'destroy'])->name('ourclients.destroy');


    // ---------------------------------------------------------
    // DOMAIN MANAGEMENT CRUD for the Development Team
    // ---------------------------------------------------------

    Route::get('/ourdomains', [DomainManagementController::class, 'index'])->name('ourdomains.index');
    Route::post('/ourdomains', [DomainManagementController::class, 'store'])->name('ourdomains.store');
    Route::put('/ourdomains/{id}', [DomainManagementController::class, 'update'])->name('ourdomains.update');
    Route::delete('/ourdomains/{id}', [DomainManagementController::class, 'destroy'])->name('ourdomains.destroy');

    Route::get('/ourhostings', [HostingManagementController::class, 'index'])->name('ourhostings.index');
    Route::post('/ourhostings', [HostingManagementController::class, 'store'])->name('ourhostings.store');
    Route::put('/ourhostings/{id}', [HostingManagementController::class, 'update'])->name('ourhostings.update');
    Route::delete('/ourhostings/{id}', [HostingManagementController::class, 'destroy'])->name('ourhostings.destroy');

    // -----------------------------------------
    // EXPIRATION CRUD
    // -----------------------------------------

    Route::get('/ourexpirations', [ExpirationController::class, 'index'])->name('ourexpirations.index');
    Route::post('/ourexpirations', [ExpirationController::class, 'store'])->name('ourexpirations.store');
    Route::put('/ourexpirations/{id}', [ExpirationController::class, 'update'])->name('ourexpirations.update');
    Route::delete('/ourexpirations/{id}', [ExpirationController::class, 'destroy'])->name('ourexpirations.destroy');


    Route::get('/ourservicecontracts', [ServiceContractController::class, 'index'])->name('ourservicecontracts.index');
    Route::delete('/ourservicecontracts/{id}', [ServiceContractController::class, 'destroy'])->name('ourservicecontracts.destroy');
    Route::post('/ourservicecontracts', [ServiceContractController::class, 'store'])->name('ourservicecontracts.store');
    Route::put('/ourservicecontracts/{id}', [ServiceContractController::class, 'update'])->name('ourservicecontracts.update');

    Route::get('/ourpayments', [PaymentController::class, 'index'])->name('ourpayments.index');
    Route::put('/ourpayments/{id}', [PaymentController::class, 'update'])->name('ourpayments.update');
    Route::post('/ourpayments', [PaymentController::class, 'store'])->name('ourpayments.store');
    Route::delete('/ourpayments/{id}', [PaymentController::class, 'destroy'])->name('ourpayments.destroy');
});



    // **********************************************************
    // Only developer and admin can access task management
    // **********************************************************


Route::middleware(['auth', 'role:developer,admin'])->group(function () {

    Route::get('/project-management', function(){
        return Inertia::render('ClientDetails/ProjectManagement');  
    });

    // ---------------------------------------------------------
    // PROJECT MANAGEMENT CRUD for the Development Team
    // ---------------------------------------------------------

    Route::get('/ourprojects', [ProjectManagementController::class, 'index'])->name('ourprojects.index');
    Route::post('/ourprojects', [ProjectManagementController::class, 'store'])->name('ourprojects.store');
    Route::put('/ourprojects/{id}', [ProjectManagementController::class, 'update'])->name('ourprojects.update');
    Route::delete('/ourprojects/{id}', [ProjectManagementController::class, 'destroy'])->name('ourprojects.destroy');
    
});


    // *************************************************************
    // Only Technician and admin can access task management
    // *************************************************************


Route::middleware(['auth', 'role:technician,admin'])->group(function () {

    Route::get('/ticket', function(){
        return Inertia::render('DetailsPage/Ticket'); 
    });

    // ---------------------------------------------------------
    // TICKET MANAGEMENT CRUD for the Tech Support Team
    // ---------------------------------------------------------
    Route::get('/ourtickets', [TicketController::class, 'index'])->name('ourtickets.index');
    Route::post('/ourtickets', [TicketController::class, 'store'])->name('ourtickets.store');
    Route::put('/ourtickets/{id}', [TicketController::class, 'update'])->name('ourtickets.update');
    Route::delete('/ourtickets/{id}', [TicketController::class, 'destroy'])->name('ourtickets.destroy');
});


    // ************************************************************
    // Only Accountant and admin can access task management
    // ************************************************************


Route::middleware(['auth', 'role:accountant,admin'])->group(function () {


    Route::get('/leads', function(){
        return Inertia::render('ClientDetails/Leads');
        
    });

    Route::get('/payment-finance-tracking', function(){
        return Inertia::render('ClientDetails/FinanceTracking');   
    });

    Route::get('/client-management', function(){
        return Inertia::render('ClientDetails/ClientManagement');
        
    });

    // ---------------------------------------------------------
    // FINANCE TRACKING CRUD for the Finance Team
    // ---------------------------------------------------------

    Route::get('/ourfinance', [FinanceTrackingController::class, 'index'])->name('ourfinance.index');
    Route::post('/ourfinance', [FinanceTrackingController::class, 'store'])->name('ourfinance.store');
    Route::put('/ourfinance/{id}', [FinanceTrackingController::class, 'update'])->name('ourfinance.update');
    Route::delete('/ourfinance/{id}', [FinanceTrackingController::class, 'destroy'])->name('ourfinance.destroy');

    // ---------------------------------------------------------
    // LEAD MANAGEMENT CRUD for the Sales Team
    // ---------------------------------------------------------

    Route::get('/ourleads', [LeadController::class, 'index'])->name('ourleads.index');
    Route::post('/ourleads', [LeadController::class, 'store'])->name('ourleads.store');
    Route::put('/ourleads/{id}', [LeadController::class, 'update'])->name('ourleads.update');
    Route::delete('/ourleads/{id}', [LeadController::class, 'destroy'])->name('ourleads.destroy');

    Route::get('/ourclientmanagement', [ClientManagementController::class, 'index'])->name('ourclientmanagement.index');
    Route::post('/ourclientmanagement', [ClientManagementController::class, 'store'])->name('ourclientmanagement.store');
    Route::put('/ourclientmanagement/{id}', [ClientManagementController::class, 'update'])->name('ourclientmanagement.update');
    Route::delete('/ourclientmanagement/{id}', [ClientManagementController::class, 'destroy'])->name('ourclientmanagement.destroy');


});


    // *********************************************************************
    // Only user can access task list viewing
    // *********************************************************************


    Route::get('/ourcategories', [CategoryController::class, 'index'])->name('ourcategories.index');
    Route::post('/ourcategories', [CategoryController::class, 'store'])->name('ourcategories.store');
    Route::put('/ourcategories/{id}', [CategoryController::class, 'update'])->name('ourcategories.update');
    Route::delete('/ourcategories/{id}', [CategoryController::class, 'destroy'])->name('ourcategories.destroy');


    Route::get('/category',function (){
        return Inertia::render('Passwords/Category');
    });

    Route::get('/organization',function (){
        return Inertia::render('Passwords/Organization');
    });

    Route::get('/ourorganizations', [OrganizationController::class, 'index'])->name('ourorganizations.index');
    Route::post('/ourorganizations', [OrganizationController::class, 'store'])->name('ourorganizations.store');
    Route::put('/ourorganizations/{id}', [OrganizationController::class, 'update'])->name('ourorganizations.update');
    Route::delete('/ourorganizations/{id}', [OrganizationController::class, 'destroy'])->name('ourorganizations.destroy');


    Route::get('/sub-category',function (){
        return Inertia::render('Passwords/SubCategory');
    });

    Route::get('/oursubcategories', [SubCategoryController::class, 'index'])->name('oursubcategories.index');
    Route::post('/oursubcategories', [SubCategoryController::class, 'store'])->name('oursubcategories.store');
    Route::put('/oursubcategories/{id}', [SubCategoryController::class, 'update'])->name('oursubcategories.update');
    Route::delete('/oursubcategories/{id}', [SubCategoryController::class, 'destroy'])->name('oursubcategories.destroy');


    Route::get('/sub-sub-category',function (){
        return Inertia::render('Passwords/ChildCategory');
    });


    Route::get('/ourchildcategories', [SubSubCategoryController::class, 'index'])->name('ourchildcategories.index');
    Route::post('/ourchildcategories', [SubSubCategoryController::class, 'store'])->name('ourchildcategories.store');
    Route::put('/ourchildcategories/{id}', [SubSubCategoryController::class, 'update'])->name('ourchildcategories.update');
    Route::delete('/ourchildcategories/{id}', [SubSubCategoryController::class, 'destroy'])->name('ourchildcategories.destroy');

     Route::get('/password',function (){
        return Inertia::render('Passwords/Password');
    });

    Route::get('/ourpasswords', [PasswordController::class, 'index'])->name('ourpasswords.index');
    Route::post('/ourpasswords', [PasswordController::class, 'store'])->name('ourpasswords.store');
    Route::put('/ourpasswords/{id}', [PasswordController::class, 'update'])->name('ourpasswords.update');
    Route::delete('/ourpasswords/{id}', [PasswordController::class, 'destroy'])->name('ourpasswords.destroy');



    Route::get('/tech-ticket',function (){
        return Inertia::render('TicketCreate/TechTicket');
    });

    Route::get('/web-ticket',function (){
        return Inertia::render('TicketCreate/WebTicket');
    });

require __DIR__.'/auth.php';