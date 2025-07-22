"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
    Eye,
    Edit,
    Users,
    Calendar,
    MapPin,
    DollarSign,
    Plus
} from "lucide-react"
import Loader from "@/components/Loader"
import { API_URL } from '@/lib/config'
import { myAppHook } from "@/context/AppProvider"
import axios from "axios"

interface myJob {
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

export function MyJobsList() {
    const { authToken, isLoading } = myAppHook()
    const [jobs, setJobs] = useState<myJob[]>()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true)
                const response = await axios.get(`${API_URL}/my-jobs`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                })
                setJobs(response.data.jobs)
            } catch (error) {
                console.error("Fetch Jobs error:", error)
            } finally {
                setLoading(false)
            }
        }

        if (authToken) {
            fetchJobs()
        }
    }, [authToken])


    return loading ? (
        <Loader />
    ) : (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Job Postings</h1>
                    <p className="text-gray-600">Manage your job postings and track applications</p>
                </div>
                <Link
                    href="/employer/dashboard/post-job"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Post New Job
                </Link>
            </div>

            <div className="space-y-4">
                {!jobs || jobs.length === 0 ? (
                    <div className="bg-white rounded-lg shadow border p-12 text-center">
                        <div className="max-w-md mx-auto">
                            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Eye className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                            <p className="text-gray-600 mb-6">
                                Get started by posting your first job.
                            </p>
                            <Link
                                href="/employer/dashboard/post-job"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <Plus className="h-4 w-4" />
                                Post Your First Job
                            </Link>
                        </div>
                    </div>
                ) : (
                    jobs.map((job) => (
                        <div
                            key={job.id}
                            className="bg-white rounded-lg shadow border hover:shadow-md transition-shadow"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                                                    <span className="px-3 py-1 text-xs font-medium rounded-full border">
                                                        {job.type}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="h-4 w-4" />
                                                        {job.location}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        Posted {new Date(job.postedDate).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <DollarSign className="h-4 w-4" />
                                                        ${job.salary_min} - ${job.salary_max}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                                                        {job.department}
                                                    </span>
                                                    {job.experience_level && (
                                                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                                                            {job.experience_level}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative ml-4">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`post-job/${job.id}/view`}
                                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                                                title="View Job details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>

                                            <Link
                                                href={`post-job/${job.id}`}
                                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                                                title="Edit Job details"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>

                                            {/* <Link
                                                href={`/dashboard/jobs/${job.id}/applications`}
                                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                                                title="View Applications"
                                            >
                                                <Users className="h-4 w-4" />
                                            </Link> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
