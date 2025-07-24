<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JobController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\AdminController;


Route::post("/register", [AuthController::class, 'register']);
Route::post("/login", [AuthController::class, 'login']);
Route::get('/jobs', [JobController::class, 'index']); // anyone can see job list
Route::get('/jobs/{job}', [JobController::class, 'show']); // anyone can see job details
Route::get('/companies', [CompanyController::class, 'index']);
Route::get('/companies/{company}', [CompanyController::class, 'show']);
Route::get('/departments/{id}/jobs', [JobController::class, 'getJobsByDepartment']);

Route::apiResource('/departments', DepartmentController::class)
    ->only(['index', 'show']);




Route::middleware(['auth:sanctum', 'can:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard-counts', [AdminController::class, 'dashboardCounts']);
    Route::get('/users', [AdminController::class, 'listUsers']);
    Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
    Route::get('/companies', [AdminController::class, 'listCompanies']);
    Route::delete('/companies/{id}', [AdminController::class, 'deleteCompany']);
    Route::get('/applications', [AdminController::class, 'listApplications']);
    Route::post('/departments/add', [DepartmentController::class, 'store']);
    Route::put('/departments/{department}', [DepartmentController::class, 'update']);
    Route::delete('/departments/{department}', [DepartmentController::class, 'destroy']);
    Route::get('/jobs', [JobController::class, 'adminIndex']);
    Route::put('/jobs/{job}', [JobController::class, 'adminUpdate']);
    Route::delete('/jobs/{job}', [JobController::class, 'adminDestroy']);
});


Route::group(["middleware" => "auth:sanctum"], function () {
    Route::get("/profile", [AuthController::class, 'profile']);
    Route::middleware('auth:sanctum')->get('/my-jobs', [JobController::class, 'myJobs']);
    Route::middleware('auth:sanctum')->post('/update-account', [UserController::class, 'updateAccount']);
    Route::get('/me', [UserController::class, 'me']);
    Route::get('/profile-show', [ProfileController::class, 'show']);
    Route::post('/profile-update', [ProfileController::class, 'update']);

    Route::get('/company', [CompanyController::class, 'showOwnCompany']);
    Route::post('/company/update', [CompanyController::class, 'updateCompany']); // update own
    Route::delete('/company/{company}', [CompanyController::class, 'destroy']);
    Route::get('/jobs/{jobId}/application-status', [ApplicationController::class, 'hasApplied']);

    // ✅ Authenticated routes for managing jobs (create/update/delete)
    Route::post('/jobs', [JobController::class, 'store']);
    Route::put('/jobs/{job}', [JobController::class, 'update']);
    Route::delete('/jobs/{job}', [JobController::class, 'destroy']);

    // Route::get('/employer/job-stats', [ApplicationController::class, 'jobStats']);
    Route::get('/employer/jobs/active', [JobController::class, 'activeJobs']);
    Route::get('/employer/applications/recent', [ApplicationController::class, 'recentApplications']);


    // Apply for a job
    Route::post('/jobs/{job}/apply', [ApplicationController::class, 'store']);
    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::delete('/applications/{application}', [ApplicationController::class, 'destroy'])->middleware('auth:sanctum');

    Route::get('/employer/applications', [ApplicationController::class, 'employerIndex']);
    Route::put('/applications/{application}/status', [ApplicationController::class, 'updateStatus']);
    Route::get('/applications/applicant/{userId}', [ApplicationController::class, 'showApplicant']);



    Route::middleware('auth:sanctum')->get('/recommendations', [JobController::class, 'recommendJobs']);


    Route::post("logout", [AuthController::class, 'logout']);
}); 


// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');
