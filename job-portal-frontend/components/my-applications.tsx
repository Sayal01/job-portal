"use client"

import { useState } from "react"
import {
    Eye,
    Calendar,
    MapPin,
    DollarSign,
    Search,
    Clock,
    Building,
    FileText,
    MessageSquare,
    ExternalLink,
    Download,
} from "lucide-react"
import Link from "next/link"

interface Application {
    id: string
    jobId: string
    jobTitle: string
    company: string
    companyLogo: string
    location: string
    workType: string
    employmentType: string
    salary: string
    appliedDate: string
    status: "pending" | "reviewed" | "interview" | "rejected" | "hired" | "withdrawn"
    lastUpdate: string
    notes?: string
    interviewDate?: string
    nextStep?: string
}

const mockApplications: Application[] = [
    {
        id: "1",
        jobId: "job-1",
        jobTitle: "Senior Frontend Developer",
        company: "TechCorp Inc.",
        companyLogo: "/placeholder.svg?height=40&width=40",
        location: "San Francisco, CA",
        workType: "Hybrid",
        employmentType: "Full-time",
        salary: "$120,000 - $150,000",
        appliedDate: "2024-01-17",
        status: "interview",
        lastUpdate: "2024-01-20",
        interviewDate: "2024-01-25",
        nextStep: "Technical interview scheduled",
    },
    {
        id: "2",
        jobId: "job-2",
        jobTitle: "Product Manager",
        company: "StartupXYZ",
        companyLogo: "/placeholder.svg?height=40&width=40",
        location: "New York, NY",
        workType: "Remote",
        employmentType: "Full-time",
        salary: "$100,000 - $130,000",
        appliedDate: "2024-01-16",
        status: "reviewed",
        lastUpdate: "2024-01-19",
        nextStep: "Waiting for hiring manager review",
    },
    {
        id: "3",
        jobId: "job-3",
        jobTitle: "UX Designer",
        company: "DesignStudio",
        companyLogo: "/placeholder.svg?height=40&width=40",
        location: "Remote",
        workType: "Remote",
        employmentType: "Contract",
        salary: "$80,000 - $100,000",
        appliedDate: "2024-01-15",
        status: "pending",
        lastUpdate: "2024-01-15",
        nextStep: "Application under review",
    },
    {
        id: "4",
        jobId: "job-4",
        jobTitle: "Data Scientist",
        company: "DataTech Solutions",
        companyLogo: "/placeholder.svg?height=40&width=40",
        location: "Austin, TX",
        workType: "On-site",
        employmentType: "Full-time",
        salary: "$110,000 - $140,000",
        appliedDate: "2024-01-14",
        status: "rejected",
        lastUpdate: "2024-01-18",
        notes: "Position filled by internal candidate",
    },
    {
        id: "5",
        jobId: "job-5",
        jobTitle: "Full Stack Developer",
        company: "WebCorp",
        companyLogo: "/placeholder.svg?height=40&width=40",
        location: "Chicago, IL",
        workType: "Hybrid",
        employmentType: "Full-time",
        salary: "$95,000 - $125,000",
        appliedDate: "2024-01-12",
        status: "hired",
        lastUpdate: "2024-01-22",
        nextStep: "Start date: February 1st, 2024",
    },
]

const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    reviewed: "bg-blue-100 text-blue-800 border-blue-200",
    interview: "bg-purple-100 text-purple-800 border-purple-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
    hired: "bg-green-100 text-green-800 border-green-200",
    withdrawn: "bg-gray-100 text-gray-800 border-gray-200",
}

const statusIcons = {
    pending: Clock,
    reviewed: Eye,
    interview: Calendar,
    rejected: FileText,
    hired: Building,
    withdrawn: FileText,
}

