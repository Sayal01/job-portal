"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/header";
import { MapPin, Clock, DollarSign, Building, Users, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { API_IMG, API_URL } from "@/lib/config";
import axios from "axios";
import { use } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

interface Company {
    logo: string;
    id: string;
    user_id: string;
    company_name: string;
    description: string;
    website: string;
    created_at: string;
    updated_at: string;
}

interface Job {
    id: string;
    title: string;
    company: Company;
    location: string;
    type: string;
    salary: string;
    description: string;
    requirements: string[] | null;
    responsibilities: string[] | null;
    postedDate: string;
    start_date?: string;
}

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: jobId } = use(params);
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasApplied, setHasApplied] = useState(false);
    const token = Cookies.get("AuthToken");

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await axios.get(`${API_URL}/jobs/${jobId}`);
                setJob(response.data);
                console.log(response)
            } catch (error) {
                toast.error("Failed to load job");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [jobId]);
    useEffect(() => {
        const checkApplicationStatus = async () => {
            try {
                const res = await axios.get(`${API_URL}/jobs/${jobId}/application-status`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setHasApplied(res.data.applied);
            } catch (error) {
                console.error("Failed to check application status", error);
            }
        };

        if (jobId && token) {
            checkApplicationStatus();
        }
    }, [jobId]);

    const handleApplyClick = () => {
        if (!token) {
            toast.error("You need to login first!");
        } else {
            window.location.href = `/jobs/${job?.id}/apply`;
        }
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    if (!job) {
        return <div>Job not found.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Job Header */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-start gap-4">
                                    <img src={`${API_IMG}/${job.company.logo}`} alt="Company Logo" width={80} height={80} className="rounded-full" />

                                    <div className="flex-1">
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                                        <div className="flex items-center gap-4 text-gray-600 mb-4">
                                            <div className="flex items-center gap-1">
                                                <Building className="h-4 w-4" />
                                                {job.company.company_name}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4" />
                                                {job.location}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                {job.postedDate}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge variant="secondary">{job.type}</Badge>
                                            <div className="flex items-center gap-1 text-green-600 font-medium">
                                                <DollarSign className="h-4 w-4" />
                                                {job.salary}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>

                        {/* Job Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Job Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 leading-relaxed">{job.description}</p>
                            </CardContent>
                        </Card>

                        {/* Requirements */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Requirements</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {job.requirements && job.requirements.length > 0 ? (
                                    <ul className="space-y-2">
                                        {job.requirements.map((req, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                                                <span className="text-gray-700">{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 text-sm">No specific requirements listed.</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Responsibilities */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Responsibilities</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {job.responsibilities && job.responsibilities.length > 0 ? (
                                    <ul className="space-y-2">
                                        {job.responsibilities.map((resp, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                                                <span className="text-gray-700">{resp}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 text-sm">No specific responsibilities listed.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Apply Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Apply for this position</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4" />
                                        {/* Applicants count placeholder if you have it */}
                                        {/* Replace with real data if available */}
                                        -
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {job.start_date || "N/A"}
                                    </div>
                                </div>
                                <Separator />
                                {hasApplied ? (
                                    <Button className="w-full" size="lg" disabled>
                                        Applied
                                    </Button>
                                ) : (
                                    <Button className="w-full" size="lg" onClick={handleApplyClick}>
                                        Apply Now
                                    </Button>
                                )}
                                {/* <Button variant="outline" className="w-full bg-transparent">
                                    Save Job
                                </Button> */}
                            </CardContent>
                        </Card>

                        {/* Company Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>About {job.company.company_name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3 mb-4">
                                    <img src={`${API_IMG}/${job.company.logo}`} alt="Company Logo" width={80} height={80} className="rounded-full" />
                                    {/* <Image
                                        src={`${API_IMG}/job.company.logo` || "/placeholder.svg"}
                                        alt={`${job.company.company_name} logo`}
                                        width={48}
                                        height={48}
                                        className="rounded-lg border"
                                    /> */}
                                    <div>
                                        <h3 className="font-semibold">{job.company.company_name}</h3>
                                        <p className="text-sm text-gray-600">Company</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 text-sm mb-4">
                                    {job.company.description || "No company description provided."}
                                </p>
                                <Button variant="outline" className="w-full bg-transparent" asChild>
                                    <Link href={`/companies/${job.company.id}`}>View Company Profile</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
