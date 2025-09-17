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
        $application = Application::with('interviews')->findOrFail($applicationId);
        return response()->json([
            'status' => 'success',
            'data' => $application->interviews
        ]);
    }

    /**
     * Create a new interview round
     */
    public function store(Request $request, $applicationId)
    {
        $application = Application::with('interviews', 'user', 'job.company')->findOrFail($applicationId);

        // Get the last round if any
        $lastRound = $application->interviews()->latest('round_number')->first();

        // Maximum rounds allowed
        $maxRounds = 3;

        $roundNumber = $lastRound ? $lastRound->round_number + 1 : 1;
        // Check if maximum rounds reached
        if ($lastRound && $lastRound->round_number >= $maxRounds) {
            return response()->json([
                'status' => 'error',
                'message' => 'Maximum interview rounds reached.'
            ], 400);
        }

        // Check if previous round is passed
        if ($lastRound && $roundNumber > 1 && $lastRound->status !== 'passed') {
            return response()->json([
                'status' => 'error',
                'message' => 'Cannot schedule next round until the previous round is passed.'
            ], 400);
        }

        // Determine round number
        $roundNumber = $lastRound ? $lastRound->round_number + 1 : 1;

        // Create new round
        $interview = $application->interviews()->create([
            'round_number' => $roundNumber,
            'status' => 'scheduled',
            'scheduled_at' => $request->scheduled_at,
            'interviewer_name' => $request->interviewer_name,
            'remarks' => $request->remarks,
        ]);

        // Update application status if first interview
        if ($application->status === 'shortlisted') {
            $application->update(['status' => 'in_interview']);
        }

        $candidate = $application->user;       // user relation in Application
        $job = $application->job;              // job relation in Application
        $employerEmail = $job->company->employer->email; // employer/company email
        // ✅ Create notification for the candidate
        Notification::create([
            'user_id' => $application->user->id, // candidate
            'type' => 'interview_scheduled',
            'data' => [
                'job_title' => $application->job->title,
                'round_number' => $roundNumber,
                'scheduled_at' => $request->scheduled_at,
                'interviewer_name' => $request->interviewer_name,
            ],
            'read' => false,
        ]);
        Mail::to($candidate->email)->send(new InterviewScheduledMail(
            $candidate->first_name . ' ' . $candidate->last_name,
            $job->title,
            \Carbon\Carbon::parse($request->scheduled_at)->format('Y-m-d'),
            \Carbon\Carbon::parse($request->scheduled_at)->format('H:i A'),
            $employerEmail
        ));
        return response()->json([
            'status' => 'success',
            'message' => 'Interview round created successfully',
            'data' => $interview
        ]);
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
            ->whereIn('status', ['shortlisted', 'in_interview', 'failed']) // include candidates in interview too
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

        // If failed → mark application as rejected
        if ($request->status === 'failed') {
            $interview->application->update(['status' => 'rejected']);
        }

        // If passed → check if all 3 rounds are passed
        if ($request->status === 'passed') {
            $application = $interview->application;

            // Count passed rounds
            $passedRounds = $application->interviews()->where('status', 'passed')->count();

            // Only update to 'selected' if 3 rounds are passed
            if ($passedRounds >= 3) {
                $application->update(['status' => 'selected']);
            }
        }
        Notification::create([
            'user_id' => $candidate->id,
            'type' => 'interview_update',
            'data' => [
                'job_title' => $application->job->title,
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
