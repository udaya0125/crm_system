<?php

namespace App\Http\Controllers;

use App\Http\Requests\Password\StorePasswordRequest;
use App\Http\Requests\Password\UpdatePasswordRequest;
use App\Models\Password;
use App\Services\PasswordService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class PasswordController extends Controller
{
    protected PasswordService $passwordService;

    public function __construct(PasswordService $passwordService)
    {
        $this->passwordService = $passwordService;
    }

    /**
     * Verify user's current password.
     */
    public function verify(Request $request)
    {
        $request->validate([
            'password' => ['required'],
        ]);

        if (Hash::check($request->password, auth()->user()->password)) {
            return response()->json([
                'status' => true,
                'verified' => true,
                'message' => 'Password verified successfully.',
            ]);
        }

        return response()->json([
            'status' => false,
            'verified' => false,
            'message' => 'Invalid password.',
        ], 422);
    }

    /**
     * Display all passwords.
     */
    public function index()
    {
        return response()->json([
            'status' => true,
            'data' => $this->passwordService->getAll(),
        ]);
    }

    /**
     * Store a newly created password.
     */
    public function store(StorePasswordRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image');
        }

        $password = $this->passwordService->create($data);

        return response()->json([
            'status' => true,
            'message' => 'Password created successfully.',
            'data' => $password,
        ], 201);
    }

    /**
     * Display the specified password.
     */
    public function show($id)
    {
        $password = Password::with([
            'organization',
            'category',
            'sub_category',
            'sub_sub_category',
        ])->findOrFail($id);

        try {
            $password->password = decrypt($password->password);
        } catch (\Exception $e) {
            $password->password = null;
        }

        return response()->json([
            'status' => true,
            'data' => $password,
        ]);
    }

    /**
     * Update the specified password.
     */
    public function update(UpdatePasswordRequest $request, $id)
    {
        $password = Password::findOrFail($id);

        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image');
        }

        $updatedPassword = $this->passwordService->update(
            $password,
            $data
        );

        return response()->json([
            'status' => true,
            'message' => 'Password updated successfully.',
            'data' => $updatedPassword,
        ]);
    }

    /**
     * Remove the specified password.
     */
    public function destroy($id)
    {
        $password = Password::findOrFail($id);

        $this->passwordService->delete($password);

        return response()->json([
            'status' => true,
            'message' => 'Password deleted successfully.',
        ]);
    }
}