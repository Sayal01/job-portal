<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\JobInterview;
use Illuminate\Http\Request;
use App\Mail\InterviewScheduledMail;
use Illuminate\Support\Facades\Mail;
use App\Models\Notification;

class JobInterviewController extends Controller
{
    /**
     * Get all interview rounds for an application
     */
    public function index($applicationId)
    {
        $application = Application::with('interviews', 'job')->findOrFail($applicationId);
        $interviews = $application->interviews()->get();
        $stages = $application->job->interview_stages ?? [];

        // Attach dynamic round name & description
        $interviewsWithStage = $interviews->map(function ($interview) use ($stages) {
            $roundIndex = $interview->round_number - 1;
            $stage = $stages[$roundIndex] ?? null;

            return [
                'id' => $interview->id,
                'round_number' => $interview->round_number,
                'round_name' => $stage['name'] ?? "Round {$interview->round_number}",
                'round_description' => $stage['description'] ?? null,
                'status' => $interview->status,
                'scheduled_at' => $interview->scheduled_at,
                'interviewer_name' => $interview->interviewer_name,
                'remarks' => $interview->remarks,
                'created_at' => $interview->created_at,
                'updated_at' => $interview->updated_at,
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $interviewsWithStage
        ]);
    }


    /**
     * Create a new interview round
     */
    public function store(Request $request, $applicationId)
    {
        try {
            $application = Application::with('interviews', 'user', 'job.company')->findOrFail($applicationId);
            $job = $application->job;

            // Get dynamic interview stages from the job
            $stages = $job->interview_stages ?? [];
            $maxRounds = count($stages);

            if ($maxRounds === 0) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No interview stages defined for this job.'
                ], 400);
            }

            $lastRound = $application->interviews()->latest('round_number')->first();
            $roundNumber = $lastRound ? $lastRound->round_number + 1 : 1;

            // Check if maximum rounds reached
            if ($roundNumber > $maxRounds) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Maximum interview rounds reached.'
                ], 400);
            }

            // Check if previous round is passed
            if ($lastRound && $lastRound->status !== 'passed') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Cannot schedule next round until the previous round is passed.'
                ], 400);
            }

            // Get round name & description
            $currentStage = $stages[$roundNumber - 1] ?? ['name' => "Round $roundNumber", 'description' => null];

            // Create new interview
            $interview = $application->interviews()->create([
                'round_number' => $roundNumber,
                'status' => 'scheduled',
                'scheduled_at' => $request->scheduled_at,
                'interviewer_name' => $request->interviewer_name,
                'remarks' => $currentStage['description'] ?? $request->remarks,
            ]);

            // Update application status if first interview
            if ($application->status === 'shortlisted') {
                $application->update(['status' => 'in_interview']);
            }

            // Notification
            $candidate = $application->user;
            $employerEmail = $job->company->employer->email ?? null;

            Notification::create([
                'user_id' => $candidate->id,
                'type' => 'interview_scheduled',
                'data' => [
                    'job_title' => $job->title,
                    'round_number' => $roundNumber,
                    'round_name' => $currentStage['name'],
                    'scheduled_at' => $request->scheduled_at,
                    'interviewer_name' => $request->interviewer_name,
                ],
                'read' => false,
            ]);

            // Wrap email sending in try-catch
            try {
                if ($employerEmail) {
                    Mail::to($candidate->email)->send(new InterviewScheduledMail(
                        $candidate->first_name . ' ' . $candidate->last_name,
                        $job->title,
                        \Carbon\Carbon::parse($request->scheduled_at)->format('Y-m-d'),
                        \Carbon\Carbon::parse($request->scheduled_at)->format('H:i A'),
                        $employerEmail
                    ));
                }
            } catch (\Exception $e) {
                // Log the email error but don't fail the request
                \Log::error('Failed to send interview email: ' . $e->getMessage());
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Interview round created successfully',
                'data' => $interview
            ]);
        } catch (\Exception $e) {
            // Catch any unexpected errors
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create interview round',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function employerCandidates()
    {
        $employer = auth()->user()->company;

        if (!$employer) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Fetch all applications for this employer's jobs with status 'shortlisted'
        $candidates = Application::with([
            'user.profile',  // eager load user profile
            'job',           // eager load job
            'interviews'     // eager load all interview rounds
        ])
            ->whereHas('job', function ($q) use ($employer) {
                $q->where('company_id', $employer->id);
            })
            ->whereIn('status', ['shortlisted', 'in_interview', 'rejected']) // include candidates in interview too
            ->get();

        return response()->json($candidates);
    }
    public function myInterviews()
    {
        $user = auth()->user();

        $applications = Application::with([
            'job.company',
            'interviews'
        ])
            ->where('user_id', $user->id)
            ->whereIn('status', ['shortlisted', 'in_interview', 'selected', 'rejected'])
            ->get();

        return response()->json([
            'status' => 'success',
            'data'   => $applications
        ]);
    }

    public function update(Request $request, $id)
    {
        $interview = JobInterview::findOrFail($id);
        $interview->update([
            'status' => $request->status,
            'remarks' => $request->remarks,
        ]);

        $application = $interview->application;
        $candidate = $application->user;
        $job = $application->job;
        $stages = $job->interview_stages ?? [];
        $totalRounds = count($stages);

        // If failed → mark application rejected
        if ($request->status === 'failed') {
            $application->update(['status' => 'rejected']);
        }

        // If passed → check if all rounds passed
        if ($request->status === 'passed') {
            $passedRounds = $application->interviews()->where('status', 'passed')->count();

            if ($passedRounds >= $totalRounds && $totalRounds > 0) {
                $application->update(['status' => 'selected']);
            }
        }

        // Create notification
        Notification::create([
            'user_id' => $candidate->id,
            'type' => 'interview_update',
            'data' => [
                'job_title' => $job->title,
                'round_number' => $interview->round_number,
                'status' => $request->status,
                'remarks' => $request->remarks,
            ],
            'read' => false,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Interview round updated successfully',
            'data' => $interview
        ]);
    }
}
