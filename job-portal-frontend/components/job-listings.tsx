"use client";

import { JobCard } from "@/components/job-card";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "@/lib/config";

interface fetchJobType {
    jobs: Job[];
    status: string;
}

interface Company {
    id: string;
    user_id: string;
    company_name: string;
    description: string;
    website: string;
    created_at: string;
    updated_at: string;
}

interface Department {
    id: string;
    name: string;
}

interface Job {
    id: string;
    title: string;
    company: Company;
    location: string;
    type: string;
    salary_min: string;
    salary_max: string;
    description: string;
    requirements: string[] | null;
    start_date: string;
    application_deadline: string;
    logo: string;
    skills: string[] | null;
}

export function JobListings() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<string>("");
    const [loading, setLoading] = useState(true);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // Fetch all jobs and departments on mount or when department changes
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch all jobs or filtered jobs by department
                const jobsUrl = selectedDepartment
                    ? `${API_URL}/departments/${selectedDepartment}/jobs`
                    : `${API_URL}/jobs`;

                const [jobsRes, departmentsRes] = await Promise.all([
                    axios.get(jobsUrl),
                    axios.get(`${API_URL}/departments`),
                ]);

                setJobs(Array.isArray(jobsRes.data.jobs) ? jobsRes.data.jobs : []);
                setDepartments(departmentsRes.data.departments);

                setCurrentPage(1); // Reset page to 1 on new fetch
            } catch (error) {
                toast.error("Failed to load jobs or departments");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedDepartment]);

    // Pagination calculations
    const totalPages = Math.ceil(jobs.length / pageSize);
    const paginatedJobs = jobs.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    // Handle department select change
    const handleDepartmentChange = (deptId: string) => {
        setSelectedDepartment(deptId);
        // currentPage reset happens in useEffect after data fetch
    };

    if (loading) {
        return <div>Loading jobs...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                    Latest Job Opportunities
                </h2>
                <span className="text-gray-600">
                    {jobs.length} jobs found
                </span>
            </div>

            {/* Department Filter */}
            <div className="mb-4 flex items-center gap-4">
                <label htmlFor="department" className="text-sm font-medium">
                    Filter by Department:
                </label>
                <select
                    id="department"
                    className="border p-2 rounded"
                    value={selectedDepartment}
                    onChange={(e) => handleDepartmentChange(e.target.value)}
                >
                    <option value="">All Departments</option>
                    {departments.map((dep) => (
                        <option key={dep.id} value={dep.id}>
                            {dep.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Job Cards */}
            <div className="grid  grid-cols-1 gap-4">
                {paginatedJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-6 gap-4">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Previous
                </button>

                <span>
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
