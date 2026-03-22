<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class PasswordController extends Controller
{
    //

    public function verify(Request $request) 
    {
        $request->validate([
            'password' => 'required',
        ]);
        
        if(Hash::check($request->password, auth()->user()->password)) {
            return response()->json(['verified' => true]); 
        }

        return response()->json(['verified'=>false],422);

    }


}