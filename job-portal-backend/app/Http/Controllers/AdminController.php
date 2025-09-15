<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Company;
use App\Models\Application;
use App\Models\Department;
use App\Models\Job;
use Carbon\Carbon;

class AdminController extends Controller
{
    //
    // public function dashboardCounts()
    // {
    //     return response()->json([
    //         'counts' => [
    //             'users' => User::count(),
    //             'companies' => Company::count(),
    //             'jobs' => Job::count(),
    //             'applications' => Application::count(),
    //             'departments' => Department::count(), // new
    //             'selected' => Application::where('status', 'selected')->count(),
    //             'pending' => Application::where('status', 'pending')->count(),
    //             'rejected' => Application::where('status', 'rejected')->count(),
    //         ],
    //         'applications_per_month' => Application::selectRaw('MONTHNAME(created_at) as month, COUNT(*) as count')
    //             ->groupBy('month')->orderByRaw('MIN(created_at)')->get(),
    //         'users_per_month' => User::selectRaw('MONTHNAME(created_at) as month, COUNT(*) as count')
    //             ->groupBy('month')->orderByRaw('MIN(created_at)')->get(),
    //         'top_companies' => Job::selectRaw('companies.company_name as name, COUNT(jobs.id) as count')
    //             ->join('companies', 'jobs.company_id', '=', 'companies.id')
    //             ->groupBy('companies.company_name')->orderByDesc('count')->limit(5)->get(),
    //         'top_jobs' => Application::selectRaw('jobs.title as name, COUNT(applications.id) as count')
    //             ->join('jobs', 'applications.job_id', '=', 'jobs.id')
    //             ->groupBy('jobs.title')->orderByDesc('count')->limit(5)->get(),
    //     ]);
    // }
    public function dashboardCounts(Request $request)
    {
        $range = $request->query('range', '6months'); // default last 6 months

        switch ($range) {
            case '30days':
                $startDate = Carbon::now()->subDays(30);
                break;
            case '1year':
                $startDate = Carbon::now()->subYear();
                break;
            case '6months':
            default:
                $startDate = Carbon::now()->subMonths(6);
                break;
        }

        // Applications per month
        $applicationsData = Application::where('created_at', '>=', $startDate)
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Users per month
        $usersData = User::where('created_at', '>=', $startDate)
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Hiring status
        $hiredCount = Application::where('status', 'selected')->where('created_at', '>=', $startDate)->count();
        $pendingCount = Application::where('status', 'pending')->where('created_at', '>=', $startDate)->count();
        $rejectedCount = Application::where('status', 'rejected')->where('created_at', '>=', $startDate)->count();

        // Top companies with most jobs
        $topCompanies = Job::where('jobs.created_at', '>=', $startDate)
            ->join('companies', 'jobs.company_id', '=', 'companies.id')
            ->selectRaw('companies.company_name as name, COUNT(jobs.id) as count')
            ->groupBy('companies.company_name')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        // Top jobs with most applications
        $topJobs = Application::where('applications.created_at', '>=', $startDate)
            ->join('jobs', 'applications.job_id', '=', 'jobs.id')
            ->selectRaw('jobs.title as name, COUNT(applications.id) as count')
            ->groupBy('jobs.title')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        return response()->json([
            'counts' => [
                'users' => User::count(),
                'companies' => Company::count(),
                'jobs' => Job::count(),
                'applications' => Application::count(),
                'departments' => Department::count(),
                'selected' => $hiredCount,
                'pending' => $pendingCount,
                'rejected' => $rejectedCount,
            ],
            'applications_per_month' => $applicationsData,
            'users_per_month' => $usersData,
            'top_companies' => $topCompanies,
            'top_jobs' => $topJobs,
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
    public function adminIndex()
    {
        // Only allow admin role
        if (auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $jobs = Job::with('company', 'department')->latest()->get();

        return response()->json([
            'status' => true,
            'jobs' => $jobs,
        ]);
    }

    // Admin: Update any job
    public function adminUpdate(Request $request, Job $job)
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Validate input same as update method
        $request->validate([
            'title' => 'sometimes|string|max:255',
            'department_id' => 'sometimes|nullable|exists:departments,id',
            'location' => 'sometimes|string|max:255',
            'type' => 'sometimes|in:full-time,part-time,internship',
            "min_experience" => "nullable|string|max:255",
            "max_experience" => "nullable|string|max:255",
            'salary_min' => 'nullable|numeric',
            'salary_max' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:255',
            'responsibilities' => 'nullable|array',
            'responsibilities.*' => 'string',
            'requirements' => 'nullable|array',
            'requirements.*' => 'string',
            'qualifications' => 'nullable|array',
            'qualifications.*' => 'string',
            'skills' => 'nullable|array',
            'skills.*' => 'string',
            'applicationDeadline' => 'nullable|date',
            'startDate' => 'nullable|date',
        ]);

        $job->update([
            'title' => $request->title ?? $job->title,
            'department_id' => $request->department_id ?? $job->department_id,
            'location' => $request->location ?? $job->location,
            'type' => $request->type ?? $job->type,
            'experience_level' => $request->experience_level ?? $job->experience_level,
            'salary_min' => $request->salary_min ?? $job->salary_min,
            'salary_max' => $request->salary_max ?? $job->salary_max,
            'description' => $request->description ?? $job->description,
            'responsibilities' => $request->responsibilities ?? $job->responsibilities,
            'requirements' => $request->requirements ?? $job->requirements,
            'qualifications' => $request->qualifications ?? $job->qualifications,
            'skills' => $request->skills ?? $job->skills,
            'application_deadline' => $request->applicationDeadline ?? $job->application_deadline,
            'start_date' => $request->startDate ?? $job->start_date,
        ]);

        return response()->json([
            'status' => true,
            'job' => $job->load('company', 'department'),
        ]);
    }

    // Admin: Delete any job
    public function adminDestroy(Job $job)
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $job->delete();

        return response()->json([
            'status' => true,
            'message' => 'Job deleted by admin',
        ]);
    }
}
