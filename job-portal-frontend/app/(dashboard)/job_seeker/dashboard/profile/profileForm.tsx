"use client"

import type React from "react"

import { useState, useEffect } from "react"
import axios from "axios"
import { myAppHook } from "@/context/AppProvider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import Loader from "@/components/Loader"
import {
    User,
    ClipboardList,
    Briefcase,
    Upload,
    GraduationCap,
    Plus,
    X,
    Edit3,
    Trash2,
    Save,
    Calendar,
    Building,
    FileText,
    Target,
} from "lucide-react"
import { API_IMG, API_URL } from "@/lib/config"

type Mode = "add" | "view" | "edit"

type Education = {
    institution: string
    degree: string
    start_date: string
    end_date: string
}

type WorkExperience = {
    company: string
    position: string
    start_date: string
    end_date: string
}
type WorkExperienceItem = WorkExperience & { isEditing?: boolean }
type EducationItem = Education & { isEditing?: boolean }

type JobSeekerProfileFormData = {
    bio: string
    skills: string[]
    education: EducationItem[]
    work_experience: WorkExperienceItem[]
    resume_file: File | null // ✅ only the upload file
    resume_url: string | null // ✅ the saved public URL
    preferred_role?: string | null
}

const initialFormData: JobSeekerProfileFormData = {
    bio: "",
    skills: [],
    education: [{ institution: "", degree: "", start_date: "", end_date: "" }],
    work_experience: [{ company: "", position: "", start_date: "", end_date: "" }],
    preferred_role: "",
    resume_file: null,
    resume_url: null,
}
interface LocalUser {
    first_name: string
    last_name: string
    email: string
    image?: string | null
    role: string | null
}

