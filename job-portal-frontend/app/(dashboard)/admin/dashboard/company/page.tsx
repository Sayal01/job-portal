"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { API_URL } from "@/lib/config"

interface Company {
    id: number
    company_name: string
    is_verified: boolean
    website?: string | null
    created_at: string
    updated_at: string
}

export default function AdminCompaniesPage() {
    const [companies, setCompanies] = useState<Company[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [filterVerified, setFilterVerified] = useState<"all" | "verified" | "unverified">("all")

    const token = Cookies.get("AuthToken")

    const fetchCompanies = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await axios.get(`${API_URL}/admin/companies`, {
                headers: { Authorization: `Bearer ${token}` },
                params:
                    filterVerified === "all"
                        ? {}
                        : { is_verified: filterVerified === "verified" },
            })
            setCompanies(res.data.data)
        } catch (err) {
            console.error(err)
            setError("Failed to load companies.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCompanies()
    }, [filterVerified])

    const handleVerifyToggle = async (companyId: number, verify: boolean) => {
        try {
            await axios.post(
                `${API_URL}/admin/companies/${companyId}/${verify ? "verify" : "unverify"}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            fetchCompanies()
        } catch (err) {
            console.error(err)
            alert("Failed to update company verification status.")
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Companies</h1>

                {/* Filter Buttons */}
                <div className="mb-6 flex gap-3">
                    {["all", "verified", "unverified"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterVerified(status as any)}
                            className={`px-4 py-2 rounded ${filterVerified === status ? "bg-blue-600 text-white" : "bg-gray-200"
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="text-red-600">{error}</p>
                ) : companies.length === 0 ? (
                    <p>No companies found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {companies.map((company) => (
                            <div
                                key={company.id}
                                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200"
                            >
                                <h2 className="text-lg font-bold mb-1">{company.company_name}</h2>
                                {company.website && (
                                    <p className="text-sm text-gray-500 mb-2">Website: {company.website}</p>
                                )}
                                <p className="text-sm mb-2">
                                    Status:{" "}
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${company.is_verified
                                            ? "bg-green-100 text-green-800 border border-green-200"
                                            : "bg-red-100 text-red-800 border border-red-200"
                                            }`}
                                    >
                                        {company.is_verified ? "Verified" : "Unverified"}
                                    </span>
                                </p>

                                <div className="flex gap-2">
                                    {/* Show Verify button if company is not verified */}
                                    {!company.is_verified ? (
                                        <button
                                            onClick={() => handleVerifyToggle(company.id, true)}
                                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                        >
                                            Verify
                                        </button>
                                    ) : (
                                        // Show Unverify button if company is verified
                                        <button
                                            onClick={() => handleVerifyToggle(company.id, false)}
                                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                        >
                                            Unverify
                                        </button>
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
