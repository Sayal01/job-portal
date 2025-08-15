"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { API_URL, API_IMG } from "@/lib/config";
import toast from "react-hot-toast";
import { MapPin, Building, Mail, Phone, User, FileText } from "lucide-react";
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

interface InterviewRound {
    id: string;
    round_number: number;
    status: string;
    scheduled_at: string;
    interviewer_name?: string;
    remarks?: string;
}

interface Application {
    id: string;
    user: UserType;
    job: Job;
    status: string;
    cover_letter?: string;
    interviews?: InterviewRound[];
}

export default function EmployerApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [coverLetter, setCoverLetter] = useState<string | null>(null);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
    const [roundDate, setRoundDate] = useState("");
    const [interviewer, setInterviewer] = useState("");
    const [remarks, setRemarks] = useState("");

    const token = Cookies.get("AuthToken");

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/employer/applications`, {
                headers: { Authorization: `Bearer ${token}` },
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

    // Update application status
    const updateStatus = async (applicationId: string, newStatus: string) => {
        try {
            await axios.put(
                `${API_URL}/applications/${applicationId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`Application ${newStatus}`);
            setApplications((prev) =>
                prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app))
            );
        } catch (error) {
            toast.error("Failed to update status");
            console.error(error);
        }
    };

    // Open modal
    const openScheduleModal = (applicationId: string) => {
        setSelectedApplicationId(applicationId);
        setRoundDate("");
        setInterviewer("");
        setRemarks("");
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedApplicationId(null);
        setShowModal(false);
    };

    // Schedule interview round
    const scheduleRound = async () => {
        if (!selectedApplicationId || !roundDate) {
            toast.error("Please provide date and time");
            return;
        }
        try {
            await axios.post(
                `${API_URL}/applications/${selectedApplicationId}/interviews`,
                {
                    scheduled_at: roundDate,
                    interviewer_name: interviewer,
                    remarks: remarks,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Interview round scheduled");
            closeModal();
            fetchApplications();
        } catch (error) {
            toast.error("Failed to schedule interview round");
            console.error(error);
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "submitted":
                return "secondary";
            case "shortlisted":
                return "default";
            case "in_interview":
                return "warning";
            case "selected":
            case "hired":
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
                                        <User className="w-4 h-4" /> {application.user.first_name}{" "}
                                        {application.user.last_name}
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

                                {/* Buttons and Status */}
                                <div className="flex justify-between items-center flex-wrap gap-4">
                                    <div className="flex flex-wrap gap-2">
                                        <Button variant="outline" asChild>
                                            <Link href={`/jobs/${application.job.id}`}>View Job</Link>
                                        </Button>

                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                setCoverLetter(
                                                    application.cover_letter || "No cover letter provided."
                                                )
                                            }
                                        >
                                            <FileText className="w-4 h-4 mr-1" /> View Cover Letter
                                        </Button>

                                        {application.user.profile?.resume_file && (
                                            <a
                                                href={`${API_IMG}/${application.user.profile.resume_file}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Button variant="outline">
                                                    <FileText className="w-4 h-4 mr-1" /> Download Resume
                                                </Button>
                                            </a>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <div>
                                            <label htmlFor={`status-select-${application.id}`} className="mb-1 font-medium">
                                                Update Status:
                                            </label>
                                            <select
                                                id={`status-select-${application.id}`}
                                                value={application.status}
                                                onChange={(e) => updateStatus(application.id, e.target.value)}
                                                className="border rounded px-3 py-1"
                                            >
                                                <option value="submitted">pending</option>
                                                <option value="shortlisted">short listed</option>
                                                <option value="in_interview">in Interview</option>
                                                <option value="selected">selected</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </div>

                                        {/* Schedule Round Button */}
                                        {(application.status === "shortlisted" || application.status === "in_interview") && (
                                            <Button
                                                variant="outline"
                                                onClick={() => openScheduleModal(application.id)}
                                            >
                                                Schedule Interview Round
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Interview Rounds */}
                                <div className="mt-4">
                                    <h4 className="font-semibold mb-2">Interview Rounds:</h4>
                                    {application.interviews?.length === 0 ? (
                                        <p>No rounds scheduled yet</p>
                                    ) : (
                                        <ul className="space-y-1">
                                            {(application.interviews ?? []).map((round) => (
                                                <li key={round.id} className="text-sm text-gray-700">
                                                    Round {round.round_number}: {round.status} —{" "}
                                                    {new Date(round.scheduled_at).toLocaleString()}{" "}
                                                    {round.interviewer_name ? `by ${round.interviewer_name}` : ""}
                                                    {round.remarks ? ` (${round.remarks})` : ""}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Cover Letter Modal */}
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

            {/* Schedule Interview Modal */}
            {showModal && selectedApplicationId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Schedule Interview Round</h3>
                        <input
                            type="datetime-local"
                            value={roundDate}
                            onChange={(e) => setRoundDate(e.target.value)}
                            className="border rounded w-full mb-2 px-2 py-1"
                        />
                        <input
                            type="text"
                            placeholder="Interviewer Name"
                            value={interviewer}
                            onChange={(e) => setInterviewer(e.target.value)}
                            className="border rounded w-full mb-2 px-2 py-1"
                        />
                        <textarea
                            placeholder="Remarks"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            className="border rounded w-full mb-2 px-2 py-1"
                        />
                        <div className="flex justify-end gap-2">
                            <Button onClick={closeModal} variant="outline">
                                Cancel
                            </Button>
                            <Button onClick={scheduleRound}>Schedule</Button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
