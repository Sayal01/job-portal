<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Company;
use App\Models\Application;

class AdminController extends Controller
{
    //
    public function dashboardCounts()
    {
        $usersCount = User::count();
        $applicationsCount = Application::count();
        $companiesCount = Company::count();

        return response()->json([
            'users' => $usersCount,
            'applications' => $applicationsCount,
            'companies' => $companiesCount,
        ]);
    }
    // List users with optional role filter (all, employer, job_seeker)
    public function listUsers(Request $request)
    {
        $role = $request->query('role');

        $query = User::query();
        if ($role) {
            $query->where('role', $role);
        }

        $users = $query->get();

        return response()->json([
            'users' => $users
        ]);
    }
    public function listCompanies()
    {
        $companies = Company::with('employer')->get();

        return response()->json([
            'companies' => $companies,
        ]);
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
    // List applications
    public function listApplications()
    {
        $applications = Application::with(['user', 'job'])->get();

        return response()->json([
            'applications' => $applications,
        ]);
    }
}