export function JobSeekerProfileForm() {
    const [formData, setFormData] = useState<JobSeekerProfileFormData>(initialFormData)
    const [originalData, setOriginalData] = useState<JobSeekerProfileFormData>(initialFormData)
    const [mode, setMode] = useState<Mode>("view")
    const [loading, setIsLoading] = useState(Boolean)
    const [showAddPrompt, setShowAddPrompt] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [skillInput, setSkillInput] = useState("")
    const [localUser, setLocalUser] = useState<LocalUser | null>(null)
    const { authToken } = myAppHook()

    useEffect(() => {
        async function fetchUser() {
            if (!authToken) return

            try {
                const res = await axios.get(`${API_URL}/me`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                })

                const user = res.data.user
                setLocalUser({
                    first_name: user.first_name || "",
                    last_name: user.last_name || "",
                    email: user.email || "",
                    role: user.role || "",
                    image: user.image || null,
                })
            } catch (error) {
                console.error("Failed to fetch user:", error)
            }
        }

        fetchUser()
    }, [authToken])
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true)
                const response = await axios.get(`${API_URL}/profile-show`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                })
                const data = response.data
                const resumeUrl = data.resume_file ? `${API_IMG}/${data.resume_file}` : null

                if (data) {
                    const fetchedData: JobSeekerProfileFormData = {
                        bio: data.bio || "",
                        skills: data.skills || [],
                        education: data.education || [{ institution: "", degree: "", year: "" }],
                        work_experience: data.work_experience || [{ company: "", position: "", start_date: "", end_date: "" }],
                        resume_file: null,
                        resume_url: resumeUrl,
                        preferred_role: data.preferred_role || "",
                    }

                    setFormData(fetchedData)
                    setOriginalData(fetchedData)
                    setMode("view")
                    setShowAddPrompt(false)
                } else {
                    setShowAddPrompt(true)
                    setMode("view")
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error)
                setShowAddPrompt(true)
                setMode("view")
            } finally {
                setIsLoading(false)
            }
        }
        fetchProfile()
    }, [authToken])

    // Skill handlers
    const addSkill = () => {
        if (skillInput.trim()) {
            setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] })
            setSkillInput("")
        }
    }
    const removeSkill = (index: number) => {
        setFormData({ ...formData, skills: formData.skills.filter((_, i) => i !== index) })
    }

    // Education handlers
    const updateEducation = (index: number, field: keyof Education, value: string) => {
        const updated = [...formData.education]
        updated[index][field] = value
        setFormData({ ...formData, education: updated })
    }
    const addEducation = () => {
        setFormData({
            ...formData,
            education: [
                ...formData.education,
                { institution: "", degree: "", start_date: "", end_date: "", isEditing: true },
            ],
        })
    }
    const toggleEducationEditing = (index: number) => {
        const updated = [...formData.education]
        updated[index].isEditing = !updated[index].isEditing
        setFormData({ ...formData, education: updated })
    }

    const removeEducation = (index: number) => {
        setFormData({
            ...formData,
            education: formData.education.filter((_, i) => i !== index),
        })
    }
    function calculateYears(startDate: string, endDate?: string) {
        if (!startDate) return 0

        const start = new Date(startDate)
        const end = endDate ? new Date(endDate) : new Date() // Use today if endDate is empty

        let years = end.getFullYear() - start.getFullYear()
        const monthDiff = end.getMonth() - start.getMonth()
        const dayDiff = end.getDate() - start.getDate()

        // Adjust if the end month/day hasn't reached yet
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            years--
        }

        return years
    }

    // Work Experience handlers
    const updateWorkExperience = (index: number, field: keyof WorkExperience, value: string) => {
        const updated = [...formData.work_experience]
        updated[index][field] = value
        setFormData({ ...formData, work_experience: updated })
    }
    const addWorkExperience = () => {
        setFormData({
            ...formData,
            work_experience: [
                ...formData.work_experience,
                { company: "", position: "", start_date: "", end_date: "", isEditing: true },
            ],
        })
    }
    const toggleWorkExperienceEditing = (index: number) => {
        const updated = [...formData.work_experience]
        updated[index].isEditing = !updated[index].isEditing
        setFormData({ ...formData, work_experience: updated })
    }

    const removeWorkExperience = (index: number) => {
        setFormData({
            ...formData,
            work_experience: formData.work_experience.filter((_, i) => i !== index),
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (mode === "view") return

        setIsSubmitting(true)

        try {
            const form = new FormData()
            form.append("bio", formData.bio)
            formData.skills.forEach((skill) => form.append("skills[]", skill))
            form.append("education", JSON.stringify(formData.education))
            form.append("work_experience", JSON.stringify(formData.work_experience))
            if (formData.resume_file) {
                form.append("resume_file", formData.resume_file)
            }
            form.append("preferred_role", formData.preferred_role || "")

            const response = await axios.post(`${API_URL}/profile-update`, form, {
                headers: { Authorization: `Bearer ${authToken}` },
            })
            alert("Profile saved successfully!")

            // Update formData with new resume URL, clear the uploaded file
            setFormData((prev) => ({
                ...prev,
                resume_file: null,
                resume_url: response.data.profile.resume_file ? `${API_IMG}/${response.data.profile.resume_file}` : null,
            }))
            setOriginalData((prev) => ({
                ...prev,
                resume_file: null,
                resume_url: response.data.profile.resume_file ? `${API_IMG}/${response.data.profile.resume_file}` : null,
            }))

            setMode("view")
            console.log(formData)
        } catch (error) {
            console.error(error)
            alert("Error saving profile.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-background">
                <Loader />
            </div>
        )
    }

    if (!loading && showAddPrompt) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <Card className="max-w-md w-full">
                    <CardContent className="pt-6 text-center">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Create Your Profile</h2>
                        <p className="text-muted-foreground mb-6">
                            No profile found. Let's get started by creating your professional profile.
                        </p>
                        <Button
                            onClick={() => {
                                setMode("add")
                                setShowAddPrompt(false)
                            }}
                            className="w-full"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Profile
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (mode === "view") {
        return (
            <div className="min-h-screen bg-background">
                <div className="max-w-4xl mx-auto p-6 space-y-6">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">Professional Profile</h1>
                        <p className="text-muted-foreground">Manage your career information and showcase your expertise</p>
                    </div>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                <Avatar className="w-24 h-24">
                                    <AvatarImage src={localUser?.image ? `${API_IMG}/${localUser.image}` : undefined} alt="Profile" />
                                    <AvatarFallback className="text-xl">
                                        {localUser?.first_name?.[0]}
                                        {localUser?.last_name?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-2xl font-semibold text-foreground">
                                        {localUser?.first_name} {localUser?.last_name}
                                    </h2>
                                    <p className="text-muted-foreground mb-2">{localUser?.email}</p>
                                    {formData.preferred_role && (
                                        <Badge variant="secondary" className="mb-4">
                                            <Target className="w-3 h-3 mr-1" />
                                            {formData.preferred_role}
                                        </Badge>
                                    )}
                                </div>
                                <Button onClick={() => setMode("edit")} className="shrink-0">
                                    <Edit3 className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                About Me
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-foreground leading-relaxed">
                                {formData.bio || "No bio provided yet. Click edit to add your professional summary."}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ClipboardList className="w-5 h-5" />
                                Skills & Expertise
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {formData.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {formData.skills.map((skill, i) => (
                                        <Badge key={i} variant="outline">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No skills added yet.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="w-5 h-5" />
                                Work Experience
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {formData.work_experience.length > 0 ? (
                                <div className="space-y-4">
                                    {formData.work_experience.map((work, i) => (
                                        <div key={i} className="border-l-2 border-accent pl-4 pb-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-foreground">{work.position}</h3>
                                                    <p className="text-accent font-medium flex items-center gap-1">
                                                        <Building className="w-4 h-4" />
                                                        {work.company}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {work.start_date} - {work.end_date || "Present"}(
                                                        {calculateYears(work.start_date, work.end_date)} yrs)
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No work experience added yet.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GraduationCap className="w-5 h-5" />
                                Education
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {formData.education.length > 0 ? (
                                <div className="space-y-4">
                                    {formData.education.map((edu, i) => (
                                        <div key={i} className="border-l-2 border-secondary pl-4 pb-4">
                                            <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                                            <p className="text-secondary font-medium">{edu.institution}</p>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                                <Calendar className="w-3 h-3" />
                                                {edu.start_date} - {edu.end_date}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No education details added yet.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Resume
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {formData.resume_url ? (
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <p className="text-foreground">Resume uploaded successfully</p>
                                        <p className="text-sm text-muted-foreground">Click to view your current resume</p>
                                    </div>
                                    <Button variant="outline" asChild>
                                        <a href={formData.resume_url} target="_blank" rel="noopener noreferrer">
                                            <FileText className="w-4 h-4 mr-2" />
                                            View Resume
                                        </a>
                                    </Button>
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No resume uploaded yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        {mode === "add" ? "Create Your Profile" : "Edit Your Profile"}
                    </h1>
                    <p className="text-muted-foreground">
                        {mode === "add"
                            ? "Let's build your professional profile to showcase your expertise"
                            : "Update your information to keep your profile current"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Professional Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder="Write a compelling summary of your professional background, key achievements, and career objectives..."
                                rows={5}
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className="resize-none"
                                required
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="w-5 h-5" />
                                Preferred Role
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Input
                                type="text"
                                placeholder="e.g., Senior Software Engineer, Product Manager, Data Scientist"
                                value={formData.preferred_role || ""}
                                onChange={(e) => setFormData({ ...formData, preferred_role: e.target.value })}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ClipboardList className="w-5 h-5" />
                                Skills & Expertise
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    placeholder="Add a skill (e.g., JavaScript, Project Management)"
                                    className="flex-1"
                                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                                />
                                <Button type="button" onClick={addSkill} variant="outline">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            {formData.skills.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {formData.skills.map((skill, i) => (
                                        <Badge key={i} variant="secondary" className="flex items-center gap-1">
                                            {skill}
                                            <button type="button" onClick={() => removeSkill(i)} className="ml-1 hover:text-destructive">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="w-5 h-5" />
                                Work Experience
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.work_experience.map((work, index) => (
                                <Card key={index} className="border-l-4 border-l-accent">
                                    <CardContent className="pt-4">
                                        {work.isEditing ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Input
                                                    placeholder="Company Name"
                                                    value={work.company}
                                                    onChange={(e) => updateWorkExperience(index, "company", e.target.value)}
                                                    required
                                                />
                                                <Input
                                                    placeholder="Job Title"
                                                    value={work.position}
                                                    onChange={(e) => updateWorkExperience(index, "position", e.target.value)}
                                                    required
                                                />
                                                <Input
                                                    type="date"
                                                    placeholder="Start Date"
                                                    value={work.start_date || ""}
                                                    onChange={(e) => updateWorkExperience(index, "start_date", e.target.value)}
                                                    required
                                                />
                                                <Input
                                                    type="date"
                                                    placeholder="End Date (leave empty if current)"
                                                    value={work.end_date || ""}
                                                    onChange={(e) => updateWorkExperience(index, "end_date", e.target.value)}
                                                />
                                                <div className="flex gap-2 md:col-span-2">
                                                    <Button
                                                        type="button"
                                                        onClick={() => toggleWorkExperienceEditing(index)}
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        <Save className="w-4 h-4 mr-1" />
                                                        Save
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        onClick={() => removeWorkExperience(index)}
                                                        size="sm"
                                                        variant="destructive"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold text-foreground">{work.position}</h3>
                                                    <p className="text-accent font-medium">{work.company}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {work.start_date} - {work.end_date || "Present"}(
                                                        {calculateYears(work.start_date, work.end_date)} yrs)
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        type="button"
                                                        onClick={() => toggleWorkExperienceEditing(index)}
                                                        size="sm"
                                                        variant="ghost"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </Button>
                                                    <Button type="button" onClick={() => removeWorkExperience(index)} size="sm" variant="ghost">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                            <Button type="button" onClick={addWorkExperience} variant="outline" className="w-full bg-transparent">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Work Experience
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GraduationCap className="w-5 h-5" />
                                Education
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.education.map((edu, index) => (
                                <Card key={index} className="border-l-4 border-l-secondary">
                                    <CardContent className="pt-4">
                                        {edu.isEditing ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Input
                                                    placeholder="Institution Name"
                                                    value={edu.institution}
                                                    onChange={(e) => updateEducation(index, "institution", e.target.value)}
                                                    required
                                                />
                                                <Input
                                                    placeholder="Degree/Qualification"
                                                    value={edu.degree}
                                                    onChange={(e) => updateEducation(index, "degree", e.target.value)}
                                                    required
                                                />
                                                <Input
                                                    type="date"
                                                    placeholder="Start Date"
                                                    value={edu.start_date || ""}
                                                    onChange={(e) => updateEducation(index, "start_date", e.target.value)}
                                                />
                                                <Input
                                                    type="date"
                                                    placeholder="End Date"
                                                    value={edu.end_date || ""}
                                                    onChange={(e) => updateEducation(index, "end_date", e.target.value)}
                                                />
                                                <div className="flex gap-2 md:col-span-2">
                                                    <Button
                                                        type="button"
                                                        onClick={() => toggleEducationEditing(index)}
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        <Save className="w-4 h-4 mr-1" />
                                                        Save
                                                    </Button>
                                                    <Button type="button" onClick={() => removeEducation(index)} size="sm" variant="destructive">
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                                                    <p className="text-secondary font-medium">{edu.institution}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {edu.start_date} - {edu.end_date}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button type="button" onClick={() => toggleEducationEditing(index)} size="sm" variant="ghost">
                                                        <Edit3 className="w-4 h-4" />
                                                    </Button>
                                                    <Button type="button" onClick={() => removeEducation(index)} size="sm" variant="ghost">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                            <Button type="button" onClick={addEducation} variant="outline" className="w-full bg-transparent">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Education
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="w-5 h-5" />
                                Resume Upload
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) =>
                                    setFormData({ ...formData, resume_file: e.target.files?.[0] || null, resume_url: null })
                                }
                                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-accent file:text-accent-foreground hover:file:bg-accent/80"
                            />

                            {formData.resume_url && (
                                <div className="p-4 bg-muted rounded-lg">
                                    <p className="font-medium text-foreground mb-2">Current Resume:</p>
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={formData.resume_url} target="_blank" rel="noopener noreferrer">
                                            <FileText className="w-4 h-4 mr-2" />
                                            View Current Resume
                                        </a>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setFormData(originalData)
                                setMode("view")
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save Profile"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
