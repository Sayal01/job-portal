<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Job;
use Illuminate\Http\Request;
use App\Models\Notification;

class ApplicationController extends Controller
{
    // List all applications for logged-in user (job seeker)
    public function index()
    {
        $applications = Application::with('job.company')
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return response()->json($applications);
    }
    // Check if logged-in user has applied to a specific job
    public function hasApplied($jobId)
    {
        $userId = auth()->id();

        $applied = Application::where('job_id', $jobId)
            ->where('user_id', $userId)
            ->exists();

        return response()->json(['applied' => $applied]);
    }


    // Apply to a job
    public function store(Request $request, $jobId)
    {
        $user = auth()->user();

        if (!$user->profile || !$user->profile->resume_file) {
            return response()->json(['message' => 'Please upload your resume in your profile first.'], 400);
        }

        $request->validate([
            'cover_letter' => 'nullable|string',
        ]);
        $job = Job::with('company.employer')->findOrFail($jobId);

        $exists = Application::where('job_id', $job->id)
            ->where('user_id', auth()->id())
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Already applied to this job'], 409);
        }

        $application = Application::create([
            'job_id' => $job->id,
            'user_id' => auth()->id(),
            'cover_letter' => $request->cover_letter,
        ]);
        Notification::create([
            'user_id' => $job->company->employer->id, // recipient
            'type' => 'new_application',
            'data' => [
                'job_id' => $job->id,
                'job_title' => $job->title,
                'applicant_name' => $application->user->first_name . ' ' . $application->user->last_name,
                'application_id' => $application->id,
            ],
        ]);
        return response()->json($application, 201);
    }


    // Show single application (only the appplied seeker)
    public function show(Application $application)
    {
        if ($application->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return $application->load('job.company');
    }

    // Cancel (delete) application (only owner)
    public function destroy(Application $application)
    {
        if ($application->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $application->delete();

        return response()->json(['message' => 'Application cancelled']);
    }

    // List all applications for jobs owned by the authenticated company, including interview rounds
    public function employerIndex()
    {
        $employer = auth()->user()->company;

        if (!$employer) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $applications = Application::with(['job', 'user.profile', 'interviews']) // include interviews
            ->whereHas('job', function ($query) use ($employer) {
                $query->where('company_id', $employer->id);
            })
            ->latest()
            ->get();

        return response()->json($applications);
    }
    public function viewApplicantsForJob($jobId)
    {
        $employer = auth()->user()->company;

        if (!$employer) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Fetch the job and ensure it belongs to the employer
        $job = $employer->jobs()->with('applications.user')->find($jobId);

        if (!$job) {
            return response()->json(['error' => 'Job not found or not owned by employer'], 404);
        }

        return response()->json([
            'status' => true,
            'job' => [
                'id' => $job->id,
                'title' => $job->title,
                'applicants' => $job->applications->map(function ($application) {
                    return [
                        'application_id' => $application->id,
                        'applicant' => trim(($application->user->first_name ?? '') . ' ' . ($application->user->last_name ?? '')) ?: 'N/A',
                        'user_id' => $application->user->id ?? null,
                        'email' => $application->user->email ?? 'N/A',
                        'status' => $application->status,
                        'applied_at' => $application->created_at->toDateString(),
                        // Add other fields like resume, cover letter etc. if needed
                    ];
                }),
            ],
        ]);
    }

    public function showApplicant($userId)
    {
        $authUser = auth()->user();

        // Allow admin to view any applicant
        if ($authUser->role === 'admin') {
            $application = Application::where('user_id', $userId)
                ->with('user.profile') // eager load user and profile
                ->first();

            if (!$application) {
                return response()->json(['error' => 'Applicant not found'], 404);
            }

            return response()->json([
                'user' => $application->user,
            ]);
        }

        // If not admin, must be an employer
        $employerCompany = $authUser->company;

        if (!$employerCompany) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $application = Application::where('user_id', $userId)
            ->whereHas('job', function ($query) use ($employerCompany) {
                $query->where('company_id', $employerCompany->id);
            })
            ->with('user.profile')
            ->first();

        if (!$application) {
            return response()->json(['error' => 'Applicant not found or no application to your jobs'], 404);
        }

        return response()->json([
            'user' => $application->user,
        ]);
    }
    public function recentApplications()
    {
        $employer = auth()->user()->company;

        if (!$employer) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $applications = Application::whereHas('job', function ($q) use ($employer) {
            $q->where('company_id', $employer->id);
        })
            ->with(['user.profile'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($application) {
                return [
                    'id' => $application->id,
                    'applicant' => $application->user->first_name ?? 'Unknown',
                    'position' => $application->job->title ?? 'Unknown',
                    'appliedDate' => $application->created_at->toDateString(),
                    'status' => $application->status,
                    'avatar' => $application->user->profile->avatar_url ?? null,
                ];
            });

        return response()->json(['status' => true, 'data' => $applications]);
    }




    public function updateStatus(Request $request, Application $application)
    {
        $employer = auth()->user()->company;

        if (!$employer || $application->job->company_id !== $employer->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'status' => 'required|in:pending,shortlisted,in_interview,selected,rejected',
        ]);

        $application->status = $request->status;
        $application->save();
        Notification::create([
            'user_id' => $application->user_id,
            'type' => 'application_status_update',
            'data' => [
                'job_title' => $application->job->title,
                'status' => $application->status,
            ],
            'read' => false,
        ]);
        return response()->json($application);
    }
}
