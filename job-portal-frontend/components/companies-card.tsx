"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Briefcase, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Company } from "./companies-grid" // ✅ reuse the correct type
import { API_IMG } from "@/lib/config"

interface CompanyCardProps {
    company: Company
}

export function CompanyCard({ company }: CompanyCardProps) {
    // const [isFollowing, setIsFollowing] = useState(false)

    return (
        <Card className="group hover:shadow-lg transition-all duration-200 border-gray-200 hover:border-gray-300 relative overflow-hidden">
            <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-gray-100">
                            <AvatarImage
                                src={company.logo ? `${API_IMG}/storage/${company.logo}` : "/placeholder.svg"}
                                alt={company.company_name}
                            />
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                                {company.company_name
                                    .split(" ")
                                    .map((word) => word[0])
                                    .join("")
                                    .slice(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {company.company_name}
                            </h3>
                            {company.website && (
                                <a
                                    href={company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                >
                                    Visit Website
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-3 mb-4">
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {company.description || "No description provided."}
                    </p>
                </div>

                {/* Open Jobs */}
                <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-gray-900">
                            {company.jobs_count} Open Positions
                        </span>
                    </div>
                    {company.jobs_count > 10 && (
                        <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100">
                            Hiring
                        </Badge>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <Button asChild className="flex-1">
                        <Link href={`/companies/${company.id}`}>View Company</Link>
                    </Button>
                    {/* Example: Follow button if you want it */}
                    {/* 
          <Button
            variant="outline"
            onClick={() => setIsFollowing(!isFollowing)}
            className={`${isFollowing ? "bg-blue-50 text-blue-600 border-blue-200" : ""}`}
          >
            {isFollowing ? "Following" : "Follow"}
          </Button>
          */}
                </div>
            </CardContent>
        </Card>
    )
}
