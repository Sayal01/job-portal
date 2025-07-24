"use client"
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import React, { ReactNode } from "react";
import { myAppHook } from "@/context/AppProvider";
import { Header } from "@/components/header";
export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { user } = myAppHook();

    function getValidUserType(role?: string): "employer" | "admin" | "job_seeker" {
        if (role === "admin") return "admin";
        if (role === "employer") return "employer";
        if (role === "job_seeker") return "job_seeker";
        return "job_seeker"; // default fallback
    }
    return (
        <div className="flex h-[100vh] font-sans " >
            {/* Sidebar */}
            <aside className="">
                <DashboardSidebar userType={getValidUserType(user?.role)} />
            </aside>

            {/* Main content area */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {/* Navbar */}
                <header>
                    {/* <Header /> */}
                    {/* <DashboardHeader userType={getValidUserType(user?.role)} /> */}
                </header>
                {/* Page content */}
                <main style={{ padding: "1rem", flex: 1, overflowY: "auto" }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
