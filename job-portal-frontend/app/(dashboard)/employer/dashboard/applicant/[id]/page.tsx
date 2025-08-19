"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { API_IMG, API_URL } from "@/lib/config";
import Loader from "@/components/Loader";
import { User } from "lucide-react";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";

type Education = {
    institution: string;
    degree: string;
    year: string;
};

type WorkExperience = {
    company: string;
    position: string;
    years: string;
};

type JobSeekerProfile = {
    bio: string;
    skills: string[];
    education: Education[];
    work_experience: WorkExperience[];
    resume_url: string | null;
};

type LocalUser = {
    first_name: string;
    last_name: string;
    email: string;
    image?: string | null;
};

export default function EmployerViewApplicantPage() {
    const { id } = useParams();
    const router = useRouter()
    const [profile, setProfile] = useState<JobSeekerProfile | null>(null);
    const [localUser, setLocalUser] = useState<LocalUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get("AuthToken");
        const fetchApplicant = async () => {
            try {

                const res = await axios.get(`${API_URL}/applications/applicant/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const { user } = res.data;

                setLocalUser({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    image: user.image || null,
                });

                setProfile({
                    bio: user.profile.bio || "",
                    skills: user.profile.skills || [],
                    education: user.profile.education || [],
                    work_experience: user.profile.work_experience || [],
                    resume_url: user.profile.resume_file ? `${API_IMG}/${user.profile.resume_file}` : null,
                });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplicant();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader />
            </div>
        );
    }

    if (!localUser || !profile) {
        return (
            <div className="max-w-xl mx-auto p-8 text-center">
                <p className="text-lg text-gray-700">Applicant not found.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold mb-6">Applicant Details</h1>

            <div className="flex items-center space-x-4 mb-6">
                {localUser.image ? (
                    <img
                        src={`${API_IMG}/${localUser.image}`}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover"
                    />
                ) : (
                    <User className="w-24 h-24 text-gray-400" />
                )}
                <div>
                    <p>
                        <strong>First Name:</strong> {localUser.first_name}
                    </p>
                    <p>
                        <strong>Last Name:</strong> {localUser.last_name}
                    </p>
                    <p>
                        <strong>Email:</strong> {localUser.email}
                    </p>
                </div>
            </div>

            <section>
                <h2 className="text-xl font-semibold mb-2">Bio</h2>
                <p className="text-gray-700">{profile.bio || "No bio provided."}</p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">Skills</h2>
                <div className="flex flex-wrap gap-2">
                    {profile.skills.length > 0 ? (
                        profile.skills.map((skill, i) => (
                            <span
                                key={i}
                                className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                            >
                                {skill}
                            </span>
                        ))
                    ) : (
                        <p className="text-gray-700">No skills added.</p>
                    )}
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">Education</h2>
                <div className="space-y-2">
                    {profile.education.length > 0 ? (
                        profile.education.map((edu, i) => (
                            <div key={i} className="border p-4 rounded">
                                <p className="font-medium">{edu.institution}</p>
                                <p>{edu.degree} — {edu.year}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-700">No education details.</p>
                    )}
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">Work Experience</h2>
                <div className="space-y-2">
                    {profile.work_experience.length > 0 ? (
                        profile.work_experience.map((work, i) => (
                            <div key={i} className="border p-4 rounded">
                                <p className="font-medium">{work.company}</p>
                                <p>{work.position} — {work.years}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-700">No work experience listed.</p>
                    )}
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">Resume</h2>
                {profile.resume_url ? (
                    <p className="mt-4">
                        <a
                            href={profile.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                        >
                            View Resume
                        </a>
                    </p>
                ) : (
                    <p className="mt-4">No resume uploaded.</p>
                )}
            </section>
            <div>
                <Button onClick={() => router.back()}>
                    cancel
                </Button>
            </div>
        </div>
    );
}
