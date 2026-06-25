<?php

namespace App\Http\Controllers;

use App\Http\Requests\HostingManagement\StoreHostingManagementRequest;
use App\Http\Requests\HostingManagement\UpdateHostingManagementRequest;
use App\Models\HostingManagement;
use App\Services\HostingManagementService;
use Illuminate\Http\Request;

class HostingManagementController extends Controller
{
    public function __construct(
        private HostingManagementService $hostingService
    ) {}

    public function index()
    {
        $this->hostingService->checkExpiringHostings();

        return response()->json([
            'status' => true,
            'data' => $this->hostingService->getAll()
        ]);
    }

    public function store(StoreHostingManagementRequest $request)
    {
        return response()->json([
            'status' => true,
            'message' => 'Hosting created successfully',
            'data' => $this->hostingService->create(
                $request->validated(),
                $request
            )
        ], 201);
    }

    public function update(
        UpdateHostingManagementRequest $request,
        $id
    ) {
        $hosting = HostingManagement::findOrFail($id);

        return response()->json([
            'status' => true,
            'message' => 'Hosting updated successfully',
            'data' => $this->hostingService->update(
                $hosting,
                $request->validated(),
                $request
            )
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $hosting = HostingManagement::with('client')
            ->findOrFail($id);

        $this->hostingService->delete(
            $hosting,
            $request
        );

        return response()->json([
            'status' => true,
            'message' => 'Hosting deleted successfully'
        ]);
    }
}