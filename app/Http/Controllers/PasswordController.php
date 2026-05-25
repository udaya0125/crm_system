<?php

namespace App\Http\Controllers;

use App\Models\Password;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;

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


        /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $passwords = Password::with([
            'organization',
            'category',
            'subcategory',
            'subsubcategory',
        ])->latest()->get();

        // Decrypt password before sending response
        $passwords->transform(function ($item) {
            $item->password = Crypt::decryptString($item->password);
            return $item;
        });

        return response()->json([
            'status' => true,
            'data'   => $passwords,
        ]);
    }

    /**
     * Store a newly created resource.
     */
    public function store(Request $request)
    {
        $request->validate([
            'organization_id'   => 'required|exists:organizations,id',
            'category_id'      => 'required|exists:categories,id',
            'sub_category_id'  => 'nullable|exists:sub_categories,id',
            'sub_sub_category_id'=> 'nullable|exists:sub_sub_categories,id',
            'username'         => 'required|string|max:255',
            'password'         => 'required|string',
            'expirydate'       => 'nullable|date',
            'note'             => 'nullable|string',
            'image'            => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('passwords', 'public');
        }

        $password = Password::create([
            'organization_id'    => $request->organization_id,
            'category_id'       => $request->category_id,
            'sub_category_id'   => $request->sub_category_id,
            'sub_sub_category_id' => $request->sub_sub_category_id,
            'username'          => $request->username,
            'password'          => Crypt::encryptString($request->password),
            'expirydate'        => $request->expirydate,
            'note'              => $request->note,
            'image'             => $imagePath,
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Password created successfully',
            'data'    => $password,
        ], 201);
    }

    /**
     * Update the specified resource.
     */
    public function update(Request $request, $id)
    {
        $password = Password::findOrFail($id);

        $request->validate([
            'organization_id'   => 'required|exists:organizations,id',
            'category_id'      => 'required|exists:categories,id',
            'sub_category_id'  => 'nullable|exists:sub_categories,id',
            'sub_sub_category_id'=> 'nullable|exists:sub_sub_categories,id',
            'username'         => 'required|string|max:255',
            'password'         => 'required|string',
            'expirydate'       => 'nullable|date',
            'note'             => 'nullable|string',
            'image'            => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $imagePath = $password->image;
        if ($request->hasFile('image')) {
            // Delete old image
            if ($password->image && Storage::disk('public')->exists($password->image)) {
                Storage::disk('public')->delete($password->image);
            }
            $imagePath = $request->file('image')->store('passwords', 'public');
        }

        $password->update([
            'organization_id'    => $request->organization_id,
            'category_id'       => $request->category_id,
            'sub_category_id'   => $request->sub_category_id,
            'sub_sub_category_id' => $request->sub_sub_category_id,
            'username'          => $request->username,
            'password'          => Crypt::encryptString($request->password),
            'expirydate'        => $request->expirydate,
            'note'              => $request->note,
            'image'             => $imagePath,
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Password updated successfully',
            'data'    => $password,
        ]);
    }

    /**
     * Remove the specified resource.
     */
    public function destroy($id)
    {
        $password = Password::findOrFail($id);

        if ($password->image && Storage::disk('public')->exists($password->image)) {
            Storage::disk('public')->delete($password->image);
        }

        $password->delete();

        return response()->json([
            'status'  => true,
            'message' => 'Password deleted successfully',
        ]);
    }


}