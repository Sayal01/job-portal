"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { myAppHook } from "@/context/AppProvider";

import Loader from "@/components/Loader";
import {
    User,
    ClipboardList,
    Briefcase,
    Upload,
} from "lucide-react";
import { API_IMG, API_URL } from "@/lib/config";

type Mode = "add" | "view" | "edit";

type Education = {
    institution: string;
    degree: string;
    start_date: string;
    end_date: string;
};

type WorkExperience = {
    company: string;
    position: string;
    start_date: string;
    end_date: string;
};
type WorkExperienceItem = WorkExperience & { isEditing?: boolean };
type EducationItem = Education & { isEditing?: boolean };


type JobSeekerProfileFormData = {
    bio: string;
    skills: string[];
    education: EducationItem[];
    work_experience: WorkExperienceItem[];
    resume_file: File | null; // ✅ only the upload file
    resume_url: string | null; // ✅ the saved public URL
    preferred_role?: string | null;
};

const initialFormData: JobSeekerProfileFormData = {
    bio: "",
    skills: [],
    education: [{ institution: "", degree: "", start_date: "", end_date: "" }],
    work_experience: [{ company: "", position: "", start_date: "", end_date: "" }],
    preferred_role: "",
    resume_file: null,
    resume_url: null,
};
interface LocalUser {
    first_name: string;
    last_name: string;
    email: string;
    image?: string | null;
    role: string | null;
}


