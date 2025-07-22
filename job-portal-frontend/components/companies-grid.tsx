"use client"

import { useState } from "react"
import { CompanyCard } from "./companies-card"
import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"

// ✅ Match the real backend type
export interface Company {
    id: number
    user_id: number
    company_name: string
    description: string | null
    website: string | null
    logo: string | null
    created_at: string
    updated_at: string
    jobs_count: number
}

interface CompaniesGridProps {
    companies: Company[]
    loading?: boolean
}

export function CompaniesGrid({ companies, loading }: CompaniesGridProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const companiesPerPage = 9

    const totalPages = Math.ceil(companies.length / companiesPerPage)
    const startIndex = (currentPage - 1) * companiesPerPage
    const displayedCompanies = companies.slice(startIndex, startIndex + companiesPerPage)

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 rounded-lg h-80"></div>
                    </div>
                ))}
            </div>
        )
    }

    if (companies.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🏢</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
            </div>
        )
    }

    return (
        <div>
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold text-gray-900">{companies.length} Companies Found</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 className="h-4 w-4" />
                        <span>
                            Showing {startIndex + 1}-{Math.min(startIndex + companiesPerPage, companies.length)} of{" "}
                            {companies.length}
                        </span>
                    </div>
                </div>
            </div>

            {/* Companies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {displayedCompanies.map((company) => (
                    <CompanyCard key={company.id} company={company} />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className="w-10"
                            >
                                {page}
                            </Button>
                        ))}
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    )
}
