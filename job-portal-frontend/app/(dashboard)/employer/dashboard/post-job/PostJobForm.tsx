"use client"

import axios from "axios"
import { API_URL } from "@/lib/config"
import { myAppHook } from "@/context/AppProvider"
import { useEffect, useState } from "react"
import { Plus, X, MapPin, DollarSign, Clock, Briefcase, GraduationCap, Star, Building, } from "lucide-react"
import { useRouter, useParams } from "next/navigation";

type Mode = "add" | "view" | "edit";
interface JobFormProps {
    mode: Mode;
}
type Department = {
    id: number;    // or number
    name: string;
    slug: string;  // or any identifier you use for value attribute
};
interface JobFormData {
    title: string, department_id: string, location: string, type: string, min_experience: string, max_experience: string, salary_min: string, salary_max: string, description: string, responsibilities: string[], requirements: string[], qualifications: string[], skills: string[], applicationDeadline: string, startDate: string, interview_stages: { name: string; description: string }[];
}

const initialFormData: JobFormData = {
    title: "", department_id: "", location: "", type: "", min_experience: "", max_experience: "", salary_min: "", salary_max: "", description: "", responsibilities: [], requirements: [], qualifications: [], skills: [], applicationDeadline: "", startDate: "", interview_stages: [{ name: "", description: "" }],
}

