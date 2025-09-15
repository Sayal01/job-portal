"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts"
import { useEffect, useState } from "react"
import axios from "axios"
import { API_URL } from "@/lib/config"
import Cookies from "js-cookie"
import {
    Users,
    Building2,
    Briefcase,
    FileText,
    CheckCircle,
    Clock,
    XCircle,
    Layers3,
    TrendingUp,
    Calendar,
} from "lucide-react"

interface DashboardCounts {
    users: number
    companies: number
    jobs: number
    applications: number
    selected: number
    pending: number
    rejected: number
    departments: number
}

interface ChartData {
    month?: string
    count: number
    name?: string
}

export default function AdminDashboardPage() {
    const [counts, setCounts] = useState<DashboardCounts | null>(null)
    const [applicationsData, setApplicationsData] = useState<ChartData[]>([])
    const [usersData, setUsersData] = useState<ChartData[]>([])
    const [topCompanies, setTopCompanies] = useState<ChartData[]>([])
    const [topJobs, setTopJobs] = useState<ChartData[]>([])
    const [range, setRange] = useState<"30days" | "6months" | "1year">("6months")

    useEffect(() => {
        const token = Cookies.get("AuthToken")

        axios
            .get(`${API_URL}/admin/dashboard-counts?range=${range}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setCounts(res.data.counts)
                setApplicationsData(res.data.applications_per_month)
                setUsersData(res.data.users_per_month)
                setTopCompanies(res.data.top_companies)
                setTopJobs(res.data.top_jobs)
            })
            .catch((err) => {
                console.error("Dashboard API Error:", err)
            })
    }, [range])

    const hireStatusData = [
        { name: "Hired", value: counts?.selected ?? 0, color: "#10b981" }, // emerald-500
        { name: "Pending", value: counts?.pending ?? 0, color: "#f59e0b" }, // amber-500
        { name: "Rejected", value: counts?.rejected ?? 0, color: "#ef4444" }, // red-500
    ]

    const metricCards = [
        {
            title: "Total Users",
            value: counts?.users ?? 0,
            icon: Users,
            trend: "+12%",
            description: "Active users",
            color: "text-blue-500",
        },
        {
            title: "Companies",
            value: counts?.companies ?? 0,
            icon: Building2,
            trend: "+8%",
            description: "Registered companies",
            color: "text-emerald-500",
        },
        {
            title: "Active Jobs",
            value: counts?.jobs ?? 0,
            icon: Briefcase,
            trend: "+15%",
            description: "Open positions",
            color: "text-purple-500",
        },
        {
            title: "Applications",
            value: counts?.applications ?? 0,
            icon: FileText,
            trend: "+23%",
            description: "Total submissions",
            color: "text-orange-500",
        },
    ]

    const statusCards = [
        {
            title: "Selected",
            value: counts?.selected ?? 0,
            icon: CheckCircle,
            color: "text-emerald-600",
            bgColor: "bg-emerald-100",
        },
        {
            title: "Pending",
            value: counts?.pending ?? 0,
            icon: Clock,
            color: "text-amber-600",
            bgColor: "bg-amber-100",
        },
        {
            title: "Rejected",
            value: counts?.rejected ?? 0,
            icon: XCircle,
            color: "text-red-600",
            bgColor: "bg-red-100",
        },
        {
            title: "Departments",
            value: counts?.departments ?? 0,
            icon: Layers3,
            color: "text-indigo-600",
            bgColor: "bg-indigo-100",
        },
    ]

    return (
        <div className="min-h-screen bg-background">
            <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                            <p className="text-muted-foreground mt-1">Monitor your job application platform performance</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium text-muted-foreground">Timeline:</span>
                                <select
                                    value={range}
                                    onChange={(e) => setRange(e.target.value as any)}
                                    className="bg-card border border-border rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="30days">Last 30 Days</option>
                                    <option value="6months">Last 6 Months</option>
                                    <option value="1year">Last Year</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {metricCards.map((metric, idx) => {
                        const Icon = metric.icon
                        return (
                            <Card key={idx} className="relative overflow-hidden border-0 shadow-sm bg-card/50 backdrop-blur">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
                                    <Icon className={`h-5 w-5 ${metric.color}`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-foreground">{metric.value.toLocaleString()}</div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="secondary" className="text-xs">
                                            <TrendingUp className="h-3 w-3 mr-1" />
                                            {metric.trend}
                                        </Badge>
                                        <p className="text-xs text-muted-foreground">{metric.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statusCards.map((status, idx) => {
                        const Icon = status.icon
                        return (
                            <Card key={idx} className="border-0 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${status.bgColor}`}>
                                            <Icon className={`h-6 w-6 ${status.color}`} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">{status.title}</p>
                                            <p className="text-2xl font-bold text-foreground">{status.value.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart className="h-5 w-5 text-blue-500" />
                                Applications Per Month
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={applicationsData}>
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={{ stroke: "theme('colors.gray.200')" }} />
                                    <YAxis tick={{ fontSize: 12 }} tickLine={{ stroke: "theme('colors.gray.200')" }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "theme('colors.white')",
                                            border: "1px solid theme('colors.gray.200')",
                                            borderRadius: "0.5rem",
                                        }}
                                    />
                                    <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card> */}

                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-green-500" />
                                User Registrations Per Month
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={usersData}>
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={{ stroke: "theme('colors.gray.200')" }} />
                                    <YAxis tick={{ fontSize: 12 }} tickLine={{ stroke: "theme('colors.gray.200')" }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "theme('colors.white')",
                                            border: "1px solid theme('colors.gray.200')",
                                            borderRadius: "0.5rem",
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle>Hiring Status Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={hireStatusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                                    >
                                        {hireStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "theme('colors.white')",
                                            border: "1px solid theme('colors.gray.200')",
                                            borderRadius: "0.5rem",
                                        }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                </div>


                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-chart-5" />
                            Top 5 Companies with Most Jobs
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topCompanies.map((company, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-sm font-semibold text-primary">#{idx + 1}</span>
                                        </div>
                                        <span className="font-medium text-foreground">{company.name}</span>
                                    </div>
                                    <Badge variant="secondary" className="font-semibold">
                                        {company.count} Jobs
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-chart-5" />
                            Top 5 Most Applied Jobs
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topJobs.map((job, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-sm font-semibold text-primary">#{idx + 1}</span>
                                        </div>
                                        <span className="font-medium text-foreground">{job.name}</span>
                                    </div>
                                    <Badge variant="secondary" className="font-semibold">
                                        {job.count} applications
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
