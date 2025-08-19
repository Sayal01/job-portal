"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { API_URL } from "@/lib/config"

interface InterviewRound {
    id: number
    round_number: number
    scheduled_at: string
    status: string
    interviewer_name?: string
    remarks?: string
}

interface Job {
    id: number
    title: string
}

interface Application {
    id: number
    job: Job
    interviews: InterviewRound[]
}

const StatusBadge = ({ status }: { status: string }) => {
    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case "scheduled":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "completed":
                return "bg-green-100 text-green-800 border-green-200"
            case "cancelled":
                return "bg-red-100 text-red-800 border-red-200"
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(status)}`}
        >
            {status}
        </span>
    )
}

const InterviewCard = ({ round }: { round: InterviewRound }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return {
            date: date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
            }),
            time: date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
            }),
        }
    }

    const { date, time } = formatDate(round.scheduled_at)

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                        {round.round_number}
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900">Round {round.round_number}</h4>
                        <p className="text-sm text-gray-500">Interview Session</p>
                    </div>
                </div>
                <StatusBadge status={round.status} />
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center">📅</div>
                    <span className="text-gray-700">{date}</span>
                    <span className="text-gray-500">at</span>
                    <span className="font-medium text-gray-900">{time}</span>
                </div>

                {round.interviewer_name && (
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center">👤</div>
                        <span className="text-gray-700">Interviewer:</span>
                        <span className="font-medium text-gray-900">{round.interviewer_name}</span>
                    </div>
                )}

                {round.remarks && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 font-medium mb-1">Remarks:</p>
                        <p className="text-sm text-gray-700">{round.remarks}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function CandidateInterviewsPage() {
    const [applications, setApplications] = useState<Application[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const token = Cookies.get("AuthToken")

    const fetchApplications = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await axios.get(`${API_URL}/my-interviews`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setApplications(res.data.data)
        } catch (err) {
            console.error(err)
            setError("Failed to load interviews.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchApplications()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <div className="h-8 bg-gray-200 rounded-lg w-64 mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                                <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
                                <div className="space-y-3">
                                    <div className="h-20 bg-gray-100 rounded-xl animate-pulse"></div>
                                    <div className="h-20 bg-gray-100 rounded-xl animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-red-200 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={fetchApplications}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    if (applications.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📅</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No interviews scheduled</h3>
                    <p className="text-gray-600">You don&apos;t have any upcoming interviews at the moment.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto p-6">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Interviews</h1>
                    <p className="text-gray-600">Track your upcoming and completed interview sessions</p>
                </div>

                {/* Applications Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {applications.map((app) => (
                        <div
                            key={app.id}
                            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            {/* Job Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                                <h2 className="text-xl font-bold mb-1">{app.job.title}</h2>
                                <p className="text-blue-100 text-sm">
                                    {app.interviews.length} interview{app.interviews.length !== 1 ? "s" : ""} scheduled
                                </p>
                            </div>

                            {/* Interviews List */}
                            <div className="p-6">
                                {app.interviews.length === 0 ? (
                                    <div className="text-center py-8">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <span className="text-xl">📅</span>
                                        </div>
                                        <p className="text-gray-500">No interviews scheduled for this position</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {app.interviews.map((round) => (
                                            <InterviewCard key={round.id} round={round} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
