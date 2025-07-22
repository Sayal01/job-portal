import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Briefcase, Users, FileText, TrendingUp, Plus, Eye, MessageSquare, Calendar } from "lucide-react"

const jobStats = [
    {
        title: "Active Jobs",
        value: "12",
        change: "+2 this month",
        icon: Briefcase,
    },
    {
        title: "Total Applications",
        value: "347",
        change: "+23 this week",
        icon: FileText,
    },
    {
        title: "Candidates Hired",
        value: "8",
        change: "+3 this month",
        icon: Users,
    },
    {
        title: "Response Rate",
        value: "84%",
        change: "+5% improvement",
        icon: TrendingUp,
    },
]

const activeJobs = [
    {
        id: "1",
        title: "Senior Frontend Developer",
        department: "Engineering",
        applications: 47,
        status: "active",
        postedDate: "2024-01-15",
        views: 234,
    },
    {
        id: "2",
        title: "Product Manager",
        department: "Product",
        applications: 23,
        status: "active",
        postedDate: "2024-01-16",
        views: 156,
    },
    {
        id: "3",
        title: "UX Designer",
        department: "Design",
        applications: 15,
        status: "paused",
        postedDate: "2024-01-14",
        views: 89,
    },
]

const recentApplications = [
    {
        id: "1",
        applicant: "Sarah Wilson",
        position: "Senior Frontend Developer",
        appliedDate: "2024-01-17",
        status: "pending",
        experience: "5+ years",
        avatar: "/placeholder.svg?height=32&width=32",
    },
    {
        id: "2",
        applicant: "Mike Johnson",
        position: "Product Manager",
        appliedDate: "2024-01-16",
        status: "reviewed",
        experience: "3-4 years",
        avatar: "/placeholder.svg?height=32&width=32",
    },
    {
        id: "3",
        applicant: "Emily Chen",
        position: "UX Designer",
        appliedDate: "2024-01-15",
        status: "interview",
        experience: "2-3 years",
        avatar: "/placeholder.svg?height=32&width=32",
    },
    {
        id: "4",
        applicant: "David Brown",
        position: "Senior Frontend Developer",
        appliedDate: "2024-01-14",
        status: "pending",
        experience: "6+ years",
        avatar: "/placeholder.svg?height=32&width=32",
    },
]

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
    return (
        <div className="min-h-screen bg-gray-50">
            {/* <DashboardHeader userType="employer" /> */}
            <div className="flex">
                {/* <DashboardSidebar userType="employer" /> */}
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

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {jobStats.map((stat) => {
                            const Icon = stat.icon
                            return (
                                <Card key={stat.title}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                                        <Icon className="h-4 w-4 text-gray-400" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                        <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Active Jobs */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Active Job Postings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {activeJobs.map((job) => (
                                        <div key={job.id} className="p-3 border rounded-lg">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h4 className="font-medium">{job.title}</h4>
                                                    <p className="text-sm text-gray-600">{job.department}</p>
                                                    <p className="text-xs text-gray-500">Posted {job.postedDate}</p>
                                                </div>
                                                <Badge className={statusColors[job.status as keyof typeof statusColors]}>{job.status}</Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span>{job.applications} applications</span>
                                                    <span>{job.views} views</span>
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
                                    {recentApplications.map((application) => (
                                        <div key={application.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={application.avatar || "/placeholder.svg"} alt={application.applicant} />
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
                                                <Badge className={statusColors[application.status as keyof typeof statusColors]}>
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
                    {/* <Card className="mt-8">
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
                    </Card> */}
                </main>
            </div>
        </div>
    )
}
export default EmployerDashboard;