"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Eye, Edit, Users, Calendar, MapPin, DollarSign, Plus, Briefcase, Clock, Trash2, } from "lucide-react"
import Loader from "@/components/Loader"
import { API_URL } from '@/lib/config'
import { myAppHook } from "@/context/AppProvider"
import axios from "axios"
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"
interface myJob {
    id: string,
    title: string,
    department: string,
    location: string,
    type: string,
    employmentType: string,
    status: "active" | "paused" | "closed" | "draft",
    views: number,
    salary_min: string,
    salary_max: string,
    start_date: string,
    application_deadline: string,
    experience_level: string,
    applications_count: number,
}

export function MyJobsList() {
    const { authToken } = myAppHook()
    const [jobs, setJobs] = useState<myJob[]>()
    const [loading, setLoading] = useState(true)
    const router = useRouter();
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

    async function deleteJob(id: string) {
        if (!confirm("Are you sure you want to delete this job?")) return;

        try {
            await axios.delete(`${API_URL}/jobs/${id}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });
            toast.success(`job deleted successfully`);
            setJobs(prev => prev?.filter(job => job.id !== id));
        } catch (error) {
            console.error("Delete Job error:", error);
            toast.error("Failed to delete job");
        }
    }
    const handleViewApplicants = (jobId: string) => {
        router.push(`/employer/dashboard/applicant-list/${jobId}`);
    };
    // const getStatusColor = (status: string) => {
    //     switch (status) {
    //         case "active":
    //             return "bg-green-100 text-green-800 border-green-200"
    //         case "paused":
    //             return "bg-yellow-100 text-yellow-800 border-yellow-200"
    //         case "closed":
    //             return "bg-red-100 text-red-800 border-red-200"
    //         case "draft":
    //             return "bg-gray-100 text-gray-800 border-gray-200"
    //         default:
    //             return "bg-gray-100 text-gray-800 border-gray-200"
    //     }
    // }

    const getDaysRemaining = (deadline: string) => {
        const today = new Date()
        const deadlineDate = new Date(deadline)
        const diffTime = deadlineDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }
    return loading ? (
        <Loader />
    ) : (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="text-white">
                                <h1 className="text-3xl font-bold mb-2">My Job Postings</h1>
                                <p className="text-blue-100">Manage your job postings and track applications</p>
                            </div>
                            <Link
                                href="/employer/dashboard/post-job"
                                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <Plus className="h-5 w-5" />
                                Post New Job
                            </Link>
                        </div>
                    </div>

                </div>

                <div className="space-y-6">
                    {!jobs || jobs.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-16 text-center">
                            <div className="max-w-md mx-auto">
                                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                                    <Briefcase className="h-12 w-12 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">No jobs posted yet</h3>
                                <p className="text-gray-600 mb-8 text-lg">
                                    Start building your team by posting your first job opening.
                                </p>
                                <Link
                                    href="/employer/dashboard/post-job"
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    <Plus className="h-5 w-5" />
                                    Post Your First Job
                                </Link>
                            </div>
                        </div>
                    ) : (
                        jobs.map((job) => {
                            const daysRemaining = getDaysRemaining(job.application_deadline)
                            return (
                                <div
                                    key={job.id}
                                    className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                                >
                                    <div className="p-8">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="flex-1">
                                                <div className="flex items-start gap-4 mb-4">
                                                    <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                                                        <Briefcase className="h-6 w-6 text-blue-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <h3 className="text-2xl font-bold text-gray-900">{job.title}</h3>

                                                            <span className="px-3 py-1 text-sm font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                                                                {job.type}
                                                            </span>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                                            <div className="flex items-center gap-2 text-gray-600">
                                                                <MapPin className="h-4 w-4 text-blue-500" />
                                                                <span className="text-sm font-medium">{job.location}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-gray-600">
                                                                <Calendar className="h-4 w-4 text-green-500" />
                                                                <span className="text-sm">Posted {new Date(job.start_date).toLocaleDateString()}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-gray-600">
                                                                <Clock className="h-4 w-4 text-orange-500" />
                                                                <span className="text-sm">
                                                                    {daysRemaining > 0 ? `${daysRemaining} days left` : "Expired"}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-gray-600">
                                                                <DollarSign className="h-4 w-4 text-purple-500" />
                                                                <span className="text-sm font-medium">
                                                                    ${job.salary_min} - ${job.salary_max}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3 mb-4">
                                                            <span className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-lg font-medium">
                                                                {job.department}
                                                            </span>
                                                            {job.experience_level && (
                                                                <span className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-lg font-medium">
                                                                    {job.experience_level}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center gap-6">
                                                            <div className="flex items-center gap-2">
                                                                <Users className="h-5 w-5 text-blue-500" />
                                                                <span className="text-lg font-bold text-gray-900">{job.applications_count}</span>
                                                                <span className="text-sm text-gray-600">applications</span>
                                                            </div>
                                                            {/* <div className="flex items-center gap-2">
                                                                <Eye className="h-5 w-5 text-green-500" />
                                                                <span className="text-lg font-bold text-gray-900">{job.views}</span>
                                                                <span className="text-sm text-gray-600">views</span>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 ml-6">
                                                <Link
                                                    href={`post-job/${job.id}/view`}
                                                    className="p-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200 border border-blue-200 hover:border-blue-300"
                                                    title="View Job Details"
                                                >
                                                    <Eye className="h-5 w-5" />
                                                </Link>

                                                <Link
                                                    href={`post-job/${job.id}`}
                                                    className="p-3 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-xl transition-all duration-200 border border-green-200 hover:border-green-300"
                                                    title="Edit Job"
                                                >
                                                    <Edit className="h-5 w-5" />
                                                </Link>
                                                <button
                                                    onClick={() => deleteJob(job.id)}
                                                    title="Delete Job"
                                                    className="p-3 text-red-500 hover:text-red-700 hover:bg-red-100  rounded-xl transition-all duration-200 border border-green-200 hover:border-green-300"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleViewApplicants(job.id)}
                                                    className="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                                                    title="View Applications"
                                                >
                                                    <Users className="h-5 w-5" />
                                                    View Applications
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}
