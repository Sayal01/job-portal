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

    // public function deleteUser($id)
    // {
    //     $user = User::findOrFail($id);
    //     $user->delete();

    //     return response()->json(['message' => 'User deleted successfully']);
    // }
    public function deleteUser(Request $request, $id)
    {
        $authenticatedUserId = $request->user()->id;

        if ((int) $id === $authenticatedUserId) {
            return response()->json(['message' => 'You cannot delete your own account.'], 403);
        }

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
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);


        $admin = User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => $request->email,
            'password' => $request->password,
            'role' => 'admin',
        ]);

        return response()->json(['message' => 'Admin created successfully', 'admin' => $admin]);
    }
}
