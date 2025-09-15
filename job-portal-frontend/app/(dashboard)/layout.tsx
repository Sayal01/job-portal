"use client";

import { DashboardSidebar } from "@/components/dashboard-sidebar";
import React, { ReactNode, useEffect, useState } from "react";
import { myAppHook } from "@/context/AppProvider";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { user } = myAppHook();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true); // component has mounted, can safely render client-only info
    }, []);

    function getValidUserType(role?: string): "employer" | "admin" | "job_seeker" {
        if (role === "admin") return "admin";
        if (role === "employer") return "employer";
        if (role === "job_seeker") return "job_seeker";
        return "job_seeker"; // fallback
    }

    return (
        <div className="flex min-h-screen font-sans">
            {/* Sidebar */}
            <aside className="bg-red-400">
                {mounted ? (
                    <DashboardSidebar userType={getValidUserType(user?.role)} />
                ) : (
                    <div className="w-64 h-full bg-gray-100 animate-pulse" />
                )}
            </aside>


            {/* Main content */}
            <div className="flex-1 p-4">
                {children}
            </div>
        </div>
    );
}
