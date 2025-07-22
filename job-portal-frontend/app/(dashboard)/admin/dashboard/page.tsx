"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/config";
import Cookies from "js-cookie";

interface DashboardCounts {
    users: number;
    applications: number;
    companies: number;
}

export default function AdminDashboardPage() {
    const [counts, setCounts] = useState<DashboardCounts | null>(null);
    const [loading, setLoading] = useState(true);

    const token = Cookies.get("AuthToken");
    useEffect(() => {
        async function fetchCounts() {
            try {
                const res = await fetch(`${API_URL}/admin/dashboard-counts`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch");

                const data = await res.json();
                setCounts(data);
            } catch (err) {
                console.error("Failed to load dashboard stats", err);
            } finally {
                setLoading(false);
            }
        }
        fetchCounts()
    }, [token])



    if (loading) return <p>Loading dashboard...</p>;
    if (!counts) return <p>Failed to load dashboard</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-4 border rounded shadow">
                    <h2 className="text-lg font-semibold">Users</h2>
                    <p className="text-3xl">{counts.users}</p>
                </div>
                <div className="p-4 border rounded shadow">
                    <h2 className="text-lg font-semibold">Applications</h2>
                    <p className="text-3xl">{counts.applications}</p>
                </div>
                <div className="p-4 border rounded shadow">
                    <h2 className="text-lg font-semibold">Companies</h2>
                    <p className="text-3xl">{counts.companies}</p>
                </div>
            </div>
        </div>
    );
}
