<?php

namespace App\Http\Controllers;

use App\Models\Job;
use App\Services\JobRecommenderService;
use Illuminate\Http\Request;

class JobController extends Controller
{
    // List all jobs with company info
    public function index()
    {
        try {
            $today = now()->toDateString();


            $jobs = Job::with('company', 'department')
                // ->whereDate('start_date', '<=', $today)
                // ->whereDate('application_deadline', '>=', $today)
                ->latest()
                ->get();
            return response()->json([
                'status' => true,
                'jobs' => $jobs,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch jobs',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function getJobsByDepartment($id)
    {
        $jobs = Job::with('company', 'department')
            ->where('department_id', $id)
            ->latest()
            ->get();
        return response()->json([
            'status' => true,
            'jobs' => $jobs,
        ]);
    }


    // shows jobs owned my logged in employer
    public function myJobs()
    {
        $employer = auth()->user()->company;

        if (!$employer) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $jobs = $employer->jobs()->with('company')->withCount('applications')->latest()->get();

        return response()->json([
            'status' => true,
            'jobs' => $jobs,
        ]);
    }


    // Create a new job post (only for companies)
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'department_id' => 'nullable|exists:departments,id',
                'location' => 'required|string|max:255',
                'type' => 'nullable|string|max:255',
                'min_experience' => 'nullable|integer|min:0',
                'max_experience' => 'nullable|integer|min:0',
                'salary_min' => 'nullable|string|max:255',
                'salary_max' => 'nullable|string|max:255',
                'description' => 'nullable|string',
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

            $employer = auth()->user()->company;

            if (!$employer) {
                return response()->json(['error' => 'Only employers can create jobs'], 403);
            }

            $job = $employer->jobs()->create([
                'title' => $validated['title'],
                'department_id' => $validated['department_id'] ?? null,
                'location' => $validated['location'],
                'type' => $validated['type'] ?? null,
                'min_experience' => $validated['min_experience'] ?? null,
                'max_experience' => $validated['max_experience'] ?? null,
                'salary_min' => $validated['salary_min'] ?? null,
                'salary_max' => $validated['salary_max'] ?? null,
                'description' => $validated['description'] ?? null,
                'responsibilities' => $validated['responsibilities'] ?? [],
                'requirements' => $validated['requirements'] ?? [],
                'qualifications' => $validated['qualifications'] ?? [],
                'skills' => $validated['skills'] ?? [],
                'application_deadline' => $validated['applicationDeadline'] ?? null,
                'start_date' => $validated['startDate'] ?? null,
            ]);

            return response()->json(['job' => $job->load('company', 'department'), 'status' => "ok"], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error creating job',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Show details for a single job
    public function show(Job $job)
    {
        return $job->load('company', 'department');
    }

    public function activeJobs()
    {
        $employer = auth()->user()->company;

        if (!$employer) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $jobs = Job::where('company_id', $employer->id)

            ->withCount('applications')  // You may need to define the relation in Job model
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($job) {
                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'department' => $job->department->name ?? 'N/A',
                    'applications' => $job->applications_count,
                    'postedDate' => $job->created_at->toDateString(),
                ];
            });

        return response()->json(['status' => true, 'data' => $jobs]);
    }

    // Update job post (only owner company)
    public function update(Request $request, Job $job)
    {
        $employer = auth()->user()->company;

        if (!$employer || $job->company_id !== $employer->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'department_id' => 'sometimes|nullable|exists:departments,id',
            'location' => 'sometimes|string|max:255',
            'type' => 'sometimes|in:full-time,part-time,internship',
            'min_experience' => 'nullable|integer|min:0',
            'max_experience' => 'nullable|integer|min:0',
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
            'min_experience' => $request->min_experience ?? $job->min_experience,
            'max_experience' => $request->max_experience ?? $job->max_experience,
            'salary_min' => $request->salary_min ?? $job->salary_min,
            'salary_max' => $request->salary_max     ?? $job->salary_max,
            'description' => $request->description ?? $job->description,
            'responsibilities' => $request->responsibilities ?? $job->responsibilities,
            'requirements' => $request->requirements ?? $job->requirements,
            'qualifications' => $request->qualifications ?? $job->qualifications,
            'skills' => $request->skills ?? $job->skills,
            'application_deadline' => $request->applicationDeadline ?? $job->application_deadline,
            'start_date' => $request->startDate ?? $job->start_date,
        ]);
        return response()->json($job->load('company', 'department'));
    }

    // Delete job post (only owner company)
    public function destroy(Job $job)
    {
        $employer = auth()->user()->company;

        if (!$employer || $job->company_id !== $employer->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $job->delete();

        return response()->json(['message' => 'Job deleted']);
    }




    public function recommendJobs(Request $request, JobRecommenderService $recommender)
    {
        $user = $request->user();

        // Step 1: Get user's applied jobs (no skills relationship)
        $interactedJobs = $user->appliedJobs()->get();

        // Step 2: Fallback if no interactions yet
        if ($interactedJobs->isEmpty()) {
            // Get recent jobs
            $jobs = Job::latest()->limit(10)->get();
            return response()->json($jobs);
        }

        // Step 3: Load all jobs
        $allJobs = Job::all();

        // Step 4: Extract features of interacted jobs
        $interactedFeatures = $interactedJobs->map(
            fn($job) =>
            $recommender->extractFeatures($job)
        );

        $recommendations = [];

        // Step 5: Compare each job with interacted jobs using Jaccard
        foreach ($allJobs as $job) {
            if ($interactedJobs->contains('id', $job->id)) {
                continue; // Skip jobs already applied for
            }

            $jobFeatures = $recommender->extractFeatures($job);
            $maxSim = 0;

            foreach ($interactedFeatures as $features) {
                $sim = $recommender->jaccardSimilarity($features, $jobFeatures);
                if ($sim > $maxSim) {
                    $maxSim = $sim;
                }
            }

            if ($maxSim > 0) {
                $recommendations[] = [
                    'job' => $job,
                    'score' => $maxSim,
                ];
            }
        }

        // Step 6: Sort by similarity descending
        usort($recommendations, fn($a, $b) => $b['score'] <=> $a['score']);

        // Step 7: Return top 10 jobs
        $topJobs = array_slice($recommendations, 0, 10);

        $result = array_map(function ($rec) {
            return [
                'job' => $rec['job'],
                'score' => round($rec['score'], 3),  // Round score for readability
            ];
        }, $topJobs);

        return response()->json([
            'status' => true,
            'recomendations' => $result
        ]);
    }
    public function search(Request $request)
    {
        $query    = $request->input('q');        // keyword
        $location = $request->input('location'); // location filter
        $type     = $request->input('type');     // job type filter

        $jobs = Job::query()
            ->when($query, function ($q) use ($query) {
                $q->where(function ($sub) use ($query) {
                    $sub->where('title', 'LIKE', "%{$query}%")
                        ->orWhere('description', 'LIKE', "%{$query}%")
                        ->orWhere('location', 'LIKE', "%{$query}%");
                });
            })
            ->when($location, function ($q) use ($location) {
                $q->where('location', 'LIKE', "%{$location}%");
            })
            ->when($type, function ($q) use ($type) {
                $q->where('type', $type);
            })
            ->with(['company', 'department'])
            ->get();

        return response()->json([
            'jobs'  => $jobs,
            'count' => $jobs->count(),
        ]);
    }
}
