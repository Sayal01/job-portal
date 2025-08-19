"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Eye,
    Edit,
    Trash2,

} from "lucide-react";
import Loader from "@/components/Loader";
import { API_URL } from '@/lib/config';
import { myAppHook } from "@/context/AppProvider";
import axios from "axios";

interface Jobs {
    id: string,
    title: string,
    department: string,
    location: string,
    type: string,
    employmentType: string,
    status: "active" | "paused" | "closed" | "draft",
    applications: number,
    views: number,
    salary_min: string,
    salary_max: string,
    postedDate: string,
    deadline: string,
    experience_level: string
}

export default function AdminJobsList() {
    const { authToken, isLoading } = myAppHook();
    const [jobs, setJobs] = useState<Jobs[]>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/admin/jobs`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                });
                setJobs(response.data.jobs);
            } catch (error) {
                console.error("Fetch Jobs error:", error);
            } finally {
                setLoading(false);
            }
        };

        if (authToken) {
            fetchJobs();
        }
    }, [authToken]);

    async function deleteJob(id: string) {
        if (!confirm("Are you sure you want to delete this job?")) return;

        try {
            await axios.delete(`${API_URL}/admin/jobs/${id}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });
            setJobs(prev => prev?.filter(job => job.id !== id));
        } catch (error) {
            console.error("Delete Job error:", error);
            alert("Failed to delete job");
        }
    }

    if (loading || isLoading) return <Loader />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Jobs</h1>
                    <p className="text-gray-600">View, edit, or delete job postings</p>


                </div>
            </div>

            <div className="space-y-4">
                {!jobs || jobs.length === 0 ? (
                    <div className="bg-white rounded-lg shadow border p-12 text-center">
                        <p className="text-gray-600">No jobs found.</p>
                    </div>
                ) : (
                    jobs.map((job) => (
                        <div
                            key={job.id}
                            className="bg-white rounded-lg shadow border hover:shadow-md transition-shadow"
                        >
                            <div className="p-6 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                                    <p className="text-gray-600">{job.location} — {job.type}</p>
                                </div>

                                <div className="flex gap-3">
                                    <Link
                                        href={`/admin/dashboard/post-job/${job.id}/view`}
                                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                                        title="View Job details"
                                    >
                                        <Eye className="h-5 w-5" />
                                    </Link>

                                    <Link
                                        href={`/admin/dashboard/post-job/${job.id}`}
                                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                                        title="Edit Job details"
                                    >
                                        <Edit className="h-5 w-5" />
                                    </Link>

                                    <button
                                        onClick={() => deleteJob(job.id)}
                                        title="Delete Job"
                                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
