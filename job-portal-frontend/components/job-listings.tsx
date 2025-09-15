"use client";

import { JobCard } from "@/components/job-card";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "@/lib/config";

import SkeletonCard from "./skeletonCards";
interface Company {
    id: string;
    user_id: string;
    company_name: string;
    description: string;
    website: string;
    created_at: string;
    updated_at: string;
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

interface JobListingsProps {
    searchQuery?: string;
    locationFilter?: string;
    typeFilter?: string;
    selectedDepartment?: string;
}

export function JobListings({
    searchQuery = "",
    locationFilter = "",
    typeFilter = "",
    selectedDepartment = "",
}: JobListingsProps) {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const getJobsUrl = () =>
        searchQuery || locationFilter || typeFilter
            ? `${API_URL}/jobs/search`
            : selectedDepartment
                ? `${API_URL}/departments/${selectedDepartment}/jobs`
                : `${API_URL}/jobs`;

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const fetchJobs = async () => {
                setLoading(true);
                try {
                    const res = await axios.get(getJobsUrl(), {
                        params:
                            searchQuery || locationFilter || typeFilter
                                ? {
                                    q: searchQuery || undefined,
                                    location: locationFilter || undefined,
                                    ...(typeFilter && typeFilter !== "all" ? { type: typeFilter } : {}),
                                }
                                : undefined,
                    });
                    setJobs(Array.isArray(res.data.jobs) ? res.data.jobs : []);
                    setCurrentPage(1);
                } catch (err) {
                    toast.error("Failed to load jobs");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };

            fetchJobs();
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [searchQuery, locationFilter, typeFilter, selectedDepartment]);


    // Pagination calculations
    const totalPages = Math.max(1, Math.ceil(jobs.length / pageSize));
    const paginatedJobs = jobs.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );



    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                    Latest Job Opportunities
                </h2>
                <span className="text-gray-600">{jobs.length} jobs found</span>
            </div>

            {/* Job Cards */}
            <div className="grid grid-cols-1 gap-4 min-h-[200px]">
                {loading
                    ? Array.from({ length: pageSize }).map((_, i) => <SkeletonCard key={i} />)
                    : jobs.length === 0
                        ? <div className="text-center text-gray-500 mt-10">No jobs found.</div>
                        : paginatedJobs.map((job) => <JobCard key={job.id} job={job} />)
                }
            </div>

            {/* <div className="grid grid-cols-1 gap-4 " >
                {paginatedJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div> */}

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
