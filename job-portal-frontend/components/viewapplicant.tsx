"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useParams } from "next/navigation"
import { API_IMG, API_URL } from "@/lib/config"
import Loader from "@/components/Loader"
import {
    User,
    Mail,
    Building2,
    GraduationCap,
    Briefcase,
    FileText,
    ArrowLeft,
    Calendar,
    Award,
    Star,
} from "lucide-react"

import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

type Education = {
    institution: string
    degree: string
    year: string
}

type WorkExperience = {
    company: string
    position: string
    years: string
}

type JobSeekerProfile = {
    bio: string
    skills: string[]
    education: Education[]
    work_experience: WorkExperience[]
    resume_url: string | null
}

type LocalUser = {
    first_name: string
    last_name: string
    email: string
    image?: string | null
}

export default function EmployerViewApplicantPage() {
    const { id } = useParams()
    const router = useRouter()
    const [profile, setProfile] = useState<JobSeekerProfile | null>(null)
    const [localUser, setLocalUser] = useState<LocalUser | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = Cookies.get("AuthToken")
        const fetchApplicant = async () => {
            try {
                const res = await axios.get(`${API_URL}/applications/applicant/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                const { user } = res.data

                setLocalUser({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    image: user.image || null,
                })

                setProfile({
                    bio: user.profile.bio || "",
                    skills: user.profile.skills || [],
                    education: user.profile.education || [],
                    work_experience: user.profile.work_experience || [],
                    resume_url: user.profile.resume_file ? `${API_IMG}/${user.profile.resume_file}` : null,
                })
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchApplicant()
    }, [id])

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-background">
                <Loader />
            </div>
        )
    }

    if (!localUser || !profile) {
        return (
            <div className="min-h-screen bg-background p-8">
                <div className="max-w-2xl mx-auto">
                    <Card className="border-0 shadow-lg">
                        <CardContent className="text-center py-16">
                            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                                <User className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-3">Applicant Not Found</h2>
                            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                                The requested applicant profile could not be found or may have been removed.
                            </p>
                            <Button onClick={() => router.back()} size="lg" className="bg-secondary hover:bg-secondary/90">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Return to Applications
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="bg-card border-b border-border">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => router.back()}
                                    className="text-muted-foreground hover:text-foreground -ml-2"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-1" />
                                    Back
                                </Button>
                                <Separator orientation="vertical" className="h-4" />
                                <span className="text-sm text-muted-foreground">Candidate Profile</span>
                            </div>
                            <h1 className="text-3xl font-bold text-foreground">
                                {localUser.first_name} {localUser.last_name}
                            </h1>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Button variant="outline" size="lg">
                                <Mail className="w-4 h-4 mr-2" />
                                Contact
                            </Button>
                            <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                                <Star className="w-4 h-4 mr-2" />
                                Shortlist
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-6 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Profile Summary Card */}
                        <Card className="border-0 shadow-lg">
                            <CardContent className="p-8">
                                <div className="flex items-start space-x-6">
                                    <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                                        <AvatarImage
                                            src={localUser.image ? `${API_IMG}/${localUser.image}` : undefined}
                                            alt={`${localUser.first_name} ${localUser.last_name}`}
                                        />
                                        <AvatarFallback className="text-2xl font-semibold bg-secondary text-secondary-foreground">
                                            {localUser.first_name[0]}
                                            {localUser.last_name[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-foreground mb-2">
                                                {localUser.first_name} {localUser.last_name}
                                            </h2>
                                            <div className="flex items-center text-muted-foreground">
                                                <Mail className="w-4 h-4 mr-2" />
                                                <span className="text-sm">{localUser.email}</span>
                                            </div>
                                        </div>
                                        {profile.bio && (
                                            <div className="bg-muted/50 rounded-lg p-4">
                                                <h3 className="font-semibold text-foreground mb-2">About</h3>
                                                <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center text-xl">
                                    <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center mr-3">
                                        <Award className="w-4 h-4 text-secondary" />
                                    </div>
                                    Skills & Expertise
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {profile.skills.length > 0 ? (
                                    <div className="flex flex-wrap gap-3">
                                        {profile.skills.map((skill, i) => (
                                            <Badge
                                                key={i}
                                                variant="secondary"
                                                className="px-4 py-2 text-sm font-medium bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors"
                                            >
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Award className="w-8 h-8 text-muted-foreground" />
                                        </div>
                                        <p className="text-muted-foreground">No skills listed</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center text-xl">
                                    <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center mr-3">
                                        <GraduationCap className="w-4 h-4 text-secondary" />
                                    </div>
                                    Education
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {profile.education.length > 0 ? (
                                    <div className="space-y-6">
                                        {profile.education.map((edu, i) => (
                                            <div key={i} className="relative pl-8">
                                                <div className="absolute left-0 top-2 w-3 h-3 bg-secondary rounded-full border-4 border-background shadow-sm"></div>
                                                {i < profile.education.length - 1 && (
                                                    <div className="absolute left-1.5 top-5 w-0.5 h-12 bg-border"></div>
                                                )}
                                                <div className="bg-card rounded-lg p-6 border border-border">
                                                    <h4 className="font-bold text-foreground text-lg mb-1">{edu.institution}</h4>
                                                    <p className="text-muted-foreground font-medium mb-2">{edu.degree}</p>
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <Calendar className="w-3 h-3 mr-1" />
                                                        {edu.year}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                            <GraduationCap className="w-8 h-8 text-muted-foreground" />
                                        </div>
                                        <p className="text-muted-foreground">No education details provided</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center text-xl">
                                    <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center mr-3">
                                        <Briefcase className="w-4 h-4 text-secondary" />
                                    </div>
                                    Work Experience
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {profile.work_experience.length > 0 ? (
                                    <div className="space-y-6">
                                        {profile.work_experience.map((work, i) => (
                                            <div key={i} className="relative pl-8">
                                                <div className="absolute left-0 top-2 w-3 h-3 bg-secondary rounded-full border-4 border-background shadow-sm"></div>
                                                {i < profile.work_experience.length - 1 && (
                                                    <div className="absolute left-1.5 top-5 w-0.5 h-16 bg-border"></div>
                                                )}
                                                <div className="bg-card rounded-lg p-6 border border-border">
                                                    <h4 className="font-bold text-foreground text-lg mb-1">{work.position}</h4>
                                                    <div className="flex items-center text-muted-foreground font-medium mb-2">
                                                        <Building2 className="w-4 h-4 mr-2" />
                                                        {work.company}
                                                    </div>
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <Calendar className="w-3 h-3 mr-1" />
                                                        {work.years}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Briefcase className="w-8 h-8 text-muted-foreground" />
                                        </div>
                                        <p className="text-muted-foreground">No work experience listed</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center text-lg">
                                    <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center mr-3">
                                        <FileText className="w-4 h-4 text-secondary" />
                                    </div>
                                    Resume
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {profile.resume_url ? (
                                    <div className="space-y-4">
                                        <div className="bg-muted/50 rounded-lg p-4 text-center">
                                            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                                                <FileText className="w-6 h-6 text-secondary" />
                                            </div>
                                            <p className="font-medium text-foreground mb-1">Resume Document</p>
                                            <p className="text-sm text-muted-foreground">PDF Format</p>
                                        </div>
                                        <Button asChild className="w-full bg-secondary hover:bg-secondary/90" size="lg">
                                            <a href={profile.resume_url} target="_blank" rel="noopener noreferrer">
                                                <FileText className="w-4 h-4 mr-2" />
                                                View Resume
                                            </a>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FileText className="w-8 h-8 text-muted-foreground" />
                                        </div>
                                        <p className="text-muted-foreground text-sm">No resume uploaded</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                                    <Mail className="w-4 h-4 mr-3" />
                                    Send Message
                                </Button>
                                <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                                    <Calendar className="w-4 h-4 mr-3" />
                                    Schedule Interview
                                </Button>
                                <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                                    <Star className="w-4 h-4 mr-3" />
                                    Add to Favorites
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
