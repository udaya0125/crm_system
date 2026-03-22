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
    // CRM PAGE
    // -----------------------------------------
    
    Route::get('/crm', function(){
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


    Route::get('/client', function(){
        return Inertia::render('ClientDetails/Client');
        
    });


    Route::get('/expiration', function(){
        return Inertia::render('ClientDetails/Expiration');
        
    });


    Route::get('/client-management', function(){
        return Inertia::render('ClientDetails/ClientManagement');
        
    });

    Route::get('/project-management', function(){
        return Inertia::render('ClientDetails/ProjectManagement');
        
    });



    Route::get('/ticket', function(){
        return Inertia::render('DetailsPage/Ticket');
        
    });

    Route::get('/payment-finance-tracking', function(){
        return Inertia::render('ClientDetails/FinanceTracking');
        
    });


    Route::get('/domain-tracking', function(){
        return Inertia::render('ClientDetails/DomainManagement');
        
    });

    Route::get('/hosting-tracking', function(){
        return Inertia::render('ClientDetails/HostingManagement');
        
    });


    Route::get('/leads', function(){
        return Inertia::render('ClientDetails/Leads');
        
    });

    Route::get('/contract-renewal-management', function(){
        return Inertia::render('ClientDetails/ContractRenewalManagement');
    });

    // -----------------------------------------
    // CLIENT CRUD
    // -----------------------------------------

    Route::get('/ourclients', [ClientController::class, 'index'])->name('ourclients.index');
    Route::post('/ourclients', [ClientController::class, 'store'])->name('ourclients.store');
    Route::put('/ourclients/{id}', [ClientController::class, 'update'])->name('ourclients.update');
    Route::delete('/ourclients/{id}', [ClientController::class, 'destroy'])->name('ourclients.destroy');


    // -----------------------------------------
    // EXPIRATION CRUD
    // -----------------------------------------

    Route::get('/ourexpirations', [ExpirationController::class, 'index'])->name('ourexpirations.index');
    Route::post('/ourexpirations', [ExpirationController::class, 'store'])->name('ourexpirations.store');
    Route::put('/ourexpirations/{id}', [ExpirationController::class, 'update'])->name('ourexpirations.update');
    Route::delete('/ourexpirations/{id}', [ExpirationController::class, 'destroy'])->name('ourexpirations.destroy');


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

Route::middleware(['auth', 'role: projectmanager,admin'])->group(function () {


});


    // ************************************************************
    // Only sales team and admin can access task management
    // ************************************************************


Route::middleware(['auth', 'role: salesteam,admin'])->group(function () {


});


    // **********************************************************
    // Only developer and admin can access task management
    // **********************************************************


Route::middleware(['auth', 'role: developer,admin'])->group(function () {


});


    // *************************************************************
    // Only Technician and admin can access task management
    // *************************************************************


Route::middleware(['auth', 'role: technician,admin'])->group(function () {


});


    // ************************************************************
    // Only Accountant and admin can access task management
    // ************************************************************


Route::middleware(['auth', 'role: accountant,admin'])->group(function () {


});


    // ***********************************************************
    // Only support and admin can access task management
    // ***********************************************************


Route::middleware(['auth', 'role: support,admin'])->group(function () {


});

    // *********************************************************************
    // Only user can access task list viewing
    // *********************************************************************


Route::middleware(['auth', 'role:user,admin'])->group(function () {

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


    // Route::get('/sale', function(){
    //     return Inertia::render('MainPages/SalesSystem');
        
    // });



    // ---------------------------------------------------------
    // TICKET MANAGEMENT CRUD for the Tech Support Team
    // ---------------------------------------------------------
    Route::get('/ourtickets', [TicketController::class, 'index'])->name('ourtickets.index');
    Route::post('/ourtickets', [TicketController::class, 'store'])->name('ourtickets.store');
    Route::put('/ourtickets/{id}', [TicketController::class, 'update'])->name('ourtickets.update');
    Route::delete('/ourtickets/{id}', [TicketController::class, 'destroy'])->name('ourtickets.destroy');

    // ---------------------------------------------------------
    // PROJECT MANAGEMENT CRUD for the Development Team
    // ---------------------------------------------------------

    Route::get('/ourprojects', [ProjectManagementController::class, 'index'])->name('ourprojects.index');
    Route::post('/ourprojects', [ProjectManagementController::class, 'store'])->name('ourprojects.store');
    Route::put('/ourprojects/{id}', [ProjectManagementController::class, 'update'])->name('ourprojects.update');
    Route::delete('/ourprojects/{id}', [ProjectManagementController::class, 'destroy'])->name('ourprojects.destroy');

    // ---------------------------------------------------------
    // FINANCE TRACKING CRUD for the Finance Team
    // ---------------------------------------------------------

    Route::get('/ourfinance', [FinanceTrackingController::class, 'index'])->name('ourfinance.index');
    Route::post('/ourfinance', [FinanceTrackingController::class, 'store'])->name('ourfinance.store');
    Route::put('/ourfinance/{id}', [FinanceTrackingController::class, 'update'])->name('ourfinance.update');
    Route::delete('/ourfinance/{id}', [FinanceTrackingController::class, 'destroy'])->name('ourfinance.destroy');


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


    Route::get('/service-contracts', [ServiceContractController::class, 'index'])->name('service-contracts.index');
    Route::post('/service-contracts', [ServiceContractController::class, 'store'])->name('service-contracts.store');
    Route::put('/service-contracts/{id}', [ServiceContractController::class, 'update'])->name('service-contracts.update');
    Route::delete('/service-contracts/{id}', [ServiceContractController::class, 'destroy'])->name('service-contracts.destroy');



    Route::get('/ticket-dashboard', function(){
        return Inertia::render('Dashboard/ExpiryDashboard');
    });

require __DIR__.'/auth.php';