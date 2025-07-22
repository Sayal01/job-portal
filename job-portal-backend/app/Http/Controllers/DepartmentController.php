<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    // Helper function to authorize admin users
    private function authorizeAdmin()
    {
        if (!auth()->check() || auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized');
        }
    }

    // List all departments (anyone can view)
    public function index()
    {
        $departments = Department::all();
        return response()->json([
            'status' => true,
            'departments' => $departments,
        ]);
    }

    // Show a single department (anyone can view)
    public function show(Department $department)
    {
        return response()->json([
            'status' => true,
            'department' => $department,
        ]);
    }

    // Create a new department (admin only)
    public function store(Request $request)
    {
        $this->authorizeAdmin();

        $request->validate([
            'name' => 'required|string|max:255|unique:departments,name',
        ]);

        $department = Department::create([
            'name' => $request->name,
        ]);

        return response()->json([
            'status' => true,
            'department' => $department,
        ], 201);
    }

    // Update an existing department (admin only)
    public function update(Request $request, Department $department)
    {
        $this->authorizeAdmin();

        $request->validate([
            'name' => 'required|string|max:255|unique:departments,name,' . $department->id,
        ]);

        $department->update([
            'name' => $request->name,
        ]);

        return response()->json([
            'status' => true,
            'department' => $department,
        ]);
    }

    // Delete a department (admin only)
    public function destroy(Department $department)
    {
        $this->authorizeAdmin();

        $department->delete();

        return response()->json([
            'status' => true,
            'message' => 'Department deleted',
        ]);
    }
}
