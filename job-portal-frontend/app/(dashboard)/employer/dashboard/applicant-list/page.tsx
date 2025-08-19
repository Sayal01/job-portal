"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { API_URL, API_IMG } from "@/lib/config"
import toast from "react-hot-toast"
import {
    MapPin,
    Building,
    Mail,
    Phone,
    User,
    FileText,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Eye,
} from "lucide-react"
import Link from "next/link"
import Cookies from "js-cookie"

interface Profile {
    resume_file?: string
    phone?: string
}

interface UserType {
    id: string
    first_name: string
    last_name: string
    email: string
    profile?: Profile
}

interface Job {
    id: string
    title: string
    location: string
}

interface InterviewRound {
    id: string
    round_number: number
    status: string
    scheduled_at: string
    interviewer_name?: string
    remarks?: string
}

interface Application {
    id: string
    user: UserType
    job: Job
    status: string
    cover_letter?: string
    interviews?: InterviewRound[]
}

export default function EmployerApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([])
    const [loading, setLoading] = useState(true)
    const [coverLetter, setCoverLetter] = useState<string | null>(null)

    // Modal states
    const [showModal, setShowModal] = useState(false)
    const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null)
    const [roundDate, setRoundDate] = useState("")
    const [interviewer, setInterviewer] = useState("")
    const [remarks, setRemarks] = useState("")

    const token = Cookies.get("AuthToken")

    const fetchApplications = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${API_URL}/employer/applications`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setApplications(res.data)
        } catch (error) {
            toast.error("Failed to fetch applications")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchApplications()
    }, [token])

    // Update application status
    const updateStatus = async (applicationId: string, newStatus: string) => {
        try {
            await axios.put(
                `${API_URL}/applications/${applicationId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } },
            )
            toast.success(`Application ${newStatus}`)
            setApplications((prev) => prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app)))
        } catch (error) {
            toast.error("Failed to update status")
            console.error(error)
        }
    }

    // Open modal
    const openScheduleModal = (applicationId: string) => {
        setSelectedApplicationId(applicationId)
        setRoundDate("")
        setInterviewer("")
        setRemarks("")
        setShowModal(true)
    }

    const closeModal = () => {
        setSelectedApplicationId(null)
        setShowModal(false)
    }

    // Schedule interview round
    const scheduleRound = async () => {
        if (!selectedApplicationId || !roundDate) {
            toast.error("Please provide date and time")
            return
        }
        try {
            await axios.post(
                `${API_URL}/applications/${selectedApplicationId}/interviews`,
                {
                    scheduled_at: roundDate,
                    interviewer_name: interviewer,
                    remarks: remarks,
                },
                { headers: { Authorization: `Bearer ${token}` } },
            )
            toast.success("Interview round scheduled")
            closeModal()
            fetchApplications()
        } catch (error) {
            toast.error("Failed to schedule interview round")
            console.error(error)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "shortlisted":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "in_interview":
                return "bg-purple-100 text-purple-800 border-purple-200"
            case "selected":
                return "bg-green-100 text-green-800 border-green-200"
            case "rejected":
                return "bg-red-100 text-red-800 border-red-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending":
                return <Clock className="w-3 h-3" />
            case "shortlisted":
                return <Eye className="w-3 h-3" />
            case "in_interview":
                return <Calendar className="w-3 h-3" />
            case "selected":
                return <CheckCircle className="w-3 h-3" />
            case "rejected":
                return <XCircle className="w-3 h-3" />
            default:
                return <AlertCircle className="w-3 h-3" />
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white shadow-lg">
                    <h1 className="text-4xl font-bold mb-2">Job Applications</h1>
                    <p className="text-blue-100 text-lg">Manage and review applications for your job postings</p>
                </div>

                {loading ? (
                    <div className="space-y-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="animate-pulse">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="space-y-2">
                                            <div className="h-6 bg-gray-200 rounded w-48"></div>
                                            <div className="h-4 bg-gray-200 rounded w-64"></div>
                                        </div>
                                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-56"></div>
                                        <div className="h-4 bg-gray-200 rounded w-40"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : applications.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
                        <p className="text-gray-600">Applications will appear here once candidates start applying to your jobs.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {applications.map((application) => (
                            <div
                                key={application.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
                            >
                                {/* Header Section */}
                                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b border-gray-100">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                                    {application.user.first_name[0]}
                                                    {application.user.last_name[0]}
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                        {application.user.first_name} {application.user.last_name}
                                                    </h2>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Mail className="w-4 h-4" />
                                                        <span className="text-sm">{application.user.email}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {application.user.profile?.phone && (
                                                <div className="flex items-center gap-2 text-gray-600 ml-15">
                                                    <Phone className="w-4 h-4" />
                                                    <span className="text-sm">{application.user.profile.phone}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div
                                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}
                                        >
                                            {getStatusIcon(application.status)}
                                            {application.status.replace("_", " ")}
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-6 space-y-6">
                                    {/* Job Information */}
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h4 className="font-semibold text-gray-900 mb-2">Applied Position</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <Building className="w-4 h-4 text-blue-500" />
                                                <span className="font-medium">{application.job.title}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <MapPin className="w-4 h-4 text-blue-500" />
                                                <span>{application.job.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-3">
                                        <Link
                                            href={`/jobs/${application.job.id}`}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View Job
                                        </Link>

                                        <button
                                            onClick={() => setCoverLetter(application.cover_letter || "No cover letter provided.")}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors font-medium"
                                        >
                                            <FileText className="w-4 h-4" />
                                            Cover Letter
                                        </button>

                                        {application.user.profile?.resume_file && (
                                            <a
                                                href={`${API_IMG}/${application.user.profile.resume_file}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium"
                                            >
                                                <FileText className="w-4 h-4" />
                                                Download Resume
                                            </a>
                                        )}
                                    </div>

                                    {/* Status Management */}
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <label className="font-medium text-gray-700">Update Status:</label>
                                            <select
                                                value={application.status}
                                                onChange={(e) => updateStatus(application.id, e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="shortlisted">Shortlisted</option>
                                                <option value="in_interview">In Interview</option>
                                                <option value="selected">Selected</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </div>

                                        {(application.status === "shortlisted" || application.status === "in_interview") && (
                                            <button
                                                onClick={() => openScheduleModal(application.id)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                            >
                                                <Calendar className="w-4 h-4" />
                                                Schedule Interview
                                            </button>
                                        )}
                                    </div>

                                    {/* Interview Rounds */}
                                    <div className="border-t border-gray-100 pt-6">
                                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-blue-500" />
                                            Interview Rounds
                                        </h4>
                                        {!application.interviews || application.interviews.length === 0 ? (
                                            <p className="text-gray-500 italic">No interview rounds scheduled yet</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {application.interviews.map((round) => (
                                                    <div key={round.id} className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                                                        <div className="flex items-start justify-between">
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-medium text-blue-900">Round {round.round_number}</span>
                                                                    <span
                                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(round.status)}`}
                                                                    >
                                                                        {round.status}
                                                                    </span>
                                                                </div>
                                                                <div className="text-sm text-gray-600">
                                                                    <div className="flex items-center gap-2">
                                                                        <Clock className="w-4 h-4" />
                                                                        {new Date(round.scheduled_at).toLocaleString()}
                                                                    </div>
                                                                    {round.interviewer_name && (
                                                                        <div className="flex items-center gap-2 mt-1">
                                                                            <User className="w-4 h-4" />
                                                                            {round.interviewer_name}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {round.remarks && (
                                                            <div className="mt-2 text-sm text-gray-700 bg-white rounded p-2 border">
                                                                <strong>Remarks:</strong> {round.remarks}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {coverLetter && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
                            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
                                <h3 className="text-2xl font-bold flex items-center gap-2">
                                    <FileText className="w-6 h-6" />
                                    Cover Letter
                                </h3>
                            </div>
                            <div className="p-6 overflow-y-auto max-h-96">
                                <div className="prose prose-gray max-w-none">
                                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">{coverLetter}</p>
                                </div>
                            </div>
                            <div className="p-6 border-t border-gray-100 flex justify-end">
                                <button
                                    onClick={() => setCoverLetter(null)}
                                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showModal && selectedApplicationId && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">
                                <h3 className="text-2xl font-bold flex items-center gap-2">
                                    <Calendar className="w-6 h-6" />
                                    Schedule Interview Round
                                </h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        value={roundDate}
                                        onChange={(e) => setRoundDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Interviewer Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter interviewer name"
                                        value={interviewer}
                                        onChange={(e) => setInterviewer(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                                    <textarea
                                        placeholder="Add any additional notes or instructions"
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    />
                                </div>
                            </div>
                            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={scheduleRound}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                >
                                    Schedule Round
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
