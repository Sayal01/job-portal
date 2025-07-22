<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CompanyController extends Controller
{
    //

    public function index()
    {
        $companies = Company::withCount('jobs')->with('employer')->get();


        return response()->json([
            'status' => true,
            'companies' => $companies
        ]);
    }

    public function show(Company $company)
    {
        $company->load('jobs');

        return response()->json([
            'status' => true,
            'company' => $company
        ]);
    }
    public function showOwnCompany(Request $request)
    {
        $user = $request->user();
        $company = Company::with('jobs', 'employer')->where('user_id', $user->id)->first();


        if (!$company) {
            return response()->json(['status' => false, 'message' => 'Company not found'], 404);
        }

        return response()->json(['status' => true, 'company' => $company]);
    }

    // ✅ Update company info
    public function updateCompany(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'employer') {
            return response()->json(['status' => false, 'error' => 'Only employer can update company info'], 403);
        }

        $request->validate([
            'company_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'website' => 'nullable|url',
            'logo' => 'nullable|image|max:2048'
        ]);

        $company = $user->company ?? new Company(['user_id' => $user->id]);

        $company->company_name = $request->company_name;
        $company->description = $request->description;
        $company->website = $request->website;

        if ($request->hasFile('logo')) {
            if ($company->logo && Storage::disk('public')->exists($company->logo)) {
                Storage::disk('public')->delete($company->logo);
            }
            $path = $request->file('logo')->store('companies', 'public');
            $company->logo = $path;
        }

        $company->save();

        return response()->json([
            'status' => true,
            'company' => $company
        ]);
    }


    public function destroy(Request $request, Company $company)
    {
        $user = $request->user();

        if ($user->id !== $company->user_id && $user->role !== 'admin') {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized.'
            ], 403);
        }

        $company->delete();

        return response()->json([
            'status' => true,
            'message' => 'Company deleted successfully.'
        ]);
    }
}
