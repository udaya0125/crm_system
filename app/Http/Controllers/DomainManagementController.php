<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDomainManagementRequest;
use App\Http\Requests\UpdateDomainManagementRequest;
use App\Services\DomainManagementService;
use Illuminate\Http\Request;

class DomainManagementController extends Controller
{
    public function __construct(
        private DomainManagementService $domainService
    ) {}

    public function index()
    {
        return response()->json([
            'status' => true,
            'data' => $this->domainService->getAllDomains()
        ]);
    }

    public function store(StoreDomainManagementRequest $request)
    {
        return response()->json([
            'status' => true,
            'message' => 'Domain created successfully',
            'data' => $this->domainService->createDomain(
                $request->validated(),
                $request
            )
        ], 201);
    }

    public function update(UpdateDomainManagementRequest $request, $id)
    {
        return response()->json([
            'status' => true,
            'message' => 'Domain updated successfully',
            'data' => $this->domainService->updateDomain(
                $id,
                $request->validated(),
                $request
            )
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $this->domainService->deleteDomain($id, $request);

        return response()->json([
            'status' => true,
            'message' => 'Domain deleted successfully'
        ]);
    }
}