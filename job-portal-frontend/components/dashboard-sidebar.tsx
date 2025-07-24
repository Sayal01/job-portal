"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Briefcase,
    Users,
    FileText,
    BarChart3,
    Settings,
    Building,
    Search,
    BookmarkIcon,
    MessageSquare,
    Calendar,
    User,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface DashboardSidebarProps {
    userType: "admin" | "job_seeker" | "employer"
}

const sidebarItems = {
    "admin": [
        { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { title: "Jobs", href: "/admin/dashboard/jobs", icon: Briefcase },
        { title: "users", href: "/admin/dashboard/users", icon: FileText },
        { title: "Applications", href: "/admin/dashboard/application-list", icon: Users },
        // { title: "Employers", href: "/dashboard/employers", icon: Building },
        { title: "Departments", href: "/admin/dashboard/department-list", icon: BarChart3 },
        { title: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
    "job_seeker": [
        { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { title: "Find Jobs", href: "/", icon: Search },
        { title: "My Applications", href: "/job_seeker/dashboard/application", icon: FileText },
        // { title: "Saved Jobs", href: "/dashboard/saved-jobs", icon: BookmarkIcon },
        // { title: "Messages", href: "/dashboard/messages", icon: MessageSquare },
        // { title: "Interviews", href: "/dashboard/interviews", icon: Calendar },
        { title: "Profile", href: "/job_seeker/dashboard/profile", icon: User },
        { title: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
    "employer": [
        { title: "Dashboard", href: "/employer", icon: LayoutDashboard },
        { title: "Post Job", href: "/employer/dashboard/post-job", icon: Briefcase },
        { title: "My Jobs", href: "/employer/dashboard/my-job-list", icon: Briefcase },
        { title: "Applications", href: "/employer/dashboard/applicant-list", icon: FileText },
        // { title: "Candidates", href: "employer/dashboard/candidates", icon: Users },
        // { title: "Messages", href: "/dashboard/messages", icon: MessageSquare },
        // { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
        { title: "Company Profile", href: "/employer/dashboard/company", icon: Building },
        { title: "Settings", href: "/account", icon: Settings },
    ],
}

export function DashboardSidebar({ userType }: DashboardSidebarProps) {
    const pathname = usePathname()
    const items = sidebarItems[userType]

    return (
        <div className="w-64 bg-white shadow-sm border-r min-h-screen space-y-3.5">
            <nav className="p-4 space-y-3">
                {items.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                        <Link key={item.href} href={item.href}>
                            <Button
                                variant={isActive ? "secondary" : "ghost"}
                                className={cn("w-full justify-start", isActive && "bg-blue-50 text-blue-700 hover:bg-blue-50")}
                            >
                                <Icon className="mr-2 h-4 w-4" />
                                {item.title}
                            </Button>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