export function MyApplications() {
    const [applications, setApplications] = useState<Application[]>(mockApplications)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [sortBy, setSortBy] = useState("newest")

    const filteredApplications = applications.filter((app) => {
        const matchesSearch =
            app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.company.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || app.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const sortedApplications = [...filteredApplications].sort((a, b) => {
        switch (sortBy) {
            case "newest":
                return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
            case "oldest":
                return new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime()
            case "company":
                return a.company.localeCompare(b.company)
            case "status":
                return a.status.localeCompare(b.status)
            default:
                return 0
        }
    })

    const handleWithdraw = (applicationId: string) => {
        if (confirm("Are you sure you want to withdraw this application?")) {
            setApplications(
                applications.map((app) => (app.id === applicationId ? { ...app, status: "withdrawn" as const } : app)),
            )
        }
    }

    const getStatusIcon = (status: Application["status"]) => {
        const Icon = statusIcons[status]
        return <Icon className="h-4 w-4" />
    }

    const getStatusText = (status: Application["status"]) => {
        const statusTexts = {
            pending: "Application Submitted",
            reviewed: "Under Review",
            interview: "Interview Scheduled",
            rejected: "Not Selected",
            hired: "Offer Received",
            withdrawn: "Withdrawn",
        }
        return statusTexts[status]
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
                    <p className="text-gray-600">Track your job applications and their progress</p>
                </div>
                <Link
                    href="/dashboard/find-jobs"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
                >
                    <Search className="h-4 w-4" />
                    Find More Jobs
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-lg shadow border p-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                        <p className="text-sm text-gray-600">Total Applied</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow border p-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">
                            {applications.filter((app) => app.status === "pending").length}
                        </p>
                        <p className="text-sm text-gray-600">Pending</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow border p-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">
                            {applications.filter((app) => app.status === "interview").length}
                        </p>
                        <p className="text-sm text-gray-600">Interviews</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow border p-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                            {applications.filter((app) => app.status === "hired").length}
                        </p>
                        <p className="text-sm text-gray-600">Offers</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow border p-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                            {Math.round((applications.filter((app) => app.status === "hired").length / applications.length) * 100) ||
                                0}
                            %
                        </p>
                        <p className="text-sm text-gray-600">Success Rate</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow border p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search applications..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="reviewed">Under Review</option>
                        <option value="interview">Interview</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                        <option value="withdrawn">Withdrawn</option>
                    </select>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="company">Company A-Z</option>
                        <option value="status">Status</option>
                    </select>
                </div>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
                {sortedApplications.length === 0 ? (
                    <div className="bg-white rounded-lg shadow border p-12 text-center">
                        <div className="max-w-md mx-auto">
                            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <FileText className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                            <p className="text-gray-600 mb-6">
                                {searchTerm || statusFilter !== "all"
                                    ? "Try adjusting your filters to see more results."
                                    : "Start applying to jobs to track your progress here."}
                            </p>
                            <Link
                                href="/dashboard/find-jobs"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <Search className="h-4 w-4" />
                                Find Jobs to Apply
                            </Link>
                        </div>
                    </div>
                ) : (
                    sortedApplications.map((application) => (
                        <div key={application.id} className="bg-white rounded-lg shadow border hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        {/* Company Logo */}
                                        <div className="w-12 h-12 rounded-lg border-2 border-gray-200 overflow-hidden flex-shrink-0">
                                            <img
                                                src={application.companyLogo || "/placeholder.svg"}
                                                alt={application.company}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Job Details */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-semibold text-gray-900">{application.jobTitle}</h3>
                                                <span
                                                    className={`px-3 py-1 text-xs font-medium rounded-full border ${statusColors[application.status]}`}
                                                >
                                                    {getStatusIcon(application.status)}
                                                    <span className="ml-1">{getStatusText(application.status)}</span>
                                                </span>
                                            </div>

                                            <p className="text-lg font-medium text-gray-700 mb-2">{application.company}</p>

                                            <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    {application.location}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    Applied {new Date(application.appliedDate).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="h-4 w-4" />
                                                    {application.salary}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                                                    {application.employmentType}
                                                </span>
                                                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                                    {application.workType}
                                                </span>
                                            </div>

                                            {/* Status-specific information */}
                                            {application.nextStep && (
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                                                    <p className="text-sm font-medium text-blue-900">Next Step:</p>
                                                    <p className="text-sm text-blue-800">{application.nextStep}</p>
                                                    {application.interviewDate && (
                                                        <p className="text-sm text-blue-700 mt-1">
                                                            Interview: {new Date(application.interviewDate).toLocaleDateString()} at{" "}
                                                            {new Date(application.interviewDate).toLocaleTimeString()}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {application.notes && (
                                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                                    <p className="text-sm font-medium text-gray-900">Notes:</p>
                                                    <p className="text-sm text-gray-700">{application.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 ml-4">
                                        <Link
                                            href={`/jobs/${application.jobId}`}
                                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                                            title="View Job"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </Link>

                                        <button
                                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                                            title="Download Application"
                                        >
                                            <Download className="h-4 w-4" />
                                        </button>

                                        <button
                                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                                            title="Message Employer"
                                        >
                                            <MessageSquare className="h-4 w-4" />
                                        </button>

                                        {(application.status === "pending" || application.status === "reviewed") && (
                                            <button
                                                onClick={() => handleWithdraw(application.id)}
                                                className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded border border-red-200"
                                            >
                                                Withdraw
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
                                        <span>Last updated: {new Date(application.lastUpdate).toLocaleDateString()}</span>
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
