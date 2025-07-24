"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/header";
import { ArrowLeft } from "lucide-react";
import { API_URL } from "@/lib/config";
import { useParams } from "next/navigation";

export default function JobApplicationPage() {
    const { id: jobId } = useParams(); // ✅ this is the correct way
    const router = useRouter();

    const [coverLetter, setCoverLetter] = useState("");
    const [hasResume, setHasResume] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(false);

    const token = Cookies.get("AuthToken");
    // ✅ Check if the user has a resume in profile
    useEffect(() => {
        const checkResume = async () => {
            try {
                const res = await axios.get(`${API_URL}/profile-show`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                console.log(res.data)
                const resume = res.data.resume_file;
                setHasResume(!!resume);
            } catch (err) {
                setHasResume(false);
            }
        };
        checkResume();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = Cookies.get("AuthToken");
        if (hasResume === false) {
            alert("You must upload a resume in your profile before applying!");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(
                `${API_URL}/jobs/${jobId}/apply`,
                {
                    cover_letter: coverLetter,
                }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }

            );

            if (res) {
                alert("Application submitted successfully!");
                router.push(`/jobs/${jobId}`);
            }
        } catch (error: any) {
            console.error("Failed to apply:", error);
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || "Failed to submit application.");
            }
        } finally {
            setLoading(false);
        }
    };


    if (hasResume === null) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Checking your profile...</p>
            </div>
        );
    }
    if (hasResume === false) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card>
                    <CardHeader>
                        <CardTitle>Resume Required</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-gray-700">
                            You must upload your resume to your profile before applying for jobs.
                        </p>
                        <Button asChild>
                            <Link href="/job_seeker/dashboard/profile">Go to Profile</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    {/* Back Button */}
                    <Button variant="ghost" className="mb-6" asChild>
                        <Link href={`/jobs/${jobId}`}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Job Details
                        </Link>
                    </Button>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Apply for this Job</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <Label htmlFor="coverLetter">Cover Letter *</Label>
                                    <Textarea
                                        id="coverLetter"
                                        placeholder="Tell us why you are a great fit..."
                                        rows={6}
                                        required
                                        value={coverLetter}
                                        onChange={(e) => setCoverLetter(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <Button type="submit" disabled={loading}>
                                        {loading ? "Submitting..." : "Submit Application"}
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link href={`/jobs/${jobId}`}>Cancel</Link>
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
