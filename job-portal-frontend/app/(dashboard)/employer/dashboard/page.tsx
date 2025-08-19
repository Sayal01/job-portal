"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { API_URL } from "@/lib/config"
import {
    Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Cookies from "js-cookie"
import {
    Users, TrendingUp,
    Plus, Eye, MessageSquare, Calendar
} from "lucide-react"


// ================= Types =================
type JobType = {
    id: number
    title: string
    department: string
    applications: number
    views?: number
    status?: keyof typeof statusColors
    postedDate: string
}

type ApplicationType = {
    id: number
    applicant: string
    position: string
    experience: string
    status: keyof typeof statusColors
    appliedDate: string
    avatar?: string
}

// ================ Status Colors ================
const statusColors = {
    active: "bg-green-100 text-green-800",
    paused: "bg-yellow-100 text-yellow-800",
    closed: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
    reviewed: "bg-blue-100 text-blue-800",
    interview: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
}

function EmployerDashboard() {
    const [activeJobs, setActiveJobs] = useState<JobType[]>([])
    const [recentApplications, setRecentApplications] = useState<ApplicationType[]>([])
    const token = Cookies.get("AuthToken")
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobsRes, applicationsRes] = await Promise.all([
                    axios.get(`${API_URL}/employer/jobs/active`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }),
                    axios.get(`${API_URL}/employer/applications/recent`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    })
                ])

                setActiveJobs(jobsRes.data.data)
                setRecentApplications(applicationsRes.data.data)
            } catch (err) {
                console.error("Failed to fetch employer dashboard data:", err)
            }
        }

        fetchData()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                <main className="flex-1 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Welcome back, TechCorp!</h1>
                            <p className="text-gray-600">Manage your job postings and track applications</p>
                        </div>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Post New Job
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Active Jobs */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Active Job Postings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {activeJobs.slice(0, 4).map((job) => (
                                        <div key={job.id} className="p-3 border rounded-lg">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h4 className="font-medium">{job.title}</h4>
                                                    <p className="text-sm text-gray-600">{job.department}</p>
                                                    <p className="text-xs text-gray-500">Posted {job.postedDate}</p>
                                                </div>
                                                {job.status && (
                                                    <Badge className={statusColors[job.status]}>
                                                        {job.status}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span>{job.applications} applications</span>
                                                    <span>{job.views ?? 0} views</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="ghost">
                                                        <Eye className="h-3 w-3" />
                                                    </Button>
                                                    <Button size="sm" variant="ghost">
                                                        <MessageSquare className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="outline" className="w-full mt-4 bg-transparent">
                                    View All Jobs
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Recent Applications */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Applications</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentApplications.slice(0, 4).map((application) => (
                                        <div key={application.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage
                                                        src={application.avatar || "/placeholder.svg"}
                                                        alt={application.applicant}
                                                    />
                                                    <AvatarFallback>
                                                        {application.applicant
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h4 className="font-medium text-sm">{application.applicant}</h4>
                                                    <p className="text-xs text-gray-600">{application.position}</p>
                                                    <p className="text-xs text-gray-500">{application.experience}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Badge className={statusColors[application.status]}>
                                                    {application.status}
                                                </Badge>
                                                <p className="text-xs text-gray-500 mt-1">{application.appliedDate}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="outline" className="w-full mt-4 bg-transparent">
                                    View All Applications
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <Button variant="outline" className="h-20 flex-col bg-transparent">
                                    <Plus className="h-6 w-6 mb-2" />
                                    Post New Job
                                </Button>
                                <Button variant="outline" className="h-20 flex-col bg-transparent">
                                    <Users className="h-6 w-6 mb-2" />
                                    Browse Candidates
                                </Button>
                                <Button variant="outline" className="h-20 flex-col bg-transparent">
                                    <Calendar className="h-6 w-6 mb-2" />
                                    Schedule Interviews
                                </Button>
                                <Button variant="outline" className="h-20 flex-col bg-transparent">
                                    <TrendingUp className="h-6 w-6 mb-2" />
                                    View Analytics
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    )
}

export default EmployerDashboard
