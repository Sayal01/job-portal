"use client"

import { useState, useMemo, useEffect } from "react"
import axios from "axios"
import { CompaniesGrid } from "@/components/companies-grid"
import { API_URL } from "@/lib/config"
import Loader from "@/components/Loader"

// ✅ Define type
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

export default function CompaniesPage() {
    const [companies, setCompanies] = useState<Company[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [searchQuery] = useState("")
    const [selectedIndustry] = useState("")
    const [selectedSize] = useState("")
    const [selectedLocation] = useState("")
    const [sortBy] = useState("featured")

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setLoading(true)
                const response = await axios.get(`${API_URL}/companies`)
                if (response.data.status && response.data.companies) {
                    setCompanies(response.data.companies)
                } else {
                    setError("Failed to load companies")
                }
            } catch (err) {
                setError("An error occurred while fetching companies: " + err)
            } finally {
                setLoading(false)
            }
        }

        fetchCompanies()
    }, [])

    const filteredAndSortedCompanies = useMemo(() => {
        const filtered = companies.filter((company) => {
            const matchesSearch =
                company.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (company.description && company.description.toLowerCase().includes(searchQuery.toLowerCase()))

            const matchesIndustry = !selectedIndustry // Adjust if you have industry
            const matchesSize = !selectedSize // Adjust if you have size
            const matchesLocation = !selectedLocation // Adjust if you have location

            return matchesSearch && matchesIndustry && matchesSize && matchesLocation
        })

        filtered.sort((a, b) => {
            switch (sortBy) {
                case "featured":
                    return b.jobs_count - a.jobs_count
                case "name":
                    return a.company_name.localeCompare(b.company_name)
                case "jobs":
                    return b.jobs_count - a.jobs_count
                default:
                    return 0
            }
        })

        return filtered
    }, [companies, searchQuery, selectedIndustry, selectedSize, selectedLocation, sortBy])

    if (loading) return <> <Loader /></>
    if (error) return <p className="text-red-600">{error}</p>

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Companies</h1>
                    <p className="text-gray-600">
                        Explore {companies.length} companies and find your next career opportunity.
                    </p>
                </div>
                <CompaniesGrid companies={filteredAndSortedCompanies} />
            </div>
        </div>
    )
}
