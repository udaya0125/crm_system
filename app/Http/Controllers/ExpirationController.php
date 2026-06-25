<?php

namespace App\Http\Controllers;

use App\Models\Expiration;
use Illuminate\Http\Request;
use App\Services\ExpirationService;
use App\Http\Requests\StoreExpirationRequest;
use App\Http\Requests\UpdateExpirationRequest;

class ExpirationController extends Controller
{
    public function __construct(
        private ExpirationService $expirationService
    ) {}

    /**
     * Display all expirations.
     */
    public function index()
    {
        $expirations = Expiration::with('client')
            ->latest()
            ->get();

        $this->expirationService->checkExpiringItems();

        return response()->json([
            'status' => true,
            'message' => 'Expirations retrieved successfully',
            'data' => $expirations,
        ]);
    }

    /**
     * Store a newly created expiration.
     */
    public function store(StoreExpirationRequest $request)
    {
        $expiration = $this->expirationService->store(
            $request->validated(),
            $request
        );

        return response()->json([
            'status' => true,
            'message' => 'Expiration created successfully',
            'data' => $expiration,
        ], 201);
    }

    /**
     * Display a specific expiration.
     */
    public function show($id)
    {
        $expiration = Expiration::with('client')
            ->findOrFail($id);

        return response()->json([
            'status' => true,
            'data' => $expiration,
        ]);
    }

    /**
     * Get expiration data for editing.
     */
    public function edit($id)
    {
        $expiration = Expiration::with('client')
            ->findOrFail($id);

        return response()->json([
            'status' => true,
            'data' => $expiration,
        ]);
    }

    /**
     * Update the specified expiration.
     */
    public function update(
        UpdateExpirationRequest $request,
        $id
    ) {
        $expiration = Expiration::findOrFail($id);

        $expiration = $this->expirationService->update(
            $expiration,
            $request->validated(),
            $request
        );

        return response()->json([
            'status' => true,
            'message' => 'Expiration updated successfully',
            'data' => $expiration,
        ]);
    }

    /**
     * Remove the specified expiration.
     */
    public function destroy(Request $request, $id)
    {
        $expiration = Expiration::with('client')
            ->findOrFail($id);

        $this->expirationService->delete(
            $expiration,
            $request
        );

        return response()->json([
            'status' => true,
            'message' => 'Expiration deleted successfully',
        ]);
    }
}