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

interface InterviewStage {
    name: string
    description: string
}

interface Job {
    id: number
    title: string
    interview_stages: InterviewStage[]
}

interface Application {
    id: number
    job: Job
    interviews: InterviewRound[]
    status: string
}

const StatusBadge = ({ status }: { status: string }) => {
    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case "scheduled":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "completed":
            case "passed":
                return "bg-green-100 text-green-800 border-green-200"
            case "cancelled":
            case "failed":
                return "bg-red-100 text-red-800 border-red-200"
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }
    // Helper: format date


    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(
                status
            )}`}
        >
            {status}
        </span>
    )
}

// Get index of current active round
const getCurrentActiveRoundIndex = (interviews: InterviewRound[], stages: InterviewStage[]) => {
    if (!interviews || interviews.length === 0) return 0
    const active = interviews.find((i) => i.status.toLowerCase() !== "passed" && i.status.toLowerCase() !== "completed")
    if (!active) return interviews.length // all rounds passed
    return active.round_number - 1 // round_number starts at 1

}
const formatDateTime = (dateString: string) => {
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

    if (loading) return <div className="min-h-screen bg-gray-50 p-6">Loading...</div>
    if (error) return <div>{error}</div>
    if (applications.length === 0)
        return <div className="min-h-screen flex items-center justify-center">No interviews scheduled</div>

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Interviews</h1>
                <p className="text-gray-600 mb-6">Track your upcoming interview sessions</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {applications.map((app) => {
                        const currentIndex = getCurrentActiveRoundIndex(app.interviews, app.job.interview_stages)
                        const currentStage = app.job.interview_stages[currentIndex]
                        const nextStage = app.job.interview_stages[currentIndex + 1]

                        return (
                            <div
                                key={app.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                            >
                                {/* Job Header */}
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                                    <h2 className="text-xl font-bold mb-1">{app.job.title}</h2>
                                    <p className="text-blue-100 text-sm">
                                        Application Status: <StatusBadge status={app.status} />
                                    </p>
                                </div>

                                {/* Rounds */}
                                <div className="p-6 space-y-4">
                                    {/* Passed rounds */}
                                    {app.interviews
                                        .filter((i) => i.status.toLowerCase() === "passed")
                                        .map((i) => {
                                            const stage = app.job.interview_stages[i.round_number - 1]
                                            return (
                                                <div
                                                    key={i.id}
                                                    className="bg-gray-100 border border-gray-200 rounded-xl p-4"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-semibold text-gray-900">{stage.name}</h4>
                                                        <StatusBadge status="Passed" />
                                                    </div>
                                                </div>
                                            )
                                        })}

                                    {/* Current active round */}
                                    {currentStage && currentIndex < app.job.interview_stages.length && (
                                        <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold text-gray-900">{currentStage.name}</h4>
                                                <StatusBadge
                                                    status={
                                                        app.interviews.find((i) => i.round_number === currentIndex + 1)?.status ||
                                                        "Pending"
                                                    }
                                                />
                                            </div>
                                            <p className="text-gray-700 mb-2">{currentStage.description}</p>
                                            {/* Display scheduled date and time */}
                                            {app.interviews[currentIndex] && (
                                                <p className="text-sm text-gray-600">
                                                    Scheduled on:{" "}
                                                    {formatDateTime(app.interviews[currentIndex].scheduled_at).date} at{" "}
                                                    {formatDateTime(app.interviews[currentIndex].scheduled_at).time}
                                                </p>
                                            )}

                                            {nextStage && (
                                                <p className="text-sm text-blue-600 font-medium">
                                                    Next round: {nextStage.name}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
