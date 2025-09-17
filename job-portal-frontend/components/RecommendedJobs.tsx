"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Building2 } from "lucide-react";
import Cookies from "js-cookie";

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
    min_experience: string;
    max_experience: string;
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

type JobRecommendation = {
    job: Job;
    score: number;
};

export default function RecommendedJobs() {
    const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const authToken = Cookies.get("AuthToken");

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/recommend-jobs", {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.data.status) {
                    setRecommendations(response.data.recommendations);
                }
            } catch (error) {
                console.log("Error fetching recommendations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (loading) {
        return <p className="text-gray-500">Loading recommended jobs...</p>;
    }

    if (!recommendations.length) {
        return <p className="text-gray-500">No recommended jobs available.</p>;
    }

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.slice(0, 6).map((rec) => (
                <Card key={rec.job.id} className="hover:shadow-lg transition">
                    <CardHeader>
                        <CardTitle className="text-lg">{rec.job.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            <Building2 className="inline w-4 h-4 mr-1" />
                            {rec.job.department?.name}
                        </p>
                        <p className="text-xs text-green-600 font-medium">
                            🔍 Match Score: {(rec.score * 100).toFixed(1)}%
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="text-sm text-gray-600">
                            <Briefcase className="inline w-4 h-4 mr-1" />
                            {rec.job.type} | {rec.job.min_experience} - {rec.job.max_experience} years experience
                        </p>
                        <p className="text-sm text-gray-600">
                            <MapPin className="inline w-4 h-4 mr-1" />
                            {rec.job.location}
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {rec.job.skills?.map((skill, index) => (
                                <Badge key={index} variant="secondary">
                                    {skill}
                                </Badge>
                            ))}
                        </div>

                        <div className="text-xs text-muted-foreground">
                            <span>
                                Salary: Rs. {rec.job.salary_min} - {rec.job.salary_max}
                            </span>
                            <br />
                            <span>
                                Deadline: {new Date(rec.job.application_deadline).toLocaleDateString()}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
