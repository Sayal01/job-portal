import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, DollarSign, Building } from "lucide-react"
import Link from "next/link"
import Image from "next/image"



interface Company {
    id: string;
    user_id: string;
    company_name: string;
    description: string;
    website: string;
    created_at: string;
    updated_at: string;
}

interface Job {
    id: string;
    title: string;
    company: Company;
    location: string;
    type: string;
    salary_min: string;
    salary_max: string;
    description: string;
    requirements: string[] | null;
    skills: string[] | null;
    start_date: string;
    application_deadline: string;
}


interface JobCardProps {
    job: Job
}

export function JobCard({ job }: JobCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <Image
                            src="https://placehold.co/800x800"
                            alt={`${job.company.company_name} logo`}
                            width={48}
                            height={48}
                            className="rounded-lg border"
                        />

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                            <div className="flex items-center gap-4 text-gray-600 text-sm">
                                <div className="flex items-center gap-1">
                                    <Building className="h-4 w-4" />
                                    {job.company.company_name}
                                </div>
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {job.location}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {job.application_deadline ? new Date(job.application_deadline).toLocaleDateString() : "N/A"}
                                </div>
                            </div>
                        </div>

                    </div>
                    <Badge variant="secondary">{job.type}</Badge>
                </div>
            </CardHeader>

            <CardContent>
                <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                <div className="flex items-center gap-2 mb-4">
                    {/* <DollarSign className="h-4 w-4 text-green-600" /> */}
                    <span className="font-medium text-green-600">RS {job.salary_min} - {job.salary_max}</span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                        {(job.skills || []).slice(0, 2).map((req, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                                {req}
                            </Badge>
                        ))}

                        {job.skills && job.skills.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                                +{job.skills.length - 2} more
                            </Badge>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {/* <Button variant="outline" size="sm">
                            Save
                        </Button> */}
                        <Button size="sm" asChild>
                            <Link href={`/jobs/${job.id}`}>View Details</Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
