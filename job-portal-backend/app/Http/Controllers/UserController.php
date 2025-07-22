<?php

namespace App\Http\Controllers;

use App\Models\Profiles;
use App\Models\Company;
use Illuminate\Http\Request;


class UserController extends Controller
{
    // ✅ Get logged-in user profile or company info
    public function me(Request $request)
    {
        $user = $request->user()->load('company');


        // If not authenticated
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthenticated.'
            ], 401);
        }

        // Handle job_seeker
        if ($user->role === 'job-seeker') {
            $profile = $user->profile;

            if (!$profile) {
                return response()->json([
                    'status' => false,
                    'message' => 'Profile not found for this job seeker.'
                ], 404);
            }

            return response()->json([
                'status' => true,
                'user' => $user,
                'profile' => $profile
            ]);
        }

        // Handle company
        if ($user->role === 'employer') {
            $company = $user->company;

            if (!$company) {
                return response()->json([
                    'status' => false,
                    'message' => 'Company profile not found.'
                ], 404);
            }

            return response()->json([
                'status' => true,
                'user' => $user,
            ]);
        }

        // Default for other roles (e.g., admin)
        return response()->json([
            'status' => true,
            'user' => $user
        ]);
    }

    public function updateAccount(Request $request)
    {
        try {
            $user = $request->user();

            $request->validate([
                'first_name' => 'nullable|string|max:255',
                'last_name' => 'nullable|string|max:255',
                'email' => 'nullable|email|unique:users,email,' . $user->id,
                'password' => 'nullable|string|min:8|confirmed',
                'current_password' => 'nullable|required_with:password|string',
                'image' => 'nullable|image|max:2048',
            ]);
            unset($request['password_confirmation']);
            // Only update if the field is present and non-empty
            if ($request->filled('first_name')) {
                $user->first_name = $request->input('first_name');
            }
            if ($request->filled('last_name')) {
                $user->last_name = $request->input('last_name');
            }
            if ($request->filled('email')) {
                $user->email = $request->input('email');
            }

            if ($request->filled('password')) {
                if (!$request->filled('current_password')) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Current password is required to change password.',
                    ], 422);
                }
                if (!password_verify($request->input('current_password'), $user->getOriginal('password'))) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Current password is incorrect.',
                    ], 422);
                }
                $user->password = $request->input('password');
            }

            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('user_images', 'public');
                $user->image = $path;
                // dd($path, $user->image);
            }


            $user->save();

            return response()->json([

                'message' => 'Account updated successfully',
                'user' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while updating the account',
                'error' => $e->getMessage(),
            ], 500);
        }
    }









    // ✅ Update job seeker profile
    // public function updateProfile(Request $request)
    // {
    //     $user = $request->user();

    //     if ($user->role !== 'job-seeker') {
    //         return response()->json(['error' => 'Only job seekers can update profile'], 403);
    //     }

    //     $request->validate([
    //         'bio' => 'nullable|string',
    //         'skills' => 'nullable|string',
    //         'experience' => 'nullable|string',
    //         'resume_file' => 'nullable|string'
    //     ]);

    //     $profile = $user->profile ?? new Profiles(['user_id' => $user->id]);
    //     $profile->fill($request->all());
    //     $profile->save();

    //     return response()->json($profile);
    // }
}
