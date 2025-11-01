"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { API_URL } from "@/lib/config"

interface Profile {
    full_name: string
}

interface User {
    id: number
    email: string
    profile?: Profile
    first_name: string
    last_name: string
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

interface InterviewRound {
    id: number
    round_number: number
    round_name?: string
    round_description?: string
    scheduled_at: string
    status: string
    interviewer_name?: string
    remarks?: string
}

interface Candidate {
    id: number // application id
    user: User
    job: Job
    interviews: InterviewRound[]
}

// ----------------- UI Components -----------------
const CustomButton = ({
    children,
    onClick,
    variant = "primary",
    size = "md",
    disabled = false,
    className = "",
}: {
    children: React.ReactNode
    onClick?: () => void
    variant?: "primary" | "secondary" | "danger" | "outline"
    size?: "sm" | "md" | "lg"
    disabled?: boolean
    className?: string
}) => {
    const baseClasses =
        "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
    const variantClasses = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-md hover:shadow-lg",
        secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-500",
        danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-md hover:shadow-lg",
        outline: "border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    }
    const sizeClasses = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" }
    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"

    return (
        <button
            onClick={disabled ? undefined : onClick}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    )
}

const CustomCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div
        className={`bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 ${className}`}
    >
        {children}
    </div>
)

const CardHeader = ({ children }: { children: React.ReactNode }) => (
    <div className="p-6 pb-4 border-b border-gray-100">{children}</div>
)

const CardContent = ({ children }: { children: React.ReactNode }) => <div className="p-6 pt-4">{children}</div>

const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
        passed: { bg: "bg-green-100", text: "text-green-800", icon: "✓" },
        failed: { bg: "bg-red-100", text: "text-red-800", icon: "✗" },
        scheduled: { bg: "bg-blue-100", text: "text-blue-800", icon: "📅" },
        pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: "⏳" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return (
        <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
        >
            <span>{config.icon}</span>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    )
}

const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded-md mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-2/3 mb-4"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded-md"></div>
                        <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                    </div>
                </div>
            </div>
        ))}
    </div>
)

