<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanyContract;
use App\Models\CompanyInitialResponse;
use App\Models\CompanyFollowUpResponse;
use App\Models\CompanyMeeting;
use Illuminate\Http\Request;

class CompanyCRMController extends Controller
{
    /* ============================
       COMPANY CRUD
    ============================= */

    public function index()
    {
        $companies = Company::with([
            'contracts',
            'initialResponses',
            'followUpResponses',
            'meetings'
        ])->get();

        return response()->json($companies);
    }

    public function storeCompany(Request $request)
    {
        $company = Company::create($request->all());
        return response()->json($company, 201);
    }

    public function updateCompany(Request $request, $id)
    {
        $company = Company::findOrFail($id);
        $company->update($request->all());

        return response()->json($company);
    }

    public function destroy($id)
    {
        $company = Company::findOrFail($id);

        // delete child relations
        $company->contracts()->delete();
        $company->initialResponses()->delete();
        $company->followUpResponses()->delete();
        $company->meetings()->delete();

        $company->delete();

        return response()->json(['message' => 'Company and all related records deleted']);
    }


    /* ============================
       INITIAL RESPONSE CRUD
    ============================= */

    public function storeInitialResponse(Request $request)
    {
        $data = $request->all();
        $initial = CompanyInitialResponse::create($data);

        return response()->json($initial, 201);
    }

    public function updateInitialResponse(Request $request, $id)
    {
        $initial = CompanyInitialResponse::findOrFail($id);
        $initial->update($request->all());

        return response()->json($initial);
    }


    /* ============================
       FOLLOW UP RESPONSE CRUD
    ============================= */

    public function storeFollowUpResponse(Request $request)
    {
        $data = $request->all();
        $followup = CompanyFollowUpResponse::create($data);

        return response()->json($followup, 201);
    }

    public function updateFollowUpResponse(Request $request, $id)
    {
        $followup = CompanyFollowUpResponse::findOrFail($id);
        $followup->update($request->all());

        return response()->json($followup);
    }


    /* ============================
       MEETING CRUD
    ============================= */

    public function storeMeeting(Request $request)
    {
        $meeting = CompanyMeeting::create($request->all());
        return response()->json($meeting, 201);
    }

    public function updateMeeting(Request $request, $id)
    {
        $meeting = CompanyMeeting::findOrFail($id);
        $meeting->update($request->all());

        return response()->json($meeting);
    }


    /* ============================
       CONTRACT CRUD
    ============================= */

    public function storeContract(Request $request)
    {
        $contract = CompanyContract::create($request->all());
        return response()->json($contract, 201);
    }

    public function updateContract(Request $request, $id)
    {
        $contract = CompanyContract::findOrFail($id);
        $contract->update($request->all());

        return response()->json($contract);
    }
}
