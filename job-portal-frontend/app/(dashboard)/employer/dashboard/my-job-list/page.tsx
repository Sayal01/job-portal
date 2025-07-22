import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { MyJobsList } from "@/app/(dashboard)/employer/dashboard/my-job-list/component/my-job-list"

export default function MyJobsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                <main className="flex-1 p-8">
                    <MyJobsList />
                </main>
            </div>
        </div>
    )
}
