<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanyContract;
use App\Models\CompanyInitialResponse;
use App\Models\CompanyFollowUpResponse;
use App\Models\CompanyMeeting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CompanyCRMController extends Controller
{
    /* ============================================
     *                COMPANY CRUD
     * ============================================ */

    // LIST ALL COMPANIES
    public function index()
    {
        try {
            $companies = Company::with([
                'initialResponses',
                'meetings',
                'followUpResponses',
                'contracts'
            ])->latest()->get();

            return response()->json($companies);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch companies',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function indexBySlug($slug)
    {
        try {
            $company = Company::with([
                'initialResponses',
                'meetings',
                'followUpResponses',
                'contracts'
            ])->where('slug', $slug)->firstOrFail();

            return Inertia::render('EditPages/EditCRM',[
                'company' => $company
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch company',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // CREATE COMPANY
    public function storeCompany(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'company_name' => 'required|string|max:255',
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone_no' => 'nullable|string|max:20',
            'status' => 'nullable|string|max:50',
            'client_member' => 'nullable|string|max:255',
            'designation' => 'nullable|string|max:255',
            'no_of_rooms' => 'nullable|integer',
            'address' => 'nullable|string',
            'website' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:255',
            'responsible_person' => 'nullable|string|max:255',
            'preffered_message' => 'nullable|string|max:255',
            'message_contact' => 'nullable|string|max:255',
            'follow_up_date' => 'nullable|date',
            'comment' => 'nullable|string',
           
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $company = Company::create($request->only([
                'company_name', 'first_name', 'last_name', 'client_member', 'designation',
                'no_of_rooms', 'phone_no', 'email', 'address', 'website', 'source',
                'responsible_person', 'preffered_message', 'message_contact', 'comment','follow_up_date',
                'status'
            ]));

            return response()->json([
                'message' => 'Company created successfully',
                'company_id' => $company->id,
                'company' => $company->load(['initialResponses', 'meetings', 'followUpResponses', 'contracts'])
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create company',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // UPDATE COMPANY
    public function updateCompany(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'company_name' => 'sometimes|required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone_no' => 'nullable|string|max:20',
            'status' => 'nullable|string|max:50',
            'client_member' => 'nullable|string|max:255',
            'designation' => 'nullable|string|max:255',
            'no_of_rooms' => 'nullable|integer',
            'address' => 'nullable|string',
            'website' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:255',
            'responsible_person' => 'nullable|string|max:255',
            'preffered_message' => 'nullable|string|max:255',
            'message_contact' => 'nullable|string|max:255',
            'follow_up_date' => 'nullable|date',
            'comment' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $company = Company::findOrFail($id);

            $company->update($request->only([
                'company_name', 'first_name', 'last_name', 'client_member', 'designation',
                'no_of_rooms', 'phone_no', 'email', 'address', 'website', 'source',
                'responsible_person', 'preffered_message', 'message_contact', 'comment',
                'follow_up_date',
                'status'
            ]));

            return response()->json([
                'message' => 'Company updated successfully',
                'company_id' => $company->id,
                'company' => $company->fresh(['initialResponses', 'meetings', 'followUpResponses', 'contracts'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update company',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // DELETE COMPANY + ALL RELATED RECORDS
    public function deleteCompany($id)
    {
        try {
            DB::transaction(function () use ($id) {
                $company = Company::findOrFail($id);

                // Delete contract images from storage first
                $contracts = $company->contracts;
                foreach ($contracts as $contract) {
                    if ($contract->image && Storage::exists($contract->image)) {
                        Storage::delete($contract->image);
                    }
                }

                $company->contracts()->delete();
                $company->initialResponses()->delete();
                $company->meetings()->delete();
                $company->followUpResponses()->delete();

                $company->delete();
            });

            return response()->json([
                'message' => 'Company and all related records deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete company',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // SHOW SINGLE COMPANY WITH RELATIONS
    public function showCompany($id)
    {
        try {
            $company = Company::with([
                'initialResponses',
                'meetings',
                'followUpResponses',
                'contracts'
            ])->findOrFail($id);

            return response()->json([
                'company_id' => $company->id,
                'company' => $company
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Company not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /* ============================================
     *        INITIAL RESPONSE (STEP 1)
     * ============================================ */

    public function storeInitialResponse(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'company_id' => 'required|exists:companies,id',
            'initial_response' => 'required|string',
            'meeting_outcome' => 'nullable|string',
            'initial_notes' => 'nullable|string',
            'initial_reason' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = CompanyInitialResponse::create($request->only([
                'initial_response', 'company_id', 'meeting_outcome', 'initial_notes', 'initial_reason'
            ]));

            return response()->json([
                'message' => 'Initial Response added successfully',
                'initial_response_id' => $data->id,
                'company_id' => $data->company_id,
                'data' => $data->load('company')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to add initial response',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateInitialResponse(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'initial_response' => 'sometimes|required|string',
            'meeting_outcome' => 'nullable|string',
            'initial_notes' => 'nullable|string',
            'initial_reason' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = CompanyInitialResponse::findOrFail($id);
            $data->update($request->only([
                'initial_response', 'meeting_outcome', 'initial_notes', 'initial_reason'
            ]));

            return response()->json([
                'message' => 'Initial Response updated successfully',
                'initial_response_id' => $data->id,
                'company_id' => $data->company_id,
                'data' => $data->fresh('company')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update initial response',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /* ============================================
     *              MEETING (STEP 2)
     * ============================================ */

    public function storeMeeting(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'company_id' => 'required|exists:companies,id',
            'meeting_date' => 'required|date',
            'meeting_time' => 'required|date_format:H:i',
            'meeting_type' => 'required|string',
            'meeting_platform' => 'nullable|string',
            'meeting_location' => 'nullable|string',
            'attendee' => 'nullable|string',
            'agenda' => 'nullable|string'

        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $meeting = CompanyMeeting::create($request->only([
                'meeting_date', 'meeting_time', 'meeting_type', 'meeting_platform', 'meeting_location',
                'attendee', 'company_id', 'agenda'
            ]));

            return response()->json([
                'message' => 'Meeting added successfully',
                'meeting_id' => $meeting->id,
                'company_id' => $meeting->company_id,
                'data' => $meeting->load('company')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to add meeting',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateMeeting(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'meeting_date' => 'sometimes|required|date',
            'meeting_time' => 'sometimes|required|date_format:H:i',
            'meeting_type' => 'sometimes|required|string',
            'meeting_platform' => 'nullable|string',
            'meeting_location' => 'nullable|string',
            'attendee' => 'nullable|string',
            'agenda' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $meeting = CompanyMeeting::findOrFail($id);
            $meeting->update($request->only([
                'meeting_date', 'meeting_time', 'meeting_type', 'meeting_platform', 'meeting_location',
                'attendee', 'agenda'
            ]));

            return response()->json([
                'message' => 'Meeting updated successfully',
                'meeting_id' => $meeting->id,
                'company_id' => $meeting->company_id,
                'data' => $meeting->fresh('company')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update meeting',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /* ============================================
     *        FOLLOW UP RESPONSE (STEP 3)
     * ============================================ */

    public function storeFollowUp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'company_id' => 'required|exists:companies,id',
            'follow_up_response' => 'required|string',
            'meeting_outcome' => 'nullable|string',
            'follow_up_notes' => 'nullable|string',
            'follow_up_reason' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = CompanyFollowUpResponse::create($request->only([
                'follow_up_response', 'company_id', 'meeting_outcome', 'follow_up_notes', 'follow_up_reason'
            ]));

            return response()->json([
                'message' => 'Follow Up Response added successfully',
                'follow_up_id' => $data->id,
                'company_id' => $data->company_id,
                'data' => $data->load('company')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to add follow up response',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateFollowUp(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'follow_up_response' => 'sometimes|required|string',
            'meeting_outcome' => 'nullable|string',
            'follow_up_notes' => 'nullable|string',
            'follow_up_reason' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = CompanyFollowUpResponse::findOrFail($id);
            $data->update($request->only([
                'follow_up_response', 'meeting_outcome', 'follow_up_notes', 'follow_up_reason'
            ]));

            return response()->json([
                'message' => 'Follow Up Response updated successfully',
                'follow_up_id' => $data->id,
                'company_id' => $data->company_id,
                'data' => $data->fresh('company')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update follow up response',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /* ============================================
     *               CONTRACT (STEP 4)
     * ============================================ */

    public function storeContract(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'company_id' => 'required|exists:companies,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,pdf|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Store the image in storage/app/public/contracts
            $imagePath = $request->file('image')->store('contracts', 'public');

            $contract = CompanyContract::create([
                'company_id' => $request->company_id,
                'image' => $imagePath
            ]);

            return response()->json([
                'message' => 'Contract added successfully',
                'contract_id' => $contract->id,
                'company_id' => $contract->company_id,
                'image_url' => Storage::url($imagePath), // Return the public URL
                'data' => $contract->load('company')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to add contract',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateContract(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,pdf|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $contract = CompanyContract::findOrFail($id);

            // Delete old image if exists
            if ($contract->image && Storage::disk('public')->exists($contract->image)) {
                Storage::disk('public')->delete($contract->image);
            }

            // Store new image
            $imagePath = $request->file('image')->store('contracts', 'public');

            $contract->update([
                'image' => $imagePath
            ]);

            return response()->json([
                'message' => 'Contract updated successfully',
                'contract_id' => $contract->id,
                'company_id' => $contract->company_id,
                'image_url' => Storage::url($imagePath), // Return the public URL
                'data' => $contract->fresh('company')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update contract',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // DELETE CONTRACT
    public function deleteContract($id)
    {
        try {
            $contract = CompanyContract::findOrFail($id);

            // Delete image from storage
            if ($contract->image && Storage::disk('public')->exists($contract->image)) {
                Storage::disk('public')->delete($contract->image);
            }

            $contract->delete();

            return response()->json([
                'message' => 'Contract deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete contract',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}