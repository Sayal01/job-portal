"use client"

import axios from "axios"
import { API_URL } from "@/lib/config"
import { myAppHook } from "@/context/AppProvider"
import { useEffect, useState } from "react"
import { Plus, X, Save, Eye, MapPin, DollarSign, Clock, Briefcase, GraduationCap, Star, Building, Users, } from "lucide-react"
import { useRouter, useParams, useSearchParams } from "next/navigation";

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
    title: string, department_id: string, location: string, type: string, experience_level: string, salary_min: string, salary_max: string, description: string, responsibilities: string[], requirements: string[], qualifications: string[], skills: string[], applicationDeadline: string, startDate: string,
}

const initialFormData: JobFormData = {
    title: "", department_id: "", location: "", type: "", experience_level: "", salary_min: "", salary_max: "", description: "", responsibilities: [], requirements: [], qualifications: [], skills: [], applicationDeadline: "", startDate: "",
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
                setFormData({
                    ...formData,
                    ...job, // match keys with your API shape!
                });
            };
            fetchJob();
        }
    }, [mode, jobId, authToken]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (mode === "view") return;
        setIsSubmitting(true)
        try {

            if (mode === "add") {
                const response = await axios.post(`${API_URL}/jobs`, formData, {
                    headers: {
                        Authorization: `Bearer ${authToken}`, // <-- add token here
                        "Content-Type": "application/json",
                    },
                })
                console.log(response)
            } else if (mode === "edit" && jobId) {
                const response = await axios.put(`${API_URL}/jobs/${jobId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${authToken}`, // <-- add token here
                        "Content-Type": "application/json",
                    },
                })
                console.log(response)
            }


        }
        catch (error) {
            console.error("error ", error)
        } finally {
            setIsSubmitting(false)
            console.log("Job posted:", formData)
            router.back()
        }
        // Simulate API call
        // await new Promise((resolve) => setTimeout(resolve, 2000))
        alert("Job posted successfully!")
        // router.push("/dashboard/my-jobs")
    }

    const handleSaveDraft = () => {
        console.log("Draft saved:", formData)
        alert("Draft saved successfully!")
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
                            {/* <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Work Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.workType}
                                    onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                                >
                                    <option value="">Select work type</option>
                                    <option value="onsite">On-site</option>
                                    <option value="remote">Remote</option>
                                    <option value="hybrid">Hybrid</option>
                                </select>
                            </div> */}

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

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Experience Level <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <select
                                        value={formData.experience_level || ""}
                                        onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                                        required
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                                    >
                                        <option value="">Select level</option>
                                        <option value="0-2 years">Entry Level (0-2 years)</option>
                                        <option value="2-3 years">Mid Level (3-5 years)</option>
                                        <option value="3-5 years">Senior Level (6-8 years)</option>
                                        <option value="6+ years">Lead/Principal (6+ years)</option>
                                        <option value="executive">Executive</option>
                                    </select>
                                </div>
                            </div>
                        </div>
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
                                💡 Tip: Include information about your company, the role's impact, and growth opportunities
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
                                    onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Salary</label>
                                <input
                                    type="number"
                                    placeholder="120000"
                                    value={formData.salary_max}
                                    onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

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
            </form>
        </div>
    )
}
export default PostJobForm;