<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\JobInterview;
use Illuminate\Http\Request;

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
        $application = Application::findOrFail($applicationId);

        // Get last round number
        $lastRound = $application->interviews()->max('round_number') ?? 0;

        // Create new round
        $interview = $application->interviews()->create([
            'round_number' => $lastRound + 1,
            'status' => 'scheduled',
            'scheduled_at' => $request->scheduled_at,
            'interviewer_name' => $request->interviewer_name,
            'remarks' => $request->remarks,
        ]);

        // Update application status if it's first interview
        if ($application->status === 'shortlisted') {
            $application->update(['status' => 'in_interview']);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Interview round created successfully',
            'data' => $interview
        ]);
    }

    /**
     * Update interview round status
     */
    public function update(Request $request, $id)
    {
        $interview = JobInterview::findOrFail($id);

        $interview->update([
            'status' => $request->status,
            'remarks' => $request->remarks,
        ]);

        // If failed → mark application as rejected
        if ($request->status === 'failed') {
            $interview->application->update(['status' => 'rejected']);
        }

        // If passed and this is the last round → hire
        if ($request->status === 'passed') {
            $totalRounds = $interview->application->interviews()->count();
            $passedRounds = $interview->application->interviews()->where('status', 'passed')->count();

            if ($totalRounds === $passedRounds) {
                $interview->application->update(['status' => 'hired']);
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Interview round updated successfully',
            'data' => $interview
        ]);
    }
}
