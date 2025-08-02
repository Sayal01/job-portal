"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { API_URL, API_IMG } from "@/lib/config";
import toast from "react-hot-toast";
import {
    MapPin,
    Building,
    Mail,
    Phone,
    User,
    FileText,
} from "lucide-react";
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

interface Application {
    application_id: string;
    applicant: string;
    email: string;
    status: string;
    applied_at: string;
    user: UserType;
}

export default function ApplicantsByJobPage() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [jobTitle, setJobTitle] = useState("");
    const [applicants, setApplicants] = useState<Application[]>([]);
    const [coverLetter, setCoverLetter] = useState<string | null>(null);

    const token = Cookies.get("AuthToken");

    useEffect(() => {
        if (!id) return;

        axios
            .get(`${API_URL}/employer/jobs/${id}/applicants`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setJobTitle(res.data.job.title);
                setApplicants(res.data.job.applicants);
            })
            .catch((err) => {
                toast.error("Failed to load applicants.");
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, [id]);

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
            <h1 className="text-3xl font-bold mb-6">Applicants for: {jobTitle}</h1>

            {loading ? (
                <p>Loading...</p>
            ) : applicants.length === 0 ? (
                <p className="text-gray-600">No applicants for this job.</p>
            ) : (
                <div className="space-y-6">
                    {applicants.map((app) => (
                        <Card key={app.application_id}>
                            <CardHeader className="flex justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <User className="w-4 h-4" /> {app.applicant}
                                    </h2>
                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                        <Mail className="w-4 h-4" /> {app.email}
                                    </div>
                                </div>
                                <Badge variant={getStatusVariant(app.status)}>{app.status}</Badge>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                        <Building className="w-4 h-4" /> Applied At: {app.applied_at}
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-between items-center gap-4">
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => setCoverLetter("Cover letter not included in this API")}
                                        >
                                            <FileText className="w-4 h-4 mr-1" />
                                            View Cover Letter
                                        </Button>

                                        <Button variant="outline" asChild>
                                            <Link
                                                href={`/employer/dashboard/applicant/${app.application_id}`}
                                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                            >
                                                View Applicant
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Modal for Cover Letter */}
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
