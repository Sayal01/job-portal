"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Building2 } from "lucide-react";
import Cookies from "js-cookie";
import Link from "next/link";
type Department = {
    id: number;
    name: string;
};

type Job = {
    id: number;
    company_id: number;
    title: string;
    description: string;
    department_id: number;
    location: string;
    type: string;
    experience_level: string;
    salary_min: string;
    salary_max: string;
    responsibilities: string[];
    requirements: string[];
    qualifications: string[];
    skills: string[];
    application_deadline: string;
    start_date: string;
    department: Department;
};

export default function RecommendedJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const role = Cookies.get("Role")
    const authToken = Cookies.get("AuthToken")
    console.log(role)
    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/job-recomendation", {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                });
                if (response.data.status) {
                    setJobs(response.data.recomendations);
                }
            } catch (error) {
                console.error("Failed to fetch recommended jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (role !== "job_seeker") {
        return null; // 👈 Don't show anything for other roles
    }
    if (loading) return <p className="text-gray-500">Loading recommended jobs...</p>;
    if (jobs.length === 0) return <p className="text-gray-500">No recommended jobs found.</p>;


    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6  ml-16 ">
            {jobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                    <Card className="hover:shadow-lg transition">
                        <CardHeader>
                            <CardTitle className="text-lg">{job.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                <Building2 className="inline w-4 h-4 mr-1" />
                                {job.department.name}
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="text-sm text-gray-600">
                                <Briefcase className="inline w-4 h-4 mr-1" />
                                {job.type} | {job.experience_level}
                            </p>
                            <p className="text-sm text-gray-600">
                                <MapPin className="inline w-4 h-4 mr-1" />
                                {job.location}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {job.skills.map((skill, index) => (
                                    <Badge key={index} variant="secondary">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                <span>
                                    Salary: Rs. {job.salary_min} - {job.salary_max}
                                </span>
                                <br />
                                <span>Deadline: {job.application_deadline.split("T")[0]}</span>

                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>

    );
}
