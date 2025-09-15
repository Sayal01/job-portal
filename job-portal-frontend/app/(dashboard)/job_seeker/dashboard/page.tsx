"use client";

import React, { useEffect, useState } from "react";
import RecommendedJobs from "@/components/RecommendedJobs";
import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "@/lib/config";
import App from "next/app";
import toast from "react-hot-toast";


interface Company {
    id: string;
    company_name: string;
    logo: string;
}

interface Job {
    id: string;
    title: string;
    location: string;
    company: Company;
}

interface Application {
    id: string;
    job: Job;
    status: string;
    created_at: string;
}

export default function SeekerDashboard() {
    const [activeApplications, setActiveApplications] = useState<Application[]>([]);
    const [loadingApplications, setLoadingApplications] = useState(true);
    const authToken = Cookies.get("AuthToken");
    const userName = Cookies.get("UserName") || "Seeker";


    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get(`${API_URL}/applications`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                });
                setActiveApplications(response.data || []);
            } catch (error) {
                console.error("Error fetching active applications:", error);
            } finally {
                setLoadingApplications(false);
            }
        };

        fetchApplications();
    }, [authToken]);
    const cancelApplication = async (id: string) => {
        try {
            await axios.delete(`${API_URL}/applications/${id}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            toast.success("Application cancelled");

            // Remove the application from state
            setActiveApplications((prev) => prev.filter((app) => app.id !== id));
        } catch (error) {
            toast.error("Failed to cancel application");
            console.error(error);
        }
    };
    const recentApplications = [...activeApplications].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );


    return (
        <div className="p-6 space-y-8">
            {/* Welcome Section */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-semibold">Hi {userName},</h1>
                <p className="text-gray-600 mt-2">Here’s what’s new for you today!</p>
            </div>

            {/* Recommended Jobs Section */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Recommended Jobs</h2>
                <RecommendedJobs />
            </div>

            {/* Active Applications Section */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Active Applications</h2>
                {loadingApplications ? (
                    <p className="text-gray-500">Loading active applications...</p>
                ) : activeApplications.length === 0 ? (
                    <p className="text-gray-500">You haven’t applied to any jobs yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="text-left p-2 border">Job Title</th>
                                    <th className="text-left p-2 border">Company</th>
                                    <th className="text-left p-2 border">Location</th>
                                    <th className="text-left p-2 border">Status</th>
                                    <th className="text-left p-2 border">Applied On</th>
                                    <th className="p-2 border">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentApplications.slice(0, 5).map((application) => (
                                    <tr key={application.id} className="hover:bg-gray-50">
                                        <td className="p-2 border">{application.job.title}</td>
                                        <td className="p-2 border">{application.job.company?.company_name || application.job.company.id}</td>
                                        <td className="p-2 border">{application.job.location || "N/A"}</td>
                                        <td
                                            className={`p-2 border font-medium ${application.status === "selected"
                                                ? "text-green-600"
                                                : application.status === "in_interview"
                                                    ? "text-yellow-600"
                                                    : application.status === "pending"
                                                        ? "text-blue-600"
                                                        : "text-red-600"
                                                }`}
                                        >
                                            {application.status.replace("_", " ").toUpperCase()}
                                        </td>
                                        <td className="p-2 border">{new Date(application.created_at).toLocaleDateString()}</td>
                                        <td className="p-2 border">
                                            <button
                                                className="px-2 py-1 border rounded hover:bg-gray-100"
                                                onClick={() => cancelApplication(application.id)}
                                            >
                                                Withdraw
                                            </button>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
