<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Models\UserLog;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index()
    {
        $users = User::latest()->get();

        return response()->json([
            'status' => 'success',
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created user.
     */
    public function store(StoreUserRequest $request)
    {
        $validated = $request->validated();

        // Upload image
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('users', 'public');
        }

        // Hash password
        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        UserLog::create([
            'name'       => $request->user()?->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Created user: {$user->name}",
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'User created successfully',
            'user'    => $user,
        ], 201);
    }

    /**
     * Display the specified user.
     */
    public function show($id)
    {
        $user = User::findOrFail($id);

        return response()->json([
            'status' => 'success',
            'user'   => $user,
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(UpdateUserRequest $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validated();

        // Upload new image
        if ($request->hasFile('image')) {

            // Delete old image
            if ($user->image && Storage::disk('public')->exists($user->image)) {
                Storage::disk('public')->delete($user->image);
            }

            $validated['image'] = $request->file('image')->store('users', 'public');
        }

        // Update password only if provided
        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        UserLog::create([
            'name'       => $request->user()?->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Updated user: {$user->name}",
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'User updated successfully',
            'user'    => $user,
        ]);
    }

    /**
     * Remove the specified user.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Delete image
        if ($user->image && Storage::disk('public')->exists($user->image)) {
            Storage::disk('public')->delete($user->image);
        }

        $userName = $user->name;

        $user->delete();

        UserLog::create([
            'name'       => auth()->user()?->name ?? 'System',
            'ip_address' => request()->ip(),
            'title'      => "Deleted user: {$userName}",
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'User deleted successfully',
        ]);
    }

    /**
     * Return user data for editing.
     */
    public function edit($id)
    {
        $user = User::findOrFail($id);

        return response()->json([
            'status' => 'success',
            'user'   => $user,
        ]);
    }
}