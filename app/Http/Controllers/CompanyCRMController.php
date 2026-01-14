<?php

namespace App\Http\Controllers;

use App\Mail\MeetingScheduled;
use App\Models\Company;
use App\Models\CompanyContract;
use App\Models\CompanyFollowUpResponse;
use App\Models\CompanyInitialResponse;
use App\Models\CompanyMeeting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class CompanyCRMController extends Controller
{
    /* ============================================
     *                COMPANY CRUD
     * ============================================ */

    // LIST ALL COMPANIES WITH RELATIONS
    public function index()
    {
        try {
            $companies = Company::with([
                'initialResponses',
                'meetings',
                'followUpResponses',
                'contracts',
            ])->latest()->get();

            return response()->json($companies);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch companies',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // GET COMPANY BY SLUG
    public function indexBySlug($slug)
    {
        try {
            $company = Company::with([
                'initialResponses',
                'meetings',
                'followUpResponses',
                'contracts',
            ])->where('slug', $slug)->firstOrFail();

            return Inertia::render('EditPages/EditCRM', [
                'company' => $company,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch company',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // SHOW SINGLE COMPANY WITH ALL RELATIONS
    public function show($id)
    {
        try {
            $company = Company::with([
                'initialResponses',
                'meetings',
                'followUpResponses',
                'contracts',
            ])->findOrFail($id);

            return response()->json([
                'success' => true,
                'company_id' => $company->id,
                'company' => $company,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Company not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    // CREATE COMPANY
    public function storeCompany(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'company_name' => 'required|string|max:255',
            'full_name' => 'nullable|string|max:255',
            'designation' => 'nullable|string|max:255',
            'phone_no' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'responsible_person' => 'nullable|string|max:255',
            'our_team' => 'nullable|string|max:255',
            'client_member' => 'nullable|string|max:255',
            'comment' => 'nullable|string',
            'follow_up_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $company = Company::create($request->only([
                'company_name',
                'full_name',
                'designation',
                'phone_no',
                'email',
                'address',
                'responsible_person',
                'our_team',
                'client_member',
                'comment',
                'follow_up_date',
            ]));

            return response()->json([
                'message' => 'Company created successfully',
                'company_id' => $company->id,
                'company' => $company->load([
                    'initialResponses',
                    'meetings',
                    'followUpResponses',
                    'contracts',
                ]),
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create company',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // UPDATE COMPANY
    public function updateCompany(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'company_name' => 'sometimes|required|string|max:255',
            'full_name' => 'nullable|string|max:255',
            'designation' => 'nullable|string|max:255',
            'phone_no' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'responsible_person' => 'nullable|string|max:255',
            'our_team' => 'nullable|string|max:255',
            'client_member' => 'nullable|string|max:255',
            'comment' => 'nullable|string',
            'follow_up_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $company = Company::findOrFail($id);

            $company->update($request->only([
                'company_name',
                'full_name',
                'designation',
                'phone_no',
                'email',
                'address',
                'responsible_person',
                'our_team',
                'client_member',
                'comment',
                'follow_up_date',
            ]));

            return response()->json([
                'message' => 'Company updated successfully',
                'company_id' => $company->id,
                'company' => $company->fresh([
                    'initialResponses',
                    'meetings',
                    'followUpResponses',
                    'contracts',
                ]),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update company',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // DELETE COMPANY WITH ALL RELATED RECORDS
    public function deleteCompany($id)
    {
        try {
            DB::beginTransaction();

            $company = Company::find($id);

            if (! $company) {
                return response()->json([
                    'success' => false,
                    'message' => 'Company not found',
                ], 404);
            }

            \Log::info('Deleting company: '.$id);

            // Delete contract & image
            if ($company->contracts) {
                if ($company->contracts->image) {
                    $imagePath = $company->contracts->image;

                    if (strpos($imagePath, 'contracts/') === 0) {
                        $imagePath = 'public/'.$imagePath;
                    }

                    if (Storage::exists($imagePath)) {
                        Storage::delete($imagePath);
                    }
                }
                $company->contracts()->delete();
            }

            // Delete hasOne relations
            $company->initialResponses()?->delete();
            $company->meetings()?->delete();
            $company->followUpResponses()?->delete();

            // Delete company
            $company->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Company and related records deleted successfully',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            \Log::error('Company deletion error: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete company',
                'error' => $e->getMessage(),
            ], 500);
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
            'initial_reason' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $data = CompanyInitialResponse::create($request->only([
                'initial_response', 'company_id', 'meeting_outcome', 'initial_notes', 'initial_reason',
            ]));

            return response()->json([
                'message' => 'Initial Response added successfully',
                'initial_response_id' => $data->id,
                'company_id' => $data->company_id,
                'data' => $data->load('company'),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to add initial response',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateInitialResponse(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'initial_response' => 'sometimes|required|string',
            'meeting_outcome' => 'nullable|string',
            'initial_notes' => 'nullable|string',
            'initial_reason' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $data = CompanyInitialResponse::findOrFail($id);
            $data->update($request->only([
                'initial_response', 'meeting_outcome', 'initial_notes', 'initial_reason',
            ]));

            return response()->json([
                'message' => 'Initial Response updated successfully',
                'initial_response_id' => $data->id,
                'company_id' => $data->company_id,
                'data' => $data->fresh('company'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update initial response',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /* ============================================
     *              MEETING (STEP 2)
     * ============================================ */

    // public function storeMeeting(Request $request)
    // {
    //     $validator = Validator::make($request->all(), [
    //         'company_id' => 'required|exists:companies,id',
    //         'meeting_date' => 'required|date',
    //         'meeting_time' => 'required|date_format:H:i',
    //         'meeting_type' => 'required|string',
    //         'phone_details' => 'nullable|string',
    //         'meeting_location' => 'nullable|string',
    //         'attendee' => 'nullable|string',
    //         'agenda' => 'nullable|string',
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json([
    //             'message' => 'Validation failed',
    //             'errors' => $validator->errors(),
    //         ], 422);
    //     }

    //     try {
    //         $meeting = CompanyMeeting::create($request->only([
    //             'meeting_date', 'meeting_time', 'meeting_type', 'phone_details', 'meeting_location',
    //             'attendee', 'company_id', 'agenda',
    //         ]));

    //         return response()->json([
    //             'message' => 'Meeting added successfully',
    //             'meeting_id' => $meeting->id,
    //             'company_id' => $meeting->company_id,
    //             'data' => $meeting->load('company'),
    //         ], 201);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'message' => 'Failed to add meeting',
    //             'error' => $e->getMessage(),
    //         ], 500);
    //     }
    // }

    // public function updateMeeting(Request $request, $id)
    // {
    //     $validator = Validator::make($request->all(), [
    //         'meeting_date' => 'sometimes|required|date',
    //         'meeting_time' => 'sometimes|required|date_format:H:i',
    //         'meeting_type' => 'sometimes|required|string',
    //         'phone_details' => 'nullable|string',
    //         'meeting_location' => 'nullable|string',
    //         'attendee' => 'nullable|string',
    //         'agenda' => 'nullable|string',
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json([
    //             'message' => 'Validation failed',
    //             'errors' => $validator->errors(),
    //         ], 422);
    //     }

    //     try {
    //         $meeting = CompanyMeeting::findOrFail($id);
    //         $meeting->update($request->only([
    //             'meeting_date', 'meeting_time', 'meeting_type', 'phone_details', 'meeting_location',
    //             'attendee', 'agenda',
    //         ]));

    //         return response()->json([
    //             'message' => 'Meeting updated successfully',
    //             'meeting_id' => $meeting->id,
    //             'company_id' => $meeting->company_id,
    //             'data' => $meeting->fresh('company'),
    //         ]);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'message' => 'Failed to update meeting',
    //             'error' => $e->getMessage(),
    //         ], 500);
    //     }
    // }

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
            'phone_details' => 'nullable|string',
            'meeting_location' => 'nullable|string',
            'attendee' => 'nullable|string',
            'agenda' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $meeting = CompanyMeeting::create($request->only([
                'meeting_date', 'meeting_time', 'meeting_type', 'phone_details', 'meeting_location',
                'attendee', 'company_id', 'agenda',
            ]));

            // Load the company relationship
            $meeting->load('company');

            // Send email notification to admin
            try {
                $adminEmail = config('mail.admin_email', 'sandip@sait.com.np');
                Mail::to($adminEmail)->send(new MeetingScheduled($meeting));
            } catch (\Exception $mailException) {
                // Log the error but don't fail the meeting creation
                \Log::error('Failed to send meeting notification email: '.$mailException->getMessage());
            }

            return response()->json([
                'message' => 'Meeting added successfully',
                'meeting_id' => $meeting->id,
                'company_id' => $meeting->company_id,
                'data' => $meeting,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to add meeting',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateMeeting(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'meeting_date' => 'sometimes|required|date',
            'meeting_time' => 'sometimes|required|date_format:H:i',
            'meeting_type' => 'sometimes|required|string',
            'phone_details' => 'nullable|string',
            'meeting_location' => 'nullable|string',
            'attendee' => 'nullable|string',
            'agenda' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $meeting = CompanyMeeting::findOrFail($id);

            // Check if date or time is being updated
            $dateOrTimeChanged = $request->has('meeting_date') || $request->has('meeting_time');

            $meeting->update($request->only([
                'meeting_date', 'meeting_time', 'meeting_type', 'phone_details', 'meeting_location',
                'attendee', 'agenda',
            ]));

            // Load the company relationship
            $meeting->load('company');

            // Send email notification if date or time changed
            if ($dateOrTimeChanged) {
                try {
                    $adminEmail = config('mail.admin_email', 'sandip@sait.com.np');
                    Mail::to($adminEmail)->send(new MeetingScheduled($meeting));
                } catch (\Exception $mailException) {
                    \Log::error('Failed to send meeting update notification email: '.$mailException->getMessage());
                }
            }

            return response()->json([
                'message' => 'Meeting updated successfully',
                'meeting_id' => $meeting->id,
                'company_id' => $meeting->company_id,
                'data' => $meeting,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update meeting',
                'error' => $e->getMessage(),
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
            'follow_up_reason' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $data = CompanyFollowUpResponse::create($request->only([
                'follow_up_response', 'company_id', 'meeting_outcome', 'follow_up_notes', 'follow_up_reason',
            ]));

            return response()->json([
                'message' => 'Follow Up Response added successfully',
                'follow_up_id' => $data->id,
                'company_id' => $data->company_id,
                'data' => $data->load('company'),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to add follow up response',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateFollowUp(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'follow_up_response' => 'sometimes|required|string',
            'meeting_outcome' => 'nullable|string',
            'follow_up_notes' => 'nullable|string',
            'follow_up_reason' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $data = CompanyFollowUpResponse::findOrFail($id);
            $data->update($request->only([
                'follow_up_response', 'meeting_outcome', 'follow_up_notes', 'follow_up_reason',
            ]));

            return response()->json([
                'message' => 'Follow Up Response updated successfully',
                'follow_up_id' => $data->id,
                'company_id' => $data->company_id,
                'data' => $data->fresh('company'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update follow up response',
                'error' => $e->getMessage(),
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
            'image' => 'required|file|mimes:pdf,jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $imagePath = $request->file('image')->store('contracts', 'public');

            $contract = CompanyContract::create([
                'company_id' => $request->company_id,
                'image' => $imagePath,
            ]);

            return response()->json([
                'message' => 'Contract added successfully',
                'contract_id' => $contract->id,
                'company_id' => $contract->company_id,
                'image_url' => Storage::url($imagePath),
                'data' => $contract->load('company'),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to add contract',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateContract(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|file|mimes:pdf,jpeg,png,jpg,gif,svg|max:2048',
            'company_id' => 'required|exists:companies,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $contract = CompanyContract::findOrFail($id);

            if (! $request->hasFile('image')) {
                return response()->json([
                    'message' => 'No file provided',
                ], 422);
            }

            $imageFile = $request->file('image');

            \Log::info('Updating contract', [
                'contract_id' => $id,
                'file_name' => $imageFile->getClientOriginalName(),
                'file_size' => $imageFile->getSize(),
                'file_type' => $imageFile->getMimeType(),
            ]);

            if ($contract->image && Storage::disk('public')->exists($contract->image)) {
                Storage::disk('public')->delete($contract->image);
            }

            $imagePath = $imageFile->store('contracts', 'public');

            $contract->update([
                'image' => $imagePath,
                'company_id' => $request->company_id,
            ]);

            return response()->json([
                'message' => 'Contract updated successfully',
                'contract_id' => $contract->id,
                'company_id' => $contract->company_id,
                'image_url' => Storage::url($imagePath),
                'data' => $contract->fresh('company'),
            ]);

        } catch (\Exception $e) {
            \Log::error('Contract update failed: '.$e->getMessage());

            return response()->json([
                'message' => 'Failed to update contract',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
