"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { API_URL } from "@/lib/config";
interface Company {
    id: number;
    company_name: string;
    website?: string;
    created_at: string;
}

export default function ManageCompaniesPage() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const token = Cookies.get("AuthToken");
    useEffect(() => {
        async function fetchCompanies() {
            try {
                const res = await fetch(`${API_URL}/admin/companies`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });
                const data = await res.json();
                setCompanies(data.companies || []);
            } catch (err) {
                console.error("Failed to fetch companies", err);
            } finally {
                setLoading(false);
            }
        }

        fetchCompanies();
    }, []);

    async function deleteCompany(id: number) {
        if (!confirm("Are you sure you want to delete this company?")) return;
        await fetch(`/api/admin/companies/${id}`, { method: "DELETE" });
        setCompanies((prev) => prev.filter((c) => c.id !== id));
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Manage Companies</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="w-full border">
                    <thead>
                        <tr>
                            <th className="p-2 border">ID</th>
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Website</th>
                            <th className="p-2 border">Created</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map((company) => (
                            <tr key={company.id}>
                                <td className="p-2 border">{company.id}</td>
                                <td className="p-2 border">{company.company_name}</td>
                                <td className="p-2 border">
                                    {company.website ? (
                                        <a
                                            href={company.website}
                                            className="text-blue-600 underline"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {company.website}
                                        </a>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                                <td className="p-2 border">
                                    {new Date(company.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-2 border">
                                    <button
                                        className="text-red-600 hover:underline"
                                        onClick={() => deleteCompany(company.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {companies.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center p-4">
                                    No companies found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}