export function JobSeekerProfileForm() {
    const [formData, setFormData] = useState<JobSeekerProfileFormData>(initialFormData);
    const [originalData, setOriginalData] = useState<JobSeekerProfileFormData>(initialFormData);
    const [mode, setMode] = useState<Mode>("view");
    const [loading, setIsLoading] = useState(Boolean);
    const [showAddPrompt, setShowAddPrompt] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [skillInput, setSkillInput] = useState("");
    const [localUser, setLocalUser] = useState<LocalUser | null>(null);
    const { authToken, user } = myAppHook();
    useEffect(() => {
        async function fetchUser() {
            if (!authToken) return;

            try {
                const res = await axios.get(`${API_URL}/me`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });

                const user = res.data.user;
                setLocalUser({
                    first_name: user.first_name || "",
                    last_name: user.last_name || "",
                    email: user.email || "",
                    role: user.role || "",
                    image: user.image || null,
                });
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        }

        fetchUser();
    }, [authToken]);
    useEffect(() => {

        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${API_URL}/profile-show`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                const data = response.data;
                const resumeUrl = data.resume_file
                    ? `${API_IMG}/${data.resume_file}`
                    : null;

                if (data) {
                    const fetchedData: JobSeekerProfileFormData = {
                        bio: data.bio || "",
                        skills: data.skills || [],
                        education: data.education || [{ institution: "", degree: "", year: "" }],
                        work_experience: data.work_experience || [{ company: "", position: "", start_date: "", end_date: "" }],
                        resume_file: null,
                        resume_url: resumeUrl,
                        preferred_role: data.preferred_role || "",
                    };

                    setFormData(fetchedData);
                    setOriginalData(fetchedData);
                    setMode("view");
                    setShowAddPrompt(false);
                } else {

                    setShowAddPrompt(true);
                    setMode("view");
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                setShowAddPrompt(true);
                setMode("view");
            }
            finally {
                setIsLoading(false)
            }
        };
        fetchProfile();
    }, [authToken]);

    // Skill handlers
    const addSkill = () => {
        if (skillInput.trim()) {
            setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
            setSkillInput("");
        }
    };
    const removeSkill = (index: number) => {
        setFormData({ ...formData, skills: formData.skills.filter((_, i) => i !== index) });
    };

    // Education handlers
    const updateEducation = (index: number, field: keyof Education, value: string) => {
        const updated = [...formData.education];
        updated[index][field] = value;
        setFormData({ ...formData, education: updated });
    };
    const addEducation = () => {
        setFormData({
            ...formData,
            education: [
                ...formData.education,
                { institution: "", degree: "", start_date: "", end_date: "", isEditing: true },
            ],
        });
    };
    const toggleEducationEditing = (index: number) => {
        const updated = [...formData.education];
        updated[index].isEditing = !updated[index].isEditing;
        setFormData({ ...formData, education: updated });
    };

    const removeEducation = (index: number) => {
        setFormData({
            ...formData,
            education: formData.education.filter((_, i) => i !== index),
        });
    };
    function calculateYears(startDate: string, endDate?: string) {
        if (!startDate) return 0;

        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : new Date(); // Use today if endDate is empty

        let years = end.getFullYear() - start.getFullYear();
        const monthDiff = end.getMonth() - start.getMonth();
        const dayDiff = end.getDate() - start.getDate();

        // Adjust if the end month/day hasn't reached yet
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            years--;
        }

        return years;
    }



    // Work Experience handlers
    const updateWorkExperience = (index: number, field: keyof WorkExperience, value: string) => {
        const updated = [...formData.work_experience];
        updated[index][field] = value;
        setFormData({ ...formData, work_experience: updated });
    };
    const addWorkExperience = () => {
        setFormData({
            ...formData,
            work_experience: [
                ...formData.work_experience,
                { company: "", position: "", start_date: "", end_date: "", isEditing: true },
            ],
        });
    };
    const toggleWorkExperienceEditing = (index: number) => {
        const updated = [...formData.work_experience];
        updated[index].isEditing = !updated[index].isEditing;
        setFormData({ ...formData, work_experience: updated });
    };

    const removeWorkExperience = (index: number) => {
        setFormData({
            ...formData,
            work_experience: formData.work_experience.filter((_, i) => i !== index),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === "view") return;

        setIsSubmitting(true);

        try {
            const form = new FormData();
            form.append("bio", formData.bio);
            formData.skills.forEach((skill) => form.append("skills[]", skill));
            form.append("education", JSON.stringify(formData.education));
            form.append("work_experience", JSON.stringify(formData.work_experience));
            if (formData.resume_file) {
                form.append("resume_file", formData.resume_file);
            }
            form.append("preferred_role", formData.preferred_role || "");

            const response = await axios.post(`${API_URL}/profile-update`, form, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            alert("Profile saved successfully!");

            // Update formData with new resume URL, clear the uploaded file
            setFormData((prev) => ({
                ...prev,
                resume_file: null,
                resume_url: response.data.profile.resume_file
                    ? `${API_IMG}/${response.data.profile.resume_file}`
                    : null,
            }));
            setOriginalData((prev) => ({
                ...prev,
                resume_file: null,
                resume_url: response.data.profile.resume_file
                    ? `${API_IMG}/${response.data.profile.resume_file}`
                    : null,
            }));

            setMode("view");
            console.log(formData)
        } catch (error) {
            console.error(error);
            alert("Error saving profile.");
        } finally {
            setIsSubmitting(false);
        }
    };


    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader />
            </div>
        );
    }

    if (!loading && showAddPrompt) {
        return (
            <div className="max-w-xl mx-auto p-8 text-center">
                <p className="mb-4 text-lg text-gray-700">No profile found.</p>
                <button
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                    onClick={() => {
                        setMode("add");
                        setShowAddPrompt(false);
                    }}
                >
                    Add Profile Now
                </button>
            </div>
        );
    }

    if (mode === "view") {
        return (
            <div className="max-w-5xl mx-auto p-6 space-y-6">
                <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
                <>
                    <div className="flex items-center space-x-4 mb-6">
                        {localUser?.image ? (
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
                                <strong>First Name:</strong> {localUser?.first_name}
                            </p>
                            <p>
                                <strong>Last Name:</strong> {localUser?.last_name}
                            </p>
                            <p>
                                <strong>Email:</strong> {localUser?.email}
                            </p>
                        </div>
                    </div>

                    {/* <Button onClick={() => setIsEditing(true)}>Edit Profile</Button> */}
                </>
                {/* Bio */}
                <div>
                    <h2 className="text-xl font-semibold mb-2">Bio</h2>
                    <p className="text-gray-700">{formData.bio || "No bio provided."}</p>
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-2">Preferred role</h2>
                    <p className="text-gray-700">{formData.preferred_role || "No role specified."}</p>
                </div>

                {/* Skills */}
                <div>
                    <h2 className="text-xl font-semibold mb-2">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {formData.skills.length > 0 ? (
                            formData.skills.map((skill, i) => (
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
                </div>

                {/* Education */}
                <div>
                    <h2 className="text-xl font-semibold mb-2">Education</h2>
                    <div className="space-y-2">
                        {formData.education.length > 0 ? (
                            formData.education.map((edu, i) => (
                                <div key={i} className="border p-4 rounded">
                                    <p className="font-medium">{edu.institution}</p>
                                    <p>{edu.degree} — {edu.start_date} to {edu.end_date}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-700">No education details.</p>
                        )}
                    </div>
                </div>

                {/* Work Experience */}
                <div>
                    <h2 className="text-xl font-semibold mb-2">Work Experience</h2>
                    <div className="space-y-2">
                        {formData.work_experience.length > 0 ? (
                            formData.work_experience.map((work, i) => (
                                <div key={i} className="border p-4 rounded">
                                    <p className="font-medium">{work.company}</p>
                                    <p>{work.position} — {work.start_date} to {work.end_date}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-700">No work experience listed.</p>
                        )}
                    </div>
                </div>

                {/* Resume */}
                <div>
                    <h2 className="text-xl font-semibold mb-2">Resume</h2>
                    {formData.resume_url ? (
                        <p className="mt-4">
                            <a
                                href={formData.resume_url}
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


                </div>

                <button
                    onClick={() => setMode("edit")}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                    Edit Profile
                </button>
            </div>
        );
    }

    // Add / Edit form UI (same)
    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    {mode === "add" ? "Add Your Profile" : "Edit Your Profile"}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-lg shadow border p-8">
                {/* Bio */}
                <section>
                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-2 text-gray-900">
                        <User className="w-5 h-5" /> Bio
                    </h2>
                    <textarea
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tell us about yourself"
                        rows={5}
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        required
                    />
                </section>
                <section>
                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-2 text-gray-900">
                        <User className="w-5 h-5" /> Preferred Role
                    </h2>
                    <input
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        name="preferred_role"
                        value={formData.preferred_role || ''}
                        onChange={(e) => setFormData({ ...formData, preferred_role: e.target.value })}
                    />

                </section>

                {/* Skills */}
                <section>
                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-2 text-gray-900">
                        <ClipboardList className="w-5 h-5" /> Skills
                    </h2>
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            placeholder="Add a skill"
                            className="flex-grow border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={addSkill}
                            className="bg-blue-600 text-white px-5 rounded-lg hover:bg-blue-700"
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill, i) => (
                            <span
                                key={i}
                                className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                            >
                                {skill}
                                <button
                                    type="button"
                                    onClick={() => removeSkill(i)}
                                    className="ml-2 text-red-500 font-bold"
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                </section>

                {/* Education */}
                <section>
                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-gray-900">
                        Education
                    </h2>
                    <div className="space-y-4">
                        {formData.education.map((edu, index) => (
                            <div
                                key={index}
                                className="border p-4 rounded-lg bg-white shadow"
                            >
                                {edu.isEditing ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Institution"
                                            value={edu.institution}
                                            onChange={(e) => updateEducation(index, "institution", e.target.value)}
                                            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Degree"
                                            value={edu.degree}
                                            onChange={(e) => updateEducation(index, "degree", e.target.value)}
                                            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        <input
                                            type="date"
                                            placeholder="End Date"
                                            value={edu.start_date || ""}
                                            onChange={(e) => updateEducation(index, "start_date", e.target.value)}
                                            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="date"
                                            placeholder="End Date"
                                            value={edu.end_date || ""}
                                            onChange={(e) => updateEducation(index, "end_date", e.target.value)}
                                            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                type="button"
                                                onClick={() => toggleEducationEditing(index)}
                                                className="text-green-600 underline text-sm"
                                            >
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeEducation(index)}
                                                className="text-red-600 underline text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                                        <div>
                                            <p className="font-medium">{edu.institution}</p>
                                            <p>{edu.degree} — {edu.start_date} - {edu.end_date}</p>
                                        </div>
                                        <div className="flex gap-4 mt-2 md:mt-0">
                                            <button
                                                type="button"
                                                onClick={() => toggleEducationEditing(index)}
                                                className="text-blue-600 underline text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeEducation(index)}
                                                className="text-red-600 underline text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addEducation}
                            className="mt-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                        >
                            Add Education
                        </button>
                    </div>
                </section>


                {/* Work Experience */}
                <section>
                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-gray-900">
                        <Briefcase className="w-5 h-5" /> Work Experience
                    </h2>
                    <div className="space-y-4">
                        {formData.work_experience.map((work, index) => (
                            <div
                                key={index}
                                className="border p-4 rounded-lg bg-white shadow"
                            >
                                {work.isEditing ? (
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Company"
                                            value={work.company}
                                            onChange={(e) => updateWorkExperience(index, "company", e.target.value)}
                                            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Position"
                                            value={work.position}
                                            onChange={(e) => updateWorkExperience(index, "position", e.target.value)}
                                            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        <input
                                            type="date"
                                            placeholder="Start Date"
                                            value={work.start_date || ""}
                                            onChange={(e) => updateWorkExperience(index, "start_date", e.target.value)}
                                            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        <input
                                            type="date"
                                            placeholder="End Date"
                                            value={work.end_date || ""}
                                            onChange={(e) => updateWorkExperience(index, "end_date", e.target.value)}
                                            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                type="button"
                                                onClick={() => toggleWorkExperienceEditing(index)}
                                                className="text-green-600 underline text-sm"
                                            >
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeWorkExperience(index)}
                                                className="text-red-600 underline text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                                        <div>
                                            <p className="font-medium">{work.company}</p>
                                            <p>
                                                {work.position} — {work.start_date} to {work.end_date || "Present"} ({calculateYears(work.start_date, work.end_date)} yrs)
                                            </p>

                                        </div>
                                        <div className="flex gap-4 mt-2 md:mt-0">
                                            <button
                                                type="button"
                                                onClick={() => toggleWorkExperienceEditing(index)}
                                                className="text-blue-600 underline text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeWorkExperience(index)}
                                                className="text-red-600 underline text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addWorkExperience}
                            className="mt-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                        >
                            Add Work Experience
                        </button>
                    </div>
                </section>


                {/* Resume Upload */}
                {/* Resume Upload */}
                <section>
                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-2 text-gray-900">
                        <Upload className="w-5 h-5" /> Resume Upload
                    </h2>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) =>
                            setFormData({ ...formData, resume_file: e.target.files?.[0] || null, resume_url: null })
                        }
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {formData.resume_url && (
                        <div className="mt-3">
                            <p className="mb-1 font-semibold text-gray-700">Current Resume:</p>
                            <a
                                href={formData.resume_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                            >
                                View Resume
                            </a>

                            {formData.resume_url.endsWith(".pdf") && (
                                <iframe
                                    src={formData.resume_url}
                                    width="100%"
                                    height="400"
                                    className="mt-2 border"
                                    title="Resume Preview"
                                />
                            )}
                        </div>
                    )}
                </section>


                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => {
                            setFormData(originalData);
                            setMode("view");
                        }}
                        className="bg-gray-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {isSubmitting ? "Saving..." : "Save Profile"}
                    </button>
                </div>
            </form>
        </div>
    );
}
