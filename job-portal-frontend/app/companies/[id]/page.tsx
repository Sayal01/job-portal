"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import { API_URL, API_IMG } from "@/lib/config"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Briefcase, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// ✅ Type for a single company (matches your backend)
interface Company {
    id: number
    company_name: string
    description: string | null
    website: string | null
    logo: string | null
    jobs_count: number
    jobs: Job[]
}

// ✅ Type for a single job (basic example)
interface Job {
    id: number
    title: string
    description: string
    location: string
    // Add other fields you need
}

export default function CompanyDetailsPage() {
    const { id } = useParams<{ id: string }>()
    const [company, setCompany] = useState<Company | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const response = await axios.get(`${API_URL}/companies/${id}`)
                if (response.data.status) {
                    setCompany(response.data.company)
                } else {
                    setError("Company not found")
                }
            } catch (err) {
                setError("Failed to load company details")
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchCompany()
        }
    }, [id])

    if (loading) return <div>Loading company details...</div>
    if (error) return <div className="text-red-600">{error}</div>
    if (!company) return <div>No company found.</div>

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 space-y-10">
            {/* ✅ Company Details */}
            <Card>
                <CardContent className="p-6 flex gap-6 items-start">
                    <Avatar className="h-20 w-20 border-2 border-gray-200">
                        <AvatarImage
                            src={company.logo ? `${API_IMG}/${company.logo}` : "/placeholder.svg"}
                            alt={company.company_name}
                        />
                        <AvatarFallback>
                            {company.company_name
                                .split(" ")
                                .map((word) => word[0])
                                .join("")
                                .slice(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                        <h1 className="text-2xl font-bold text-gray-900">{company.company_name}</h1>
                        <p className="text-gray-700">{company.description || "No description provided."}</p>
                        <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-gray-800">{company.jobs_count} Open Jobs</span>
                            {company.website && (
                                <Link
                                    href={company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                >
                                    Visit Website
                                    <ExternalLink className="h-3 w-3" />
                                </Link>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ✅ Jobs List */}
            <section>
                <h2 className="text-xl font-semibold mb-4">
                    {company.jobs.length} Jobs at {company.company_name}
                </h2>

                {company.jobs.length === 0 ? (
                    <p className="text-gray-600">No jobs posted yet.</p>
                ) : (
                    <div className="space-y-4">
                        {company.jobs.map((job) => (
                            <Card key={job.id}>
                                <CardContent className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                                        <p className="text-sm text-gray-600">{job.location}</p>
                                    </div>
                                    <Button asChild>
                                        <Link href={`/jobs/${job.id}`}>View Job</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
