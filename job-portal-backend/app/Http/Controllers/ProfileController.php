<?php

namespace App\Http\Controllers;

use App\Models\Profiles;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    // ✅ Get the authenticated job seeker profile
    public function show(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'job_seeker') {
            return response()->json(['error' => 'Only job seekers can access profile'], 403);
        }

        $profile = $user->profile;

        if (!$profile) {
            return response()->json(['message' => 'Profile not found.'], 404);
        }

        return response()->json($profile);
    }

    // ✅ Create or update the authenticated job seeker profile
    public function update(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'job_seeker') {
            return response()->json(['error' => 'Only job seekers can update profile'], 403);
        }

        // ✅ If education or work_experience is a JSON string, decode it
        if (is_string($request->education)) {
            $request->merge([
                'education' => json_decode($request->education, true)
            ]);
        }

        if (is_string($request->work_experience)) {
            $request->merge([
                'work_experience' => json_decode($request->work_experience, true)
            ]);
        }

        $request->validate([
            'bio' => 'nullable|string',
            'skills' => 'nullable|array',
            'education' => 'nullable|array',
            'work_experience' => 'nullable|array',
            'preferred_role' => 'nullable|string',
            'resume_file' => 'nullable|file|mimes:pdf,doc,docx|max:5120', // 5MB limit
        ]);

        $profile = $user->profile ?? new Profiles(['user_id' => $user->id]);

        $profile->bio = $request->input('bio', $profile->bio);
        $profile->skills = $request->input('skills', $profile->skills);
        $profile->education = $request->input('education', $profile->education);
        $profile->work_experience = $request->input('work_experience', $profile->work_experience);
        $profile->preferred_role = $request->input('preferred_role', $profile->preferred_role);

        if ($request->hasFile('resume_file')) {
            $path = $request->file('resume_file')->storeAs(
                'resumes',
                uniqid() . '_' . $request->file('resume_file')->getClientOriginalName(),
                'public'
            );
            $profile->resume_file = $path;
        }

        $profile->save();

        return response()->json([
            'status' => true,
            'message' => 'Profile updated successfully.',
            'profile' => $profile
        ]);
    }
}
