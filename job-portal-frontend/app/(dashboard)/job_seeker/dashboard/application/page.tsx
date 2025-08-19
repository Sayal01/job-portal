"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { API_URL, API_IMG } from "@/lib/config";
import toast from "react-hot-toast";
import { Trash2, MapPin, Building } from "lucide-react";

import Cookies from "js-cookie";
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
}

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    const token = Cookies.get("AuthToken");
    const fetchApplications = async () => {

        try {
            const res = await axios.get(`${API_URL}/applications`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setApplications(res.data);
        } catch (error) {
            toast.error("Failed to fetch applications");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const cancelApplication = async (id: string) => {
        try {
            await axios.delete(`${API_URL}/applications/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success("Application cancelled");

            setApplications(applications.filter((app) => app.id !== id));
        } catch (error) {
            toast.error("Failed to cancel application");
            console.error(error);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "submitted":
                return "secondary";
            case "reviewed":
                return "default";
            case "accepted":
                return "success";
            case "rejected":
                return "destructive";
            default:
                return "secondary";
        }
    };
    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">My Applications</h1>

            {applications.length === 0 ? (
                <p className="text-gray-600">You haven’t applied to any jobs yet.</p>
            ) : (
                <div className="space-y-6">
                    {applications.map((application) => (
                        <Card key={application.id} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4">
                            <div className="flex items-center gap-4">
                                <img
                                    src={`${API_IMG}/${application.job.company.logo}`}
                                    alt="Company Logo"
                                    width={60}
                                    height={60}
                                    className="rounded-full border"
                                />
                                <div>
                                    <h2 className="text-xl font-semibold">{application.job.title}</h2>
                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                        <Building className="h-4 w-4" />
                                        {application.job.company.company_name}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                        <MapPin className="h-4 w-4" />
                                        {application.job.location}
                                    </div>
                                    <Badge variant={getStatusVariant(application.status)} className="mt-2">
                                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" asChild>
                                    <Link href={`/jobs/${application.job.id}`}>View Job</Link>
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => cancelApplication(application.id)}
                                >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Cancel
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </main>
    );
}
