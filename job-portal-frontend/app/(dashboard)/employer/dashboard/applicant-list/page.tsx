"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { API_URL, API_IMG } from "@/lib/config";
import toast from "react-hot-toast";
import { MapPin, Building, Mail, Phone, User, FileText, Eye, Check, X } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";

interface Profile {
    resume_file?: string;
    phone?: string;
}

interface UserType {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    profile?: Profile;
}

interface Job {
    id: string;
    title: string;
    location: string;
}

interface Application {
    id: string;
    user: UserType;
    job: Job;
    status: string;
    cover_letter?: string;
}

export default function EmployerApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [coverLetter, setCoverLetter] = useState<string | null>(null);

    const token = Cookies.get("AuthToken");
    const fetchApplications = async () => {
        console.log(token)
        try {
            const res = await axios.get(`${API_URL}/employer/applications`, {
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

    useEffect(() => {
        fetchApplications();
    }, [token]);

    const updateStatus = async (applicationId: string, newStatus: string) => {
        const token = Cookies.get("AuthToken");
        try {
            await axios.put(
                `${API_URL}/applications/${applicationId}/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success(`Application ${newStatus}`);
            setApplications((prev) =>
                prev.map((app) =>
                    app.id === applicationId ? { ...app, status: newStatus } : app
                )
            );
        } catch (error) {
            toast.error("Failed to update status");
            console.error(error);
        }
    };

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
            <h1 className="text-3xl font-bold mb-6">Applications for Your Jobs</h1>

            {loading ? (
                <div>Loading...</div>
            ) : applications.length === 0 ? (
                <p className="text-gray-600">No applications yet.</p>
            ) : (
                <div className="space-y-6">
                    {applications.map((application) => (
                        <Card key={application.id}>
                            <CardHeader className="flex justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <User className="w-4 h-4" /> {application.user.first_name} {application.user.last_name}
                                    </h2>
                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                        <Mail className="w-4 h-4" /> {application.user.email}
                                    </div>
                                    {application.user.profile?.phone && (
                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                            <Phone className="w-4 h-4" /> {application.user.profile.phone}
                                        </div>
                                    )}
                                </div>
                                <Badge variant={getStatusVariant(application.status)}>
                                    {application.status}
                                </Badge>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                        <Building className="w-4 h-4" /> Job: {application.job.title}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                        <MapPin className="w-4 h-4" /> Location: {application.job.location}
                                    </div>
                                </div>

                                {/* Buttons on left, status select on right */}
                                <div className="flex justify-between items-center flex-wrap gap-4">
                                    {/* Left side buttons */}
                                    <div className="flex flex-wrap gap-2">
                                        <Button variant="outline" asChild>
                                            <Link href={`/jobs/${application.job.id}`}>View Job</Link>
                                        </Button>

                                        <Button
                                            variant="outline"
                                            onClick={() => setCoverLetter(application.cover_letter || "No cover letter provided.")}
                                        >
                                            <FileText className="w-4 h-4 mr-1" />
                                            View Cover Letter
                                        </Button>

                                        {application.user.profile?.resume_file && (
                                            <a
                                                href={`${API_IMG}/${application.user.profile.resume_file}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Button variant="outline">
                                                    <FileText className="w-4 h-4 mr-1" />
                                                    Download Resume
                                                </Button>
                                            </a>
                                        )}

                                        <Button variant="outline" asChild>
                                            <Link
                                                href={`/employer/dashboard/applicant/${application.user.id}`}
                                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                            >
                                                View Applicant
                                            </Link>
                                        </Button>
                                    </div>

                                    {/* Right side status select */}
                                    <div className="flex flex-col items-end">
                                        <label htmlFor={`status-select-${application.id}`} className="mb-1 font-medium">
                                            Update Status:
                                        </label>
                                        <select
                                            id={`status-select-${application.id}`}
                                            value={application.status}
                                            onChange={(e) => updateStatus(application.id, e.target.value)}
                                            className="border rounded px-3 py-1"
                                        >
                                            <option value="submitted">Submitted</option>
                                            <option value="reviewed">Reviewed</option>
                                            <option value="accepted">Accepted</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </div>
                                </div>
                            </CardContent>

                        </Card>
                    ))}
                </div>
            )}

            {/* Cover letter modal (basic) */}
            {coverLetter && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full">
                        <h3 className="text-lg font-semibold mb-4">Cover Letter</h3>
                        <p className="text-gray-700 whitespace-pre-line">{coverLetter}</p>
                        <Button className="mt-4" onClick={() => setCoverLetter(null)}>
                            Close
                        </Button>
                    </div>
                </div>
            )}
        </main>
    );
}