function PostJobForm({ mode }: JobFormProps) {
    const [formData, setFormData] = useState<JobFormData>(initialFormData)
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { authToken, user } = myAppHook();
    const [newItems, setNewItems] = useState({ responsibility: "", requirement: "", qualification: "", benefit: "", skill: "", })
    console.log(user)
    const router = useRouter()
    const params = useParams();
    const jobId = params.id as string;
    const [dateError, setDateError] = useState<string | null>(null);
    const [expError, setExpError] = useState<string | null>(null);
    const [salaryError, setSalaryError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await axios.get(`${API_URL}/departments`);
                setDepartments(res.data.departments);
            } catch (error) {
                console.error("Failed to fetch departments", error);
            }
        };
        fetchDepartments();
    }, [authToken]);

    const addListItem = (
        field: keyof Pick<JobFormData, "responsibilities" | "requirements" | "qualifications" | "skills">,
        itemKey: keyof typeof newItems,
    ) => {
        const newItem = newItems[itemKey]
        if (newItem.trim()) {
            setFormData({
                ...formData,
                [field]: [...formData[field], newItem.trim()],
            })
            setNewItems({ ...newItems, [itemKey]: "" })
        }
    }

    const removeListItem = (
        field: keyof Pick<JobFormData, "responsibilities" | "requirements" | "qualifications" | "skills">,
        index: number,
    ) => {
        setFormData({
            ...formData,
            [field]: formData[field].filter((_, i) => i !== index),
        })
    }

    // ✅ Load job if in edit or view mode
    useEffect(() => {
        if (mode !== "add" && jobId) {
            const fetchJob = async () => {
                const response = await axios.get(`${API_URL}/jobs/${jobId}`)
                const job = await response.data;
                const startDate = job.start_date ? new Date(job.start_date).toISOString().split("T")[0] : "";
                const applicationDeadline = job.application_deadline ? new Date(job.application_deadline).toISOString().split("T")[0] : "";

                setFormData({
                    ...formData,
                    ...job,
                    startDate,
                    applicationDeadline,
                });
            };
            fetchJob();
        }
    }, [mode, jobId, authToken]);
    // ✅ Interview stage handlers
    const addInterviewStage = () => {
        setFormData({
            ...formData,
            interview_stages: [...formData.interview_stages, { name: "", description: "" }],
        });
    };

    const removeInterviewStage = (index: number) => {
        setFormData({
            ...formData,
            interview_stages: formData.interview_stages.filter((_, i) => i !== index),
        });
    };

    const updateInterviewStage = (index: number, field: "name" | "description", value: string) => {
        const updatedStages = [...formData.interview_stages];
        updatedStages[index][field] = value;
        setFormData({ ...formData, interview_stages: updatedStages });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (mode === "view") return;
        setIsSubmitting(true)
        try {
            let response
            if (mode === "add") {
                response = await axios.post(`${API_URL}/jobs`, formData, {
                    headers: {
                        Authorization: `Bearer ${authToken}`, // <-- add token here
                        "Content-Type": "application/json",
                    },
                })
                console.log(response)
            } else if (mode === "edit" && jobId) {
                response = await axios.put(`${API_URL}/jobs/${jobId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${authToken}`, // <-- add token here
                        "Content-Type": "application/json",
                    },
                })
                console.log(response)
            }
            if (response?.data?.status === false) {
                alert(response.data.message || "Something went wrong.");
                return; // stop here (no success actions)
            }
            alert("Job posted successfully!")
            console.log("Job posted:", formData)
            router.back()
        }
        catch (error: any) {
            if (error.response?.status === 403) {
                alert(error.response.data.message || "Access denied");
                return;
            }
            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert("An unexpected error occurred");
            }
            console.error("Error posting job:", error);
        }
        finally {
            setIsSubmitting(false)


        }

    }


    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {mode === "add" && "Post a New Job"}
                        {mode === "edit" && "Edit Job Posting"}
                        {mode === "view" && "View Job Details"}
                    </h1>
                    <p className="text-gray-600">
                        {mode === "add" && "Create a compelling job posting to attract top talent"}
                        {mode === "edit" && "Update your job details to keep your listing current"}
                        {mode === "view" && "See the full details of this job posting"}
                    </p>
                </div>

            </div>

            {/* Single Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information Section */}
                <div className="bg-white rounded-lg shadow border">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <Briefcase className="h-5 w-5" />
                            Basic Information
                        </h2>
                    </div>
                    <div className="p-6 space-y-6">
                        {/* Job Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Senior Frontend Developer"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                disabled={mode === "view"}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Department and Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <select
                                        value={formData.department_id || ""}
                                        onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                                    >
                                        <option value="">Select department</option>
                                        {departments.map((dept) => (
                                            <option key={dept.id} value={dept.id}>
                                                {dept.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="e.g. San Francisco, CA"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        required
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Work Type, Employment Type, Experience Level */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Employment Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.type || ""}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                                >
                                    <option value="">Select type</option>
                                    <option value="full-time">Full-time</option>
                                    <option value="part-time">Part-time</option>
                                    <option value="contract">Contract</option>
                                    <option value="internship">Internship</option>
                                    <option value="freelance">Freelance</option>
                                </select>
                            </div>

                            <div >
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Min Experience Level <span className="text-red-500">*</span>
                                </label>
                                <div>
                                    <input
                                        type="number"
                                        placeholder="in years"
                                        value={formData.min_experience || ""}
                                        onChange={(e) => {
                                            const value = Number(e.target.value);
                                            setFormData({ ...formData, min_experience: e.target.value });

                                            // Validation
                                            if (value < 0) setExpError("Experience cannot be negative");
                                            else if (formData.max_experience && value > Number(formData.max_experience)) {
                                                setExpError("Min experience cannot exceed max experience");
                                            } else {
                                                setExpError(null);
                                            }
                                        }}
                                        disabled={mode === "view"}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {expError && <p className="text-red-500 text-sm mt-1">{expError}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Max Experience Level <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="in years"
                                    value={formData.max_experience || ""}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        setFormData({ ...formData, max_experience: e.target.value });

                                        // Validation
                                        if (value < 0) setExpError("Experience cannot be negative");
                                        else if (formData.min_experience && value < Number(formData.min_experience)) {
                                            setExpError("Max experience cannot be less than min experience");
                                        } else {
                                            setExpError(null);
                                        }
                                    }}
                                    disabled={mode === "view"}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {expError && <p className="text-red-500 text-sm mt-1">{expError}</p>}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Interview Stages Section */}
                <div className="bg-white rounded-lg shadow border">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <Briefcase className="h-5 w-5" />
                            Interview Stages
                        </h2>
                        {mode !== "view" && (
                            <button
                                type="button"
                                onClick={addInterviewStage}
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                            >
                                <Plus className="h-4 w-4" /> Add Round
                            </button>
                        )}
                    </div>

                    <div className="p-6 space-y-4">
                        {formData.interview_stages.map((stage, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative"
                            >
                                {mode !== "view" && formData.interview_stages.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeInterviewStage(index)}
                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}

                                <h4 className="font-semibold text-gray-800 mb-3">
                                    Round {index + 1}
                                </h4>

                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Stage Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Technical Round"
                                            value={stage.name}
                                            onChange={(e) =>
                                                updateInterviewStage(index, "name", e.target.value)
                                            }
                                            disabled={mode === "view"}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            placeholder="e.g. Candidate will be tested on problem-solving and coding."
                                            value={stage.description}
                                            onChange={(e) =>
                                                updateInterviewStage(index, "description", e.target.value)
                                            }
                                            disabled={mode === "view"}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Job Description Section */}
                <div className="bg-white rounded-lg shadow border">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Job Description</h2>
                    </div>
                    <div className="p-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                placeholder="Provide a detailed description of the role, what the candidate will be doing, and what makes this opportunity exciting..."
                                rows={8}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                💡 Tip: Include information about your company, the roles impact, and growth opportunities
                            </p>
                        </div>
                    </div>
                </div>

                {/* Responsibilities and Skills Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Key Responsibilities */}
                    <div className="bg-white rounded-lg shadow border">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">Key Responsibilities</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex flex-wrap gap-2 min-h-[60px] p-3 border-2 border-dashed border-gray-200 rounded-lg">
                                {(formData.responsibilities ?? []).length === 0 ? (
                                    <span className="text-gray-400 text-sm">Add responsibilities using the form below</span>
                                ) : (
                                    formData.responsibilities.map((responsibility, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                        >
                                            {responsibility}
                                            <button
                                                type="button"
                                                onClick={() => removeListItem("responsibilities", index)}
                                                className="ml-2 text-blue-600 hover:text-blue-800"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))
                                )}
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Add a key responsibility..."
                                    value={newItems.responsibility}
                                    onChange={(e) => setNewItems({ ...newItems, responsibility: e.target.value })}
                                    onKeyPress={(e) => e.key === "Enter" && e.preventDefault()}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => addListItem("responsibilities", "responsibility")}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Required Skills */}
                    <div className="bg-white rounded-lg shadow border">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">Required Skills</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex flex-wrap gap-2 min-h-[60px] p-3 border-2 border-dashed border-gray-200 rounded-lg">
                                {(formData.skills ?? []).length === 0 ? (
                                    <span className="text-gray-400 text-sm">Add skills using the form below</span>
                                ) : (
                                    formData.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                                        >
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => removeListItem("skills", index)}
                                                className="ml-2 text-green-600 hover:text-green-800"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))
                                )}
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Add a required skill..."
                                    value={newItems.skill}
                                    onChange={(e) => setNewItems({ ...newItems, skill: e.target.value })}
                                    onKeyPress={(e) => e.key === "Enter" && e.preventDefault()}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => addListItem("skills", "skill")}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Requirements Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Must-Have Requirements */}
                    <div className="bg-white rounded-lg shadow border">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <GraduationCap className="h-5 w-5" />
                                Must-Have Requirements
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex flex-wrap gap-2 min-h-[60px] p-3 border-2 border-dashed border-gray-200 rounded-lg">
                                {(formData.requirements ?? []).length === 0 ? (
                                    <span className="text-gray-400 text-sm">Add requirements using the form below</span>
                                ) : (
                                    formData.requirements.map((requirement, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
                                        >
                                            {requirement}
                                            <button
                                                type="button"
                                                onClick={() => removeListItem("requirements", index)}
                                                className="ml-2 text-red-600 hover:text-red-800"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))
                                )}
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Add a requirement..."
                                    value={newItems.requirement}
                                    onChange={(e) => setNewItems({ ...newItems, requirement: e.target.value })}
                                    onKeyPress={(e) => e.key === "Enter" && e.preventDefault()}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => addListItem("requirements", "requirement")}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Preferred Qualifications */}
                    <div className="bg-white rounded-lg shadow border">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <Star className="h-5 w-5" />
                                Preferred Qualifications
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex flex-wrap gap-2 min-h-[60px] p-3 border-2 border-dashed border-gray-200 rounded-lg">
                                {(formData.qualifications ?? []).length === 0 ? (
                                    <span className="text-gray-400 text-sm">Add qualifications using the form below</span>
                                ) : (
                                    formData.qualifications.map((qualification, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                                        >
                                            {qualification}
                                            <button
                                                type="button"
                                                onClick={() => removeListItem("qualifications", index)}
                                                className="ml-2 text-purple-600 hover:text-purple-800"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))
                                )}
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Add a preferred qualification..."
                                    value={newItems.qualification}
                                    onChange={(e) => setNewItems({ ...newItems, qualification: e.target.value })}
                                    onKeyPress={(e) => e.key === "Enter" && e.preventDefault()}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => addListItem("qualifications", "qualification")}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Compensation Section */}
                <div className="bg-white rounded-lg shadow border">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Salary
                        </h2>
                    </div>
                    <div className="p-6 space-y-6">


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Salary</label>
                                <input
                                    type="number"
                                    placeholder="80000"
                                    value={formData.salary_min}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        setFormData({ ...formData, salary_min: e.target.value });

                                        // Validation
                                        if (value < 0) setSalaryError("Salary cannot be negative");
                                        else if (formData.salary_max && value > Number(formData.salary_max)) {
                                            setSalaryError("Minimum salary cannot exceed maximum salary");
                                        } else {
                                            setSalaryError(null);
                                        }
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Salary</label>
                                <input
                                    type="number"
                                    placeholder="120000"
                                    value={formData.salary_max}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        setFormData({ ...formData, salary_max: e.target.value });

                                        // Validation
                                        if (value < 0) setSalaryError("Salary cannot be negative");
                                        else if (formData.salary_min && value < Number(formData.salary_min)) {
                                            setSalaryError("Maximum salary cannot be less than minimum salary");
                                        } else {
                                            setSalaryError(null);
                                        }
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        {salaryError && <p className="text-red-500 text-sm mt-1">{salaryError}</p>}
                    </div>
                </div>

                {/* Timeline Section */}
                <div className="bg-white rounded-lg shadow border">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Timeline
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Start Date</label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => {
                                        const newStartDate = e.target.value;
                                        setFormData({ ...formData, startDate: newStartDate });

                                        if (formData.applicationDeadline && newStartDate > formData.applicationDeadline) {
                                            setDateError("Start date cannot be after application deadline.");
                                        } else {
                                            setDateError(null);
                                        }
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline</label>
                                <input
                                    type="date"

                                    value={formData.applicationDeadline}
                                    onChange={(e) => {
                                        const newDeadline = e.target.value;
                                        setFormData({ ...formData, applicationDeadline: newDeadline });

                                        if (formData.startDate && newDeadline < formData.startDate) {
                                            setDateError("Application deadline cannot be before start date.");
                                        } else {
                                            setDateError(null);
                                        }
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {dateError && (
                                    <p className="text-sm text-red-500 mt-2">{dateError}</p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    >
                        Cancel
                    </button>
                    {
                        mode !== "view" && (

                            <button
                                type="submit"
                                disabled={isSubmitting || !!dateError}
                                className={`px-8 py-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSubmitting ? "bg-gray-400 text-white cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
                                    }`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Posting Job...
                                    </span>
                                ) : (
                                    "Post Job"

                                )}
                            </button>
                        )}
                </div>
            </form >
        </div >
    )
}
export default PostJobForm;