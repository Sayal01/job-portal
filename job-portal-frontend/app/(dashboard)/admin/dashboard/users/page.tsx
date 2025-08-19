"use client"
import { useEffect, useState } from "react"
import type React from "react"
import { Trash2 } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { API_URL } from "@/lib/config" // Assuming this is defined elsewhere
import Cookies from "js-cookie" // Assuming this is installed


interface User {
    id: number
    first_name: string
    last_name: string
    email: string
    role: string
}

const roles = [
    { value: "", label: "All Roles" },
    { value: "admin", label: "Admin" },
    { value: "job_seeker", label: "Job Seeker" },
    { value: "employer", label: "Employer" },
]

export default function ManageUsersPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const currentRole = searchParams.get("role") || ""
    const token = Cookies.get("AuthToken")
    const user = Cookies.get("user")
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    console.log(user)
    useEffect(() => {
        async function fetchUsers() {
            setLoading(true)
            try {
                const res = await fetch(`${API_URL}/admin/users${currentRole ? `?role=${currentRole}` : ""}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                })
                const data = await res.json()
                setUsers(data.users || [])
            } catch (err) {
                console.error("Failed to fetch users", err)
            } finally {
                setLoading(false)
            }
        }
        fetchUsers()
    }, [currentRole, token])

    function handleRoleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const newRole = e.target.value
        const query = newRole ? `?role=${newRole}` : ""
        router.push(`/admin/dashboard/users/${query}`)
    }

    async function deleteUser(id: number) {
        const loggedInUser = user ? JSON.parse(user) : null;

        if (loggedInUser?.id === id) {
            alert("You cannot delete your own account.");
            return;
        }

        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            const res = await fetch(`${API_URL}/admin/users/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                setUsers((prev) => prev.filter((u) => u.id !== id));
            } else {
                console.error("Failed to delete user");
                alert("Failed to delete user. You may not have permission.Cant delete Self");
            }
        } catch (err) {
            console.log("Error deleting user", err);
            alert("An error occurred while deleting the user.");
        }
    }


    return (
        <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900">Manage Users</h1>
                <div className="relative">
                    <select
                        value={currentRole}
                        onChange={handleRoleChange}
                        className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                    >
                        {roles.map((role) => (
                            <option key={role.value} value={role.value}>
                                {role.label}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </div>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-lg text-gray-500">Loading users...</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    S.N
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Name
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Email
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Role
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((u, index) => (
                                <tr key={u.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {u.first_name} {u.last_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{u.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap  text-sm font-medium">

                                        <button
                                            onClick={() => deleteUser(u.id)}
                                            title="Delete user"
                                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
