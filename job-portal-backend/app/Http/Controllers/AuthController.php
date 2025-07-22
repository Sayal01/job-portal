<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\models\User;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    //register api
    public function register(Request $request)
    {
        try {
            $data = $request->validate([
                'role' => 'required|in:job_seeker,employer,admin',
                'first_name' => "required|string",
                'last_name' => "required|string",
                'email' => "required|unique:users|email",
                'password' => "required|confirmed",
                "company_name" => "required_if:role,employer|string|nullable|max:255",

            ]);
            unset($data['password_confirmation']);
            $user = User::create([
                'role' => $data['role'],
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'],
                'password' => $data['password'],
            ]);
            if ($user->role === 'employer') {
                \App\Models\Company::create([
                    'user_id' => $user->id,
                    'company_name' => $data['company_name'],
                    'description' => null,
                    'website' => null,
                ]);
            }
            return response()->json([
                "status" => true,
                "message" => "User registered successfully",
                "user" => $user
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Validation errors',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Registration failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    //login api
    public function login(Request $request)
    {
        $request->validate([
            "email" => "required|email",
            "password" => "required"
        ]);

        if (!Auth::attempt($request->only("email", "password"))) {
            return response()->json([
                "status" => false,
                "message" => "Invalid credentials"
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken("auth_token")->plainTextToken;

        return response()->json([
            "status" => true,
            "message" => "User logged in",
            "token" => $token,
            "user" => [
                "first_name" => $user->first_name,
                "email" => $user->email,
                "role" => $user->role,
            ]
        ]);
    }


    //profile api
    public function profile()
    {
        $user = Auth::user();
        return response()->json([
            "status" => true,
            "message" => "user  profile",
            "user" => $user
        ]);
    }
    public function logout()
    {
        Auth::logout();
        return response()->json([
            "status" => true,
            "message" => "user  logged out sucessfully",

        ]);
    }
}