// ----------------- Page -----------------
export default function EmployerInterviewRoundsPage() {
    const [candidates, setCandidates] = useState<Candidate[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null)
    const [roundDate, setRoundDate] = useState("")
    const [interviewer, setInterviewer] = useState("")
    const [remarks, setRemarks] = useState("")
    const [roundName, setRoundName] = useState("")
    const [roundDescription, setRoundDescription] = useState("")
    const [isScheduling, setIsScheduling] = useState(false)

    const token = Cookies.get("AuthToken")

    const fetchCandidates = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${API_URL}/employer/candidates`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setCandidates(res.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCandidates()
    }, [])

    // ----------------- Modal -----------------
    const openScheduleModal = (candidateId: number) => {
        setSelectedCandidateId(candidateId)
        setRoundDate("")
        setInterviewer("")
        setRemarks("")

        const candidate = candidates.find((c) => c.id === candidateId)
        if (candidate) {
            const lastRound = candidate.interviews[candidate.interviews.length - 1]
            const nextRoundIndex = lastRound ? lastRound.round_number : 0
            const nextStage = candidate.job.interview_stages[nextRoundIndex]
            setRoundName(nextStage?.name || `Round ${nextRoundIndex + 1}`)
            setRoundDescription(nextStage?.description || "")
        }

        setShowModal(true)
    }

    const closeModal = () => {
        setSelectedCandidateId(null)
        setShowModal(false)
        setIsScheduling(false)
    }

    const scheduleRound = async () => {
        if (!selectedCandidateId || !roundDate) {
            alert("Please provide date/time")
            return
        }

        setIsScheduling(true)
        try {
            await axios.post(
                `${API_URL}/applications/${selectedCandidateId}/interviews`,
                {
                    scheduled_at: roundDate,
                    interviewer_name: interviewer,
                    remarks,
                    round_name: roundName,
                    round_description: roundDescription,
                },
                { headers: { Authorization: `Bearer ${token}` } },
            )
            alert("Interview round scheduled successfully!")
            closeModal()
            fetchCandidates()
        } catch (error) {
            console.error(error)
            alert("Failed to schedule interview round")
        } finally {
            setIsScheduling(false)
        }
    }

    const updateRoundStatus = async (roundId: number, newStatus: string) => {
        try {
            await axios.put(
                `${API_URL}/interviews/${roundId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } },
            )
            fetchCandidates()
        } catch (error) {
            console.error(error)
            alert("Failed to update status")
        }
    }

    // ----------------- Render -----------------
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
            <div className="max-w-7xl mx-auto mb-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Management</h1>
                    <p className="text-gray-600">Manage candidate interviews and track progress</p>
                </div>

                {loading ? (
                    <LoadingSkeleton />
                ) : candidates.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-4xl">👥</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Candidates Yet</h3>
                        <p className="text-gray-600">No shortlisted candidates found. Check back later for new applications.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {candidates.map((candidate) => {
                            const nextRoundIndex = candidate.interviews.length
                            const nextStage = candidate.job.interview_stages[nextRoundIndex]

                            return (
                                <CustomCard key={candidate.id} className="h-fit">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900 mb-1">
                                                    {candidate.user.profile?.full_name || candidate.user.email}
                                                </h2>
                                                <p className="text-blue-600 font-medium">{candidate.job.title}</p>
                                                <p className="text-gray-500 text-sm">
                                                    Total Rounds: {candidate.interviews.length}/{candidate.job.interview_stages.length}
                                                </p>
                                                {nextStage && (
                                                    <p className="text-gray-500 text-sm mt-1">
                                                        Next Round: {nextStage.name}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                {(candidate.user.profile?.full_name || candidate.user.email).charAt(0).toUpperCase()}
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent>
                                        {candidate.interviews.length === 0 ? (
                                            <div className="text-center py-6">
                                                <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                                                    <span className="text-2xl">📅</span>
                                                </div>
                                                <p className="text-gray-600 mb-4">No interviews scheduled yet</p>
                                                <CustomButton onClick={() => openScheduleModal(candidate.id)}>
                                                    Schedule First Interview
                                                </CustomButton>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {candidate.interviews.map((round) => (
                                                    <div key={round.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div>
                                                                <span className="font-medium text-gray-900">
                                                                    {round.round_name || `Round ${round.round_number}`}
                                                                </span>
                                                                {round.round_description && (
                                                                    <p className="text-sm text-gray-500">{round.round_description}</p>
                                                                )}
                                                            </div>
                                                            <StatusBadge status={round.status} />
                                                        </div>

                                                        <div className="space-y-2 text-sm text-gray-600">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium">📅</span>
                                                                {new Date(round.scheduled_at).toLocaleString()}
                                                            </div>
                                                            {round.interviewer_name && (
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-medium">👤</span>
                                                                    {round.interviewer_name}
                                                                </div>
                                                            )}
                                                            {round.remarks && (
                                                                <div className="flex items-start gap-2">
                                                                    <span className="font-medium">💬</span>
                                                                    <span className="flex-1">{round.remarks}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {round.status !== "passed" && round.status !== "failed" && (
                                                            <div className="flex gap-2 mt-3">
                                                                <CustomButton size="sm" onClick={() => updateRoundStatus(round.id, "passed")}>
                                                                    ✓ Pass
                                                                </CustomButton>
                                                                <CustomButton
                                                                    size="sm"
                                                                    variant="danger"
                                                                    onClick={() => updateRoundStatus(round.id, "failed")}
                                                                >
                                                                    ✗ Fail
                                                                </CustomButton>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}

                                                {(candidate.interviews.length < candidate.job.interview_stages.length &&
                                                    (candidate.interviews.length === 0 ||
                                                        candidate.interviews[candidate.interviews.length - 1].status === "passed")) && (
                                                        <div className="pt-2">
                                                            <CustomButton
                                                                variant="outline"
                                                                onClick={() => openScheduleModal(candidate.id)}
                                                                className="w-full"
                                                            >
                                                                ➕ Add Another Round
                                                            </CustomButton>
                                                        </div>
                                                    )}
                                            </div>
                                        )}
                                    </CardContent>
                                </CustomCard>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && selectedCandidateId && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900">Schedule Interview Round</h3>
                            <p className="text-gray-600 mt-1">{roundName}</p>
                            {roundDescription && <p className="text-gray-500 text-sm mt-1">{roundDescription}</p>}
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">📅 Interview Date & Time</label>
                                <input
                                    type="datetime-local"
                                    value={roundDate}
                                    onChange={(e) => setRoundDate(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">👤 Interviewer Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter interviewer's name"
                                    value={interviewer}
                                    onChange={(e) => setInterviewer(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">💬 Remarks (Optional)</label>
                                <textarea
                                    placeholder="Add any additional notes or instructions"
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                />
                            </div>
                        </div>

                        <div className="p-6 pt-0 flex gap-3">
                            <CustomButton variant="outline" onClick={closeModal} className="flex-1" disabled={isScheduling}>
                                Cancel
                            </CustomButton>
                            <CustomButton onClick={scheduleRound} className="flex-1" disabled={isScheduling}>
                                {isScheduling ? "Scheduling..." : "Schedule Interview"}
                            </CustomButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
