<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserLogController extends Controller
{
    //
      public function index()
    {
        // Fetch all logs, latest first
        $logs = UserLog::latest()->get();

        return response()->json([
            'success' => true,
            'data' => $logs,
        ]);
    }
}
